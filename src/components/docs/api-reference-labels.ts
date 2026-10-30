import type { AppLocale } from "@/i18n/config";

const en = {
  manage: "Manage API keys", intro: "public endpoints are included in this snapshot. Parameters, responses, and authentication come directly from OpenAPI JSON; endpoint descriptions retain the source language.",
  download: "Download OpenAPI JSON", upstream: "View upstream OpenAPI JSON", date: "Snapshot date", format: "Format", base: "Base URL",
  scope: "The download contains AIP public endpoints and their referenced models. Import it into API tools supporting Swagger 2.0. The upstream specification also includes other services.",
  auth: "Authentication", authBefore: "Authenticate with an API key created in AIP. Single-Agent keys use /agent/*; Profile API keys require the permissions for each resource. Use", authAfter: "and keep the key on your server.",
  request: "Request format", unspecified: "No request body format specified", response: "Response format", responseDefault: "See response definitions",
  parameters: "Parameters", required: "Required", optional: "Optional", noParameters: "No parameters declared in the specification.", responses: "Responses", envelope: "Complete Event v2 envelope",
  groups: { agent: "Agent conversations", guides: "Integration guides", models: "Models", webhooks: "Agent configurations", schedules: "Schedules", "knowledge-bases": "Knowledge bases", "business-resources": "CRM", chat_memory_projects: "Memory projects", prompts: "Prompt", sessions: "Sessions and events", skills: "Skills", memories: "Memory", files: "Files", connectors: "Connectors", channels: "Channels", secrets: "Secrets" },
};
const ja: typeof en = {
  manage: "API キーを管理", intro: "件の公開 API を含むスナップショットです。引数、応答、認証は OpenAPI JSON から直接取得し、API 説明は原文のまま表示します。",
  download: "OpenAPI JSON をダウンロード", upstream: "上流の OpenAPI JSON を表示", date: "取得日", format: "形式", base: "ベース URL",
  scope: "ダウンロードにはAIP 公開 API と参照モデルを含みます。Swagger 2.0 対応ツールへ取り込めます。上流仕様には他サービスの API も含まれます。",
  auth: "認証", authBefore: "AIP で作成した API キーを使用します。単一 Agent のキーは /agent/*、Profile API キーはリソースごとの権限が必要です。", authAfter: "を使用し、キーはサーバーで保管してください。",
  request: "リクエスト形式", unspecified: "本文形式の指定なし", response: "応答形式", responseDefault: "応答定義を参照",
  parameters: "引数", required: "必須", optional: "任意", noParameters: "仕様に引数の定義はありません。", responses: "応答", envelope: "Event v2 の完全なエンベロープ",
  groups: { agent: "Agent の会話", guides: "連携ガイド", models: "モデル", webhooks: "Agent 設定", schedules: "スケジュール", "knowledge-bases": "ナレッジベース", "business-resources": "CRM", chat_memory_projects: "メモリプロジェクト", prompts: "Prompt", sessions: "セッションとイベント", skills: "スキル", memories: "メモリ", files: "ファイル", connectors: "コネクター", channels: "チャネル", secrets: "シークレット" },
};
const zh: typeof en = {
  manage: "管理 API 密钥", intro: "个公开接口。参数、响应和认证定义直接来自 OpenAPI JSON，英文接口说明保留源文档原文。",
  download: "下载 OpenAPI JSON", upstream: "查看上游 OpenAPI JSON", date: "快照日期", format: "格式", base: "基础地址",
  scope: "下载文件包含 AIP 公开接口及其引用的模型，可导入支持 Swagger 2.0 的 API 工具。上游规范还包含其他服务接口。",
  auth: "认证", authBefore: "使用 AIP 中创建的 API 密钥认证。单 Agent 对话密钥调用 /agent/*，Profile API 密钥按资源权限调用其他接口。使用", authAfter: "，并在服务端保存密钥。",
  request: "请求格式", unspecified: "无指定请求正文格式", response: "响应格式", responseDefault: "以响应定义为准",
  parameters: "参数", required: "必填", optional: "可选", noParameters: "规范未声明参数。", responses: "响应", envelope: "Event v2 完整信封",
  groups: { agent: "Agent 对话", guides: "接入指南", models: "模型", webhooks: "Agent 配置", schedules: "定时任务", "knowledge-bases": "知识库", "business-resources": "CRM", chat_memory_projects: "记忆项目", prompts: "Prompt", sessions: "会话与事件", skills: "技能", memories: "记忆", files: "文件", connectors: "连接器", channels: "渠道", secrets: "机密" },
};

export function getApiReferenceLabels(locale: AppLocale) {
  return { en, ja, "zh-CN": zh }[locale];
}
