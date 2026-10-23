// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion, Banner, Tabs, Tab, Tooltip } from "./interactive";
import { CopyButton } from "./copy-button";
import { Card, Frame, Step, Steps, Prompt, Tile } from "./components";
import { Tree } from "./tree";
import { DocsFeatures, UpdateFilters } from "./features";
import { View } from "./view";
import { Update } from "./update";
import {
  ExampleHostContext,
  PanelHostContext,
  Panel,
  RequestExample,
  ResponseExample,
} from "./panel";
import { DocsShell } from "./shell";

beforeEach(() => {
  localStorage.clear();
  HTMLDialogElement.prototype.close = vi.fn();
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) { this.open = true; });
  history.replaceState(null, "", "/");
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("frontend documentation behavior", () => {
  it("ignores a malformed URL fragment and opens a matching accordion anchor", () => {
    history.replaceState(null, "", "#%E0%A4%A");
    const { container, rerender } = render(<Accordion title="Guide">Content</Accordion>);
    expect(container.querySelector("details")?.open).toBe(false);
    history.replaceState(null, "", "#next-guide");
    rerender(<Accordion title="Next guide">Content</Accordion>);
    expect(container.querySelector("details")?.open).toBe(true);
  });

  it("loads full-text search only on opening, supports retry, and reuses the index", async () => {
    const user = userEvent.setup();
    const pages = [
      { slug: "one", title: "One", description: "", group: "Docs", toc: [] },
      { slug: "two", title: "Two", description: "", group: "Docs", toc: [] },
    ];
    let complete!: (response: Response) => void;
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockImplementationOnce(() => new Promise<Response>((resolve) => { complete = resolve; }));
    vi.stubGlobal("fetch", fetcher);
    render(<DocsShell locale="en" page={pages[0]} pages={pages} searchIndexUrl="/shell.en.json"><h2>Current page</h2></DocsShell>);
    expect(fetcher).not.toHaveBeenCalled();
    await user.keyboard("{Control>}k{/Control}");
    expect(await screen.findByRole("alert")).toBeTruthy();
    await user.click(screen.getByText("Retry"));
    expect(screen.getByText("Loading search…")).toBeTruthy();
    complete(Response.json({ one: "first body", two: "unique-body-keyword" }));
    await waitFor(() => expect(screen.queryByText("Loading search…")).toBeNull());
    await user.type(screen.getByPlaceholderText("Search documentation…"), "unique-body-keyword");
    const results = document.querySelector(".docs-search-results")!;
    expect(results.textContent).toContain("Two");
    expect(results.textContent).not.toContain("One");
    await user.keyboard("{Control>}k{/Control}");
    await waitFor(() => expect(screen.queryByText("Loading search…")).toBeNull());
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("nests API pages under their product and expands the active subgroup", async () => {
    const pages = [
      { slug: "task", title: "Task overview", description: "", group: "Task Agent", toc: [] },
      { slug: "api", title: "API start", description: "", group: "Task Agent", subgroup: "Task Agent API", toc: [] },
    ];
    const { container, rerender } = render(<DocsShell pages={pages} page={pages[0]}>Overview</DocsShell>);
    const disclosure = container.querySelector(".docs-nav-group details") as HTMLDetailsElement;
    expect(disclosure.open).toBe(false);
    expect(disclosure.closest("section")?.querySelector("h2")?.textContent).toBe("Task Agent");
    expect(disclosure.querySelector('a[href="/docs/api"]')).not.toBeNull();
    rerender(<DocsShell pages={pages} page={pages[1]}>API</DocsShell>);
    await waitFor(() => expect(disclosure.open).toBe(true));
    await userEvent.click(disclosure.querySelector("summary")!);
    expect(disclosure.open).toBe(false);
  });

  it("preserves the sidebar DOM and scroll position when the document changes", () => {
    const pages = ["first", "second"].map((slug) => ({
      slug, title: slug, description: "", group: "GTM", toc: [],
    }));
    const { container, rerender } = render(
      <DocsShell page={pages[0]} pages={pages}><h2>First content</h2></DocsShell>,
    );
    const sidebar = container.querySelector(".docs-sidebar")!;
    sidebar.scrollTop = 640;
    rerender(<DocsShell page={pages[1]} pages={pages}><h2>Second content</h2></DocsShell>);
    expect(container.querySelector(".docs-sidebar")).toBe(sidebar);
    expect(sidebar.scrollTop).toBe(640);
    expect(screen.getByRole("link", { name: "second" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("heading", { name: "Second content" })).toBeDefined();
  });
  it("renders product groups and omits unavailable component links", () => {
    const pages = ["AIP", "Task Agent", "GTM"].map((group, index) => ({
      slug: `product-${index}`,
      title: `${group} 产品介绍`,
      description: "",
      group,
      toc: [],
    }));
    render(
      <DocsShell page={pages[0]} pages={pages} basePath="/guide">
        <p>产品正文</p>
      </DocsShell>,
    );
    const navigation = screen.getByRole("navigation", { name: "文档导航" });
    for (const page of pages) {
      expect(navigation.querySelector(`a[href="/guide/${page.slug}"]`)?.textContent).toBe(page.title);
    }
    expect(screen.queryByRole("link", { name: "组件" })).toBeNull();
    expect(screen.queryByRole("link", { name: "快速入门" })).toBeNull();
  });
  it("persists dismissals per banner content and shows changed announcements", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Banner content="First" dismissible />);
    await user.click(screen.getByRole("button", { name: "关闭横幅" }));
    unmount();
    const { rerender } = render(<Banner content="First" dismissible />);
    expect(screen.queryByText("First")).toBeNull();
    rerender(<Banner content="Second" dismissible />);
    expect(screen.getByText("Second")).toBeDefined();
  });
  it("selects a tab from its custom hash and preserves keyboard/sync behavior", async () => {
    history.replaceState(null, "", "#python");
    const user = userEvent.setup();
    render(
      <>
        <Tabs>
          <Tab title="JS" id="js">
            JavaScript content
          </Tab>
          <Tab title="Python" id="python">
            Python content
          </Tab>
        </Tabs>
        <Tabs>
          <Tab title="JS">Other JS</Tab>
          <Tab title="Python">Other Python</Tab>
        </Tabs>
      </>,
    );
    await waitFor(() =>
      expect(
        screen
          .getAllByRole("tab", { name: "Python" })[0]
          .getAttribute("aria-selected"),
      ).toBe("true"),
    );
    await user.click(screen.getAllByRole("tab", { name: "JS" })[0]);
    expect(
      screen
        .getAllByRole("tab", { name: "JS" })
        .every((x) => x.getAttribute("aria-selected") === "true"),
    ).toBe(true);
    await user.keyboard("{ArrowRight}");
    expect(location.hash).toBe("#python");
  });
  it("automatically selects standalone views, hides duplicates and refreshes the TOC", async () => {
    const user = userEvent.setup();
    const page = {
      slug: "test",
      title: "Test",
      description: "",
      group: "",
      toc: [],
    };
    render(
      <DocsShell page={page} pages={[page]}>
        <View title="JS">
          <h2 id="js-guide">JS guide</h2>
        </View>
        <View title="Python">
          <h2 id="python-guide">Python guide</h2>
        </View>
        <View title="Python">Duplicate Python</View>
        <View>Untitled</View>
      </DocsShell>,
    );
    expect(screen.queryByText("Untitled")).toBeNull();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "选择文档视图" }),
      "Python",
    );
    await waitFor(() =>
      expect(
        screen.getByRole("navigation", { name: "本页目录" }).textContent,
      ).toBe("Python guide"),
    );
    expect(screen.getByText("Duplicate Python").hidden).toBe(true);
  });
  it("filters update entries using tag controls and exposes label anchors", async () => {
    const user = userEvent.setup();
    render(
      <DocsFeatures>
        <UpdateFilters />
        <Update label="Version 1" tags={["API"]}>
          First update
        </Update>
        <Update label="Version 2" tags={["UI"]}>
          Second update
        </Update>
      </DocsFeatures>,
    );
    await user.click(screen.getAllByRole("button", { name: "API" })[0]);
    expect(screen.getByText("Second update").closest("section")?.hidden).toBe(
      true,
    );
    expect(screen.getByText("First update").closest("section")?.id).toBe(
      "version-1",
    );
    await user.click(screen.getByRole("button", { name: "全部" }));
    expect(screen.getByText("Second update").closest("section")?.hidden).toBe(
      false,
    );
  });
  it("moves examples into the sidebar, retaining nested Panel content", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const panel = document.createElement("div");
    document.body.append(panel);
    render(
      <PanelHostContext.Provider value={panel}>
        <ExampleHostContext.Provider value={host}>
          <ResponseExample>
            <pre>Response</pre>
          </ResponseExample>
          <RequestExample>
            <pre>Request</pre>
          </RequestExample>
          <Panel>
            <RequestExample>
              <pre>Nested</pre>
            </RequestExample>
          </Panel>
        </ExampleHostContext.Provider>
      </PanelHostContext.Provider>,
    );
    expect(host.textContent).toContain("Request");
    expect(host.textContent).toContain("Response");
    expect(host.textContent).not.toContain("Nested");
    expect(panel.textContent).toContain("Nested");
    host.remove();
    panel.remove();
  });
  it("keeps examples inline on narrow screens", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    const host = document.createElement("div");
    const { container } = render(
      <ExampleHostContext.Provider value={host}>
        <RequestExample>
          <pre>Mobile request</pre>
        </RequestExample>
      </ExampleHostContext.Provider>,
    );
    expect(host.textContent).toBe("");
    expect(container.textContent).toContain("Mobile request");
  });
  it("navigates a tree with arrows, Home/End, sibling expansion and typeahead", async () => {
    const user = userEvent.setup();
    render(
      <Tree>
        <Tree.Folder name="src">
          <Tree.File name="alpha.ts" />
          <Tree.File name="beta.ts" />
        </Tree.Folder>
        <Tree.Folder name="tests">
          <Tree.File name="test.ts" />
        </Tree.Folder>
      </Tree>,
    );
    const root = screen.getByRole("treeitem", { name: /src/ });
    root.focus();
    await user.keyboard("{ArrowRight}{ArrowDown}");
    expect(document.activeElement?.getAttribute("data-name")).toBe("alpha.ts");
    await user.keyboard("b");
    expect(document.activeElement?.getAttribute("data-name")).toBe("beta.ts");
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement?.getAttribute("data-name")).toBe("src");
    await user.keyboard("*");
    expect(
      screen
        .getByRole("treeitem", { name: /tests/ })
        .getAttribute("aria-expanded"),
    ).toBe("true");
    await user.keyboard("{End}");
    expect(document.activeElement?.getAttribute("data-name")).toBe("test.ts");
  });
  it("honors card actions, tile descriptions, step numbers and autoplay video props", () => {
    const { container } = render(
      <>
        <Card
          title="**Start**"
          href="/start"
          cta="Read guide"
          arrow={false}
          type="tip"
        />
        <Tile title="Tile" description="Tile summary" href="/tile">
          Preview
        </Tile>
        <Steps titleSize="h2">
          <Step title="Custom step" stepNumber={7} id="custom-step">
            Step body
          </Step>
        </Steps>
        <Frame>
          <video autoPlay />
        </Frame>
      </>,
    );
    expect(screen.getByText("Read guide")).toBeDefined();
    expect(container.querySelector(".docs-card-arrow")).toBeNull();
    expect(screen.getByText("Tile summary")).toBeDefined();
    expect(screen.getByRole("heading", { name: "Custom step" }).tagName).toBe(
      "H2",
    );
    expect(container.querySelector(".docs-step-number")?.textContent).toBe("7");
    const video = container.querySelector("video")!;
    expect(video.muted && video.loop && video.playsInline).toBe(true);
  });
  it("provides a Tooltip action and an encoded Cursor prompt without auto-launching", () => {
    render(
      <>
        <Tooltip tip="Details" headline="API" cta="Read" href="/guide">
          Hover
        </Tooltip>
        <Prompt description="**Prompt**" actions={["cursor"]}>
          a &amp; b
        </Prompt>
      </>,
    );
    expect(
      screen
        .getByRole("link", { name: "Read ↗", hidden: true })
        .getAttribute("href"),
    ).toBe("/guide");
    expect(
      screen
        .getByRole("link", { name: "在 Cursor 中打开 ↗" })
        .getAttribute("href"),
    ).toBe("cursor://anysphere.cursor-deeplink/prompt?text=a%20%26%20b");
    expect(screen.queryByRole("button", { name: "复制提示" })).toBeNull();
  });
});


