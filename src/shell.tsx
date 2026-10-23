"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type ComponentType, type AnchorHTMLAttributes } from "react";
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { loadDocsSearchIndex } from "./search-index";
import { DocsFeatures, ViewSelector, UpdateFilters } from "./features";
import { Banner, type BannerProps } from "./interactive";
import { slugify } from "./primitives";
import { PanelHostContext, ExampleHostContext } from "./panel";
import { CopyButton } from "./copy-button";
import { getFocusableElements, isolateFromBackground } from "./modal-focus";
import { DocsLocaleProvider, useDocsTranslation, type DocsLocale } from "./i18n";

export interface DocsPageInfo {
  slug: string;
  title: string;
  description: string;
  searchText?: string;
  group: string;
  subgroup?: string;
  toc: { id: string; title: string }[];
}
function NavSubgroup({ title, activeSlug, children }: {
  title: string;
  activeSlug?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(Boolean(activeSlug));
  useEffect(() => {
    if (activeSlug) setOpen(true);
  }, [activeSlug]);
  return (
    <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary className="cursor-pointer" data-active={Boolean(activeSlug)}>{title}</summary>
      <div>{children}</div>
    </details>
  );
}

export function DocsShell(props: Parameters<typeof Shell>[0]) {
  return (
    <DocsLocaleProvider locale={props.locale ?? "zh-CN"}>
      <DocsFeatures>
        <Shell {...props} />
      </DocsFeatures>
    </DocsLocaleProvider>
  );
}
function Shell({
  children,
  pages,
  page,
  basePath = "/docs",
  homeHref = "/",
  externalHeader = false,
  locale = "zh-CN",
  searchIndexUrl,
  banner,
  headerExtras,
  Link = "a",
}: {
  children: ReactNode;
  pages: DocsPageInfo[];
  page: DocsPageInfo;
  basePath?: string;
  homeHref?: string;
  externalHeader?: boolean;
  locale?: DocsLocale;
  searchIndexUrl?: string;
  banner?: BannerProps;
  headerExtras?: ReactNode;
  Link?: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>> | "a";
}) {
  const t = useDocsTranslation();
  const [exampleHost, setExampleHost] = useState<HTMLDivElement | null>(null);
  const [toc, setToc] = useState(page.toc);
  const articleRef = useRef<HTMLDivElement>(null);
  const [panelHost, setPanelHost] = useState<HTMLDivElement | null>(null);
  const [menu, setMenu] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuBackdropRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [activeHeading, setActiveHeading] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const [dark, setDark] = useState(false);
  const [searchState, setSearchState] = useState<{
    url?: string;
    status: "loading" | "ready" | "error";
    index?: Record<string, string>;
  }>({ status: "ready" });
  const ensureSearchIndex = useCallback(() => {
    if (!searchIndexUrl) return;
    setSearchState({ url: searchIndexUrl, status: "loading" });
    void loadDocsSearchIndex(searchIndexUrl).then(
      (index) => setSearchState({ url: searchIndexUrl, status: "ready", index }),
      () => setSearchState({ url: searchIndexUrl, status: "error" }),
    );
  }, [searchIndexUrl]);
  const openSearch = useCallback(() => {
    dialog.current?.showModal();
    ensureSearchIndex();
  }, [ensureSearchIndex]);
  useEffect(() => {
    setMenu(false);
    setQuery("");
    setActiveHeading("");
    dialog.current?.close();
  }, [page.slug]);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        openSearch();
      }
      if (event.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, [openSearch]);
  useEffect(() => {
    const button = menuButtonRef.current;
    const sidebar = sidebarRef.current;
    if (!menu || !button || !sidebar) return;
    // The sidebar only overlays the page below the mobile breakpoint.
    const mobile = matchMedia("(max-width: 800px)");
    const closeOnDesktop = () => {
      if (!mobile.matches) setMenu(false);
    };
    const backdrop = menuBackdropRef.current;
    const restoreBackground = isolateFromBackground(
      backdrop ? [button, sidebar, backdrop] : [button, sidebar],
    );
    getFocusableElements(sidebar)[0]?.focus({ preventScroll: true });
    const keepFocusInMenu = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || event.defaultPrevented || dialog.current?.open) {
        return;
      }
      const items = [button, ...getFocusableElements(sidebar)];
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!(active instanceof HTMLElement) || !items.includes(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    mobile.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", keepFocusInMenu);
    return () => {
      mobile.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", keepFocusInMenu);
      restoreBackground();
      const active = document.activeElement;
      if (!active || active === document.body || sidebar.contains(active)) {
        button.focus({ preventScroll: true });
      }
    };
  }, [menu]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible[0]) setActiveHeading(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    toc.forEach((item) => {
      const heading = document.getElementById(item.id);
      if (heading) observer.observe(heading);
    });
    return () => observer.disconnect();
  }, [toc]);
  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    const collect = () => {
      const headings = [
        ...root.querySelectorAll<HTMLElement>("h2,h3,[data-docs-heading]"),
      ].filter((el) => !el.closest("[hidden]"));
      const used = new Set(
        [...root.querySelectorAll("[id]")].map((el) => el.id),
      );
      const next = headings.map((el) => {
        if (!el.id) {
          const base = slugify(el.textContent ?? "section");
          let id = base;
          let n = 2;
          while (used.has(id)) id = `${base}-${n++}`;
          el.id = id;
          used.add(id);
        }
        return { id: el.id, title: el.textContent ?? "" };
      });
      setToc((old) =>
        JSON.stringify(old) === JSON.stringify(next) ? old : next,
      );
    };
    collect();
    const observer = new MutationObserver(collect);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden"],
    });
    return () => observer.disconnect();
  }, [page.slug]);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* Theme still applies when storage is unavailable. */
    }
  };
  const href = (slug: string) => `${basePath}/${slug}`;
  const currentIndex = pages.findIndex((item) => item.slug === page.slug);
  const previous = pages[currentIndex - 1];
  const next = pages[currentIndex + 1];
  const results = pages.filter((item) =>
    `${item.title} ${item.description} ${item.slug} ${(searchState.url === searchIndexUrl ? searchState.index?.[item.slug] : undefined) ?? item.searchText ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  const navLink = (item: DocsPageInfo) => (
    <Link
      key={item.slug}
      href={href(item.slug)}
      aria-current={item.slug === page.slug ? "page" : undefined}
    >
      {item.title}
    </Link>
  );
  return (
    <PanelHostContext.Provider value={panelHost}>
      <ExampleHostContext.Provider value={exampleHost}>
        <div
          className="docs-root"
          data-external-header={externalHeader || undefined}
        >
          <a href="#docs-content" className="docs-skip">
            {t("跳转到主要内容")}
          </a>
          {!externalHeader && (
            <header className="docs-header">
              <button
                type="button"
                className="docs-icon-button docs-menu-button cursor-pointer"
                ref={menuButtonRef}
                aria-label={t("打开文档导航")}
                aria-expanded={menu}
                onClick={() => setMenu(!menu)}
              >
                {menu ? <X size={19} /> : <Menu size={19} />}
              </button>
              <a className="docs-brand" href={href("overview")}>
                <span>◈</span>hast
                <span style={{ fontSize: 14, marginLeft: 8, letterSpacing: 0 }}>
                  docs
                </span>
              </a>
              {headerExtras}
              <nav aria-label={t("主导航")}>
                <a href={href("overview")} aria-current="page">
                  {t("文档")}
                </a>
                {pages.some((item) => item.slug === "components") && (
                  <a href={href("components")}>{t("组件")}</a>
                )}
                {pages.some((item) => item.slug === "quickstart") && (
                  <a href={href("quickstart")}>{t("快速入门")}</a>
                )}
              </nav>
              <div className="docs-header-actions">
                <button
                  className="docs-icon-button cursor-pointer"
                  type="button"
                  aria-label={t("搜索文档")}
                  onClick={openSearch}
                >
                  <Search size={17} />
                </button>
                <a className="docs-header-cta" href={homeHref}>
                  {t("Hast 首页")}
                </a>
                <button
                  className="docs-icon-button cursor-pointer"
                  type="button"
                  aria-label={dark ? t("切换浅色主题") : t("切换深色主题")}
                  onClick={toggleTheme}
                >
                  {dark ? <Moon size={17} /> : <Sun size={17} />}
                </button>
              </div>
            </header>
          )}
          {externalHeader && (
            <div className="docs-mobile-toolbar">
              <button
                type="button"
                className="docs-icon-button cursor-pointer"
                ref={menuButtonRef}
                aria-label={t("打开文档导航")}
                aria-expanded={menu}
                onClick={() => setMenu(!menu)}
              >
                {menu ? <X size={18} /> : <Menu size={18} />}
              </button>
              <span>{page.title}</span>
              <button
                type="button"
                className="docs-icon-button cursor-pointer"
                aria-label={t("搜索文档")}
                onClick={openSearch}
              >
                <Search size={18} />
              </button>
            </div>
          )}
          {menu && (
            <button
              className="docs-mobile-backdrop cursor-pointer"
              ref={menuBackdropRef}
              tabIndex={-1}
              aria-label={t("关闭导航")}
              onClick={() => setMenu(false)}
            />
          )}
          {banner && <Banner {...banner} />}
          <div className="docs-layout">
            <aside className="docs-sidebar" data-open={menu} ref={sidebarRef}>
              <button
                className="docs-search-trigger cursor-pointer"
                type="button"
                onClick={openSearch}
              >
                <Search size={14} />
                {t("搜索文档…")}<kbd>⌘ K</kbd>
              </button>
              <nav aria-label={t("文档导航")}>
                {[...new Set(pages.map((item) => item.group))].map((group) => (
                  <section className="docs-nav-group" key={group}>
                    <h2>{group === "组件" ? t("创建内容") : group}</h2>
                    {group === "组件" ? (
                      <details open>
                        <summary className="cursor-pointer">{t("组件")}</summary>
                        <div>
                          {pages.filter((item) => item.group === group).map(navLink)}
                        </div>
                      </details>
                    ) : (
                      <>
                        {pages.filter((item) => item.group === group && !item.subgroup).map(navLink)}
                        {[...new Set(pages.filter((item) => item.group === group && item.subgroup).map((item) => item.subgroup!))].map((subgroup) => (
                          <NavSubgroup key={subgroup} title={subgroup}
                            activeSlug={page.group === group && page.subgroup === subgroup ? page.slug : undefined}>
                            {pages.filter((item) => item.group === group && item.subgroup === subgroup).map(navLink)}
                          </NavSubgroup>
                        ))}
                      </>
                    )}
                  </section>
                ))}
              </nav>
            </aside>
            <main id="docs-content" className="docs-article" lang={locale}>
              <ViewSelector />
              <header className="docs-page-header">
                <p className="docs-eyebrow">{page.group}</p>
                <div className="docs-title-row">
                  <h1>{page.title}</h1>
                  <CopyButton
                    text={`${page.title}\n\n${page.description}\n\n${typeof window !== "undefined" ? window.location.href : ""}`}
                    label={t("复制页面链接")}
                  />
                </div>
                <p className="docs-description">{page.description}</p>
              </header>
              <div className="docs-prose" ref={articleRef}>
                {children}
              </div>
              <nav aria-label={t("上一页和下一页")} className="docs-pagination">
                {previous && (
                  <Link href={href(previous.slug)} rel="prev">
                    <span className="docs-pagination-title">
                      {previous.title}
                    </span>
                    <span className="docs-pagination-direction">
                      <ChevronLeft size={16} aria-hidden="true" /> {t("上一页")}
                    </span>
                  </Link>
                )}
                {next && (
                  <Link href={href(next.slug)} rel="next">
                    <span className="docs-pagination-title">{next.title}</span>
                    <span className="docs-pagination-direction">
                      {t("下一页")} <ChevronRight size={16} aria-hidden="true" />
                    </span>
                  </Link>
                )}
              </nav>
            </main>
            <aside className="docs-toc" aria-label={t("页面辅助内容")}>
              <div className="docs-toc-default">
                <h2>
                  <List size={13} /> {t("在此页面")}
                </h2>
                <nav aria-label={t("本页目录")}>
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      aria-current={
                        activeHeading === item.id ? "true" : undefined
                      }
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
              <UpdateFilters />
              <div ref={setPanelHost} className="docs-panel-host" />
              <div ref={setExampleHost} className="docs-example-host" />
            </aside>
          </div>
          {pages.some((item) => item.group === "组件") && (
            <footer className="docs-footer">
              <span>
                组件示例来自{" "}
                <a href="https://github.com/mintlify/docs">Mintlify 开源文档</a>
                （MIT）
              </span>
            </footer>
          )}
          <dialog
            ref={dialog}
            className="docs-search-dialog"
            aria-label={t("搜索文档")}
            onClick={(event) => {
              if (event.target === dialog.current) dialog.current.close();
            }}
          >
            <div className="docs-search-input-row">
              <Search size={19} />
              <input
                autoFocus
                placeholder={t("搜索文档…")}
                aria-label={t("搜索关键词")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                className="docs-icon-button cursor-pointer"
                type="button"
                aria-label={t("关闭搜索")}
                onClick={() => dialog.current?.close()}
              >
                <X size={18} />
              </button>
            </div>
            <div className="docs-search-results">
              {searchIndexUrl && searchState.status === "loading" ? (
                <p role="status">{t("正在加载搜索…")}</p>
              ) : searchIndexUrl && searchState.status === "error" ? (
                <div role="alert">
                  <p>{t("搜索加载失败，请重试。")}</p>
                  <button type="button" className="cursor-pointer" onClick={ensureSearchIndex}>
                    {t("重试")}
                  </button>
                </div>
              ) : results.length ? (
                results.map((item) => (
                  <Link key={item.slug} href={href(item.slug)}>
                    {item.title}
                    <small>{item.description}</small>
                  </Link>
                ))
              ) : (
                <p>{t("没有找到相关文档，请尝试其他关键词。")}</p>
              )}
            </div>
          </dialog>
        </div>
      </ExampleHostContext.Provider>
    </PanelHostContext.Provider>
  );
}
