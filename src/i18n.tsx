"use client";

import { createContext, useContext, type ReactNode } from "react";

export type DocsLocale = "zh-CN" | "en" | "ja";
const LocaleContext = createContext<DocsLocale>("zh-CN");
const messages: Record<"en" | "ja", Record<string, string>> = {
  "en": {
    "正在加载搜索…": "Loading search…",
    "搜索加载失败，请重试。": "Could not load search. Please retry.",
    "重试": "Retry",
    "跳转到主要内容": "Skip to main content",
    "打开文档导航": "Open documentation navigation",
    "简体中文": "English",
    "主导航": "Main navigation",
    "文档": "Documentation",
    "组件": "Components",
    "快速入门": "Quickstart",
    "搜索文档": "Search documentation",
    "Hast 首页": "Hast home",
    "切换浅色主题": "Switch to light theme",
    "切换深色主题": "Switch to dark theme",
    "关闭导航": "Close navigation",
    "搜索文档…": "Search documentation…",
    "文档导航": "Documentation navigation",
    "创建内容": "Create content",
    "复制页面链接": "Copy page link",
    "上一页和下一页": "Previous and next pages",
    "上一页": "Previous",
    "下一页": "Next",
    "页面辅助内容": "Page resources",
    "在此页面": "On this page",
    "本页目录": "Table of contents",
    "搜索关键词": "Search query",
    "关闭搜索": "Close search",
    "没有找到相关文档，请尝试其他关键词。": "No matching documents. Try another search.",
    "复制": "Copy",
    "已复制": "Copied",
    "复制失败，请手动复制": "Copy failed; please copy manually",
    "复制代码": "Copy code",
    "显示子字段": "Show child fields",
    "选择语言": "Select language",
    "内容选项卡": "Content tabs",
    "关闭横幅": "Close banner"
  },
  "ja": {
    "正在加载搜索…": "検索を読み込み中…",
    "搜索加载失败，请重试。": "検索を読み込めませんでした。再試行してください。",
    "重试": "再試行",
    "跳转到主要内容": "本文へ移動",
    "打开文档导航": "ドキュメントナビゲーションを開く",
    "简体中文": "日本語",
    "主导航": "メインナビゲーション",
    "文档": "ドキュメント",
    "组件": "コンポーネント",
    "快速入门": "クイックスタート",
    "搜索文档": "ドキュメントを検索",
    "Hast 首页": "Hast ホーム",
    "切换浅色主题": "ライトテーマに切り替え",
    "切换深色主题": "ダークテーマに切り替え",
    "关闭导航": "ナビゲーションを閉じる",
    "搜索文档…": "ドキュメントを検索…",
    "文档导航": "ドキュメントナビゲーション",
    "创建内容": "コンテンツの作成",
    "复制页面链接": "ページリンクをコピー",
    "上一页和下一页": "前後のページ",
    "上一页": "前のページ",
    "下一页": "次のページ",
    "页面辅助内容": "ページ補助情報",
    "在此页面": "このページの内容",
    "本页目录": "目次",
    "搜索关键词": "検索キーワード",
    "关闭搜索": "検索を閉じる",
    "没有找到相关文档，请尝试其他关键词。": "該当する文書がありません。別のキーワードを試してください。",
    "复制": "コピー",
    "已复制": "コピーしました",
    "复制失败，请手动复制": "コピーできません。手動でコピーしてください",
    "复制代码": "コードをコピー",
    "显示子字段": "子フィールドを表示",
    "选择语言": "言語を選択",
    "内容选项卡": "コンテンツタブ",
    "关闭横幅": "バナーを閉じる"
  }
};

export function DocsLocaleProvider({ locale, children }: { locale: DocsLocale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useDocsTranslation() {
  const locale = useContext(LocaleContext);
  return (text: string) => locale === "zh-CN" ? text : messages[locale][text] ?? text;
}
