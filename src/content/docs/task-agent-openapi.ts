import snapshot from "../../../public/openapi/task-agent.json";

type Schema = Record<string, unknown>;
export type Operation = {
  summary?: string;
  description?: string;
  consumes?: string[];
  produces?: string[];
  parameters?: Schema[];
  responses: Record<string, Schema>;
  security?: Record<string, string[]>[];
};
export const taskAgentSpec = snapshot as unknown as {
  swagger: string;
  host: string;
  basePath: string;
  paths: Record<string, Record<string, Operation>>;
  definitions: Record<string, Schema>;
  securityDefinitions: Record<string, Schema>;
  "x-hast-source": string;
  "x-hast-retrieved-at": string;
};
const methods = ["get", "post", "put", "patch", "delete", "head", "options"];
export const taskAgentOperations = Object.entries(taskAgentSpec.paths).flatMap(([path, item]) =>
  methods.filter((method) => item[method]).map((method) => ({ path, method, ...item[method] })),
);

// Preserve constraints and examples; expand local references for readers.
export function expandSchema(value: unknown, seen: string[] = []): unknown {
  if (Array.isArray(value)) return value.map((item) => expandSchema(item, seen));
  if (!value || typeof value !== "object") return value;
  const object = value as Schema;
  if (typeof object.$ref === "string") {
    const name = object.$ref.replace("#/definitions/", "");
    if (seen.includes(name)) return object;
    const target = taskAgentSpec.definitions[name];
    if (!target) throw new Error(`Unresolved OpenAPI reference: ${object.$ref}`);
    return expandSchema({ ...target, ...Object.fromEntries(Object.entries(object).filter(([key]) => key !== "$ref")) }, [...seen, name]);
  }
  return Object.fromEntries(Object.entries(object)
    .filter(([key]) => key !== "x-hast-event-variants")
    .map(([key, item]) => [key, expandSchema(item, seen)]));
}

export const taskAgentApiGroups = [
  ["agent", "Agent 对话"], ["guides", "接入指南"], ["models", "模型"],
  ["webhooks", "Agent 配置"], ["schedules", "定时任务"], ["knowledge-bases", "知识库"],
  ["business-resources", "CRM"], ["chat_memory_projects", "记忆项目"],
  ["prompts", "Prompt"], ["sessions", "会话与事件"], ["skills", "技能"],
  ["channels", "渠道"], ["memories", "记忆"], ["files", "文件"], ["connectors", "连接器"], ["secrets", "机密"],
] as const;
export function operationGroup(path: string) {
  return path.slice("/api/public/v1/".length).split("/")[0].replace(".zip", "");
}
