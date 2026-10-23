const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "input:not(:disabled):not([type='hidden'])",
  "select:not(:disabled)",
  "textarea:not(:disabled)",
  "summary",
  "[tabindex]",
].join(",");

// Metadata and live-region elements never take focus; leave them untouched.
const UNRENDERED_TAGS = new Set([
  "LINK",
  "META",
  "NEXT-ROUTE-ANNOUNCER",
  "NOSCRIPT",
  "SCRIPT",
  "STYLE",
  "TEMPLATE",
  "TITLE",
]);

export function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.closest("[inert]") &&
      element.getClientRects().length > 0,
  );
}

/**
 * Makes everything outside `keep` inert and returns a function that restores
 * it. Native modal dialogs stay live because they render in the top layer.
 */
export function isolateFromBackground(keep: HTMLElement[]) {
  const isolated: HTMLElement[] = [];

  function visit(parent: Element) {
    for (const child of Array.from(parent.children)) {
      if (!(child instanceof HTMLElement)) continue;
      if (keep.some((element) => element === child)) continue;
      if (keep.some((element) => child.contains(element))) {
        visit(child);
        continue;
      }
      if (
        child.inert ||
        child instanceof HTMLDialogElement ||
        UNRENDERED_TAGS.has(child.tagName)
      ) {
        continue;
      }
      child.inert = true;
      isolated.push(child);
    }
  }

  visit(document.body);

  return () => {
    for (const element of isolated) {
      element.inert = false;
    }
  };
}
