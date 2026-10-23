"use client";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Icon, type IconValue } from "./primitives";
type ViewEntry = {
  id: string;
  title: string;
  icon?: IconValue;
  iconType?: string;
};
type Features = {
  views: ViewEntry[];
  selectedView: string;
  selectView: (title: string) => void;
  registerView: (entry: ViewEntry) => () => void;
  updateTags: Record<string, string[]>;
  tag: string;
  selectTag: (tag: string) => void;
  registerUpdate: (id: string, tags: string[]) => () => void;
};
export const FeaturesContext = createContext<Features | null>(null);
export function DocsFeatures({ children }: { children: ReactNode }) {
  const [views, setViews] = useState<ViewEntry[]>([]);
  const [selectedView, selectView] = useState("");
  const [updateTags, setUpdateTags] = useState<Record<string, string[]>>({});
  const [tag, selectTag] = useState("");
  const registerView = useCallback((entry: ViewEntry) => {
    setViews((old) => [...old.filter((v) => v.id !== entry.id), entry]);
    return () => setViews((old) => old.filter((v) => v.id !== entry.id));
  }, []);
  const registerUpdate = useCallback((id: string, tags: string[]) => {
    setUpdateTags((old) => ({ ...old, [id]: tags }));
    return () =>
      setUpdateTags((old) => {
        const next = { ...old };
        delete next[id];
        return next;
      });
  }, []);
  const active = views.some((v) => v.title === selectedView)
    ? selectedView
    : (views[0]?.title ?? "");
  return (
    <FeaturesContext.Provider
      value={{
        views,
        selectedView: active,
        selectView,
        registerView,
        updateTags,
        tag,
        selectTag,
        registerUpdate,
      }}
    >
      {children}
    </FeaturesContext.Provider>
  );
}
export function ViewSelector() {
  const state = useContext(FeaturesContext);
  if (!state?.views.length) return null;
  const views = state.views.filter(
    (v, i, all) => all.findIndex((x) => x.title === v.title) === i,
  );
  const selected = views.find((view) => view.title === state.selectedView);
  return (
    <label className="docs-view-selector">
      {selected?.icon && (
        <Icon icon={selected.icon} iconType={selected.iconType} />
      )}
      <span>视图</span>
      <select
        className="cursor-pointer"
        aria-label="选择文档视图"
        value={state.selectedView}
        onChange={(e) => state.selectView(e.target.value)}
      >
        {views.map((v) => (
          <option key={v.title} value={v.title}>
            {v.title}
          </option>
        ))}
      </select>
    </label>
  );
}
export function UpdateFilters() {
  const state = useContext(FeaturesContext);
  const tags = [...new Set(Object.values(state?.updateTags ?? {}).flat())];
  if (!state || !tags.length) return null;
  return (
    <nav aria-label="筛选更新" className="docs-update-filters">
      <strong>筛选更新</strong>
      {["", ...tags].map((tag) => (
        <button
          className="cursor-pointer"
          key={tag}
          type="button"
          aria-pressed={state.tag === tag}
          onClick={() => state.selectTag(tag)}
        >
          {tag || "全部"}
        </button>
      ))}
    </nav>
  );
}