describe("localized documentation shell", () => {
  it.each([
    ["en", "Copy code", "Copy page link", "Search documentation…", "On this page"],
    ["ja", "コードをコピー", "ページリンクをコピー", "ドキュメントを検索…", "このページの内容"],
  ] as const)("uses %s labels and keeps navigation in the selected language", (locale, copy, copyLink, search, toc) => {
    const pages = [
      { slug: "overview", title: "Overview", description: "Introduction", group: "AIP", toc: [{ id: "start", title: "Start" }] },
      { slug: "mcp", title: "MCP", description: "Connect", group: "AIP", toc: [] },
    ];
    render(<DocsShell locale={locale} page={pages[0]} pages={pages} basePath={`/${locale}/docs`} externalHeader>
      <h2 id="start">Start</h2><CopyButton text="example" label="复制代码" />
    </DocsShell>);
    expect(screen.getByRole("button", { name: copy })).toBeTruthy();
    expect(screen.getByRole("button", { name: copyLink })).toBeTruthy();
    expect(screen.getByPlaceholderText(search)).toBeTruthy();
    expect(screen.getByRole("heading", { name: toc })).toBeTruthy();
    expect(document.querySelector("main")?.getAttribute("lang")).toBe(locale);
    for (const link of screen.getAllByRole("link", { name: /MCP/ })) {
      expect(link.getAttribute("href")).toBe(`/${locale}/docs/mcp`);
    }
    expect(screen.queryByText("搜索文档…")).toBeNull();
  });
});
