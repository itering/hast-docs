import { describe, expect, it } from "vitest";
import { taskAgentSpec, taskAgentOperations, expandSchema, operationGroup, taskAgentApiGroups } from "./task-agent-openapi";

describe("AIP public OpenAPI snapshot", () => {
  it("includes the single-Agent endpoints used by the API quickstart", () => {
    expect(taskAgentSpec.paths["/api/public/v1/agent/prompts"]?.post).toBeDefined();
    expect(taskAgentSpec.paths["/api/public/v1/agent/sessions"]?.get).toBeDefined();
    expect(taskAgentSpec.paths["/api/public/v1/agent/sessions/{session_id}/events"]?.get).toBeDefined();
  });
  it("publishes only public endpoints and retains resolvable schemas", () => {
    expect(taskAgentSpec.swagger).toBe("2.0");
    expect(taskAgentOperations.length).toBeGreaterThan(0);
    for (const operation of taskAgentOperations) {
      expect(operation.path.startsWith("/api/public/v1/")).toBe(true);
      expect(taskAgentApiGroups.map(([id]) => id)).toContain(operationGroup(operation.path));
      expect(() => expandSchema(operation)).not.toThrow();
      for (const requirement of operation.security ?? []) {
        for (const name of Object.keys(requirement)) {
          expect(taskAgentSpec.securityDefinitions[name]).toMatchObject({ in: "header", name: "Authorization", type: "apiKey" });
        }
      }
    }
    expect(Object.keys(taskAgentSpec.securityDefinitions).sort()).toEqual(["PublicBearer", "PublicTaskAgentAPIKey"]);
  });
  it("publishes the WeChat discovery request and safe response schema", () => {
    const discovery = taskAgentOperations.find((entry) => entry.path.endsWith("/wechat-kf/accounts") && entry.method === "post")!;
    expect(discovery.description).toContain("channels:write");
    expect(JSON.stringify(expandSchema(discovery.parameters))).toContain('"required":["corp_secret"]');
    const response = JSON.stringify(expandSchema(discovery.responses["200"]));
    expect(response).toContain('"manage_privilege"');
    expect(response).not.toContain('"corp_secret"');
  });
  it("documents automatic setup and current Agent management without retired routes", () => {
    for (const path of [
      "/channels/automatic",
      "/channels/automatic/{setup_id}",
      "/channels/automatic/{setup_id}/authorize",
      "/channels/automatic/{setup_id}/complete",
      "/webhooks/{hook_id}/runs",
      "/webhooks/{hook_id}/runs/{task_id}",
      "/webhooks/{hook_id}/email/address",
      "/webhooks/{hook_id}/email/address-suggestion",
    ]) {
      expect(taskAgentSpec.paths[`/api/public/v1${path}`]).toBeDefined();
    }
    const authorize = taskAgentOperations.find(
      (entry) => entry.path.endsWith("/automatic/{setup_id}/authorize"),
    )!;
    expect(JSON.stringify(expandSchema(authorize.parameters))).toContain(
      '"configuration_token"',
    );
    expect(JSON.stringify(expandSchema(authorize.responses["200"]))).not.toContain(
      '"configuration_token"',
    );
    for (const path of [
      "/chat_memory_projects",
      "/chat_memory_projects/writes",
      "/business-resources/communication-knowledge",
    ]) {
      expect(taskAgentSpec.paths[`/api/public/v1${path}`]).toBeUndefined();
    }
  });
  it("renders actual prompt fields and all Event v2 variants from JSON", () => {
    const prompt = taskAgentOperations.find((entry) => entry.path.endsWith("/prompts") && entry.method === "post")!;
    expect(JSON.stringify(expandSchema(prompt.parameters))).toContain('"request_id"');
    const event = taskAgentSpec.definitions["api.TaskAgentEventDoc"];
    const variants = event["x-hast-event-variants"] as Record<string, unknown>;
    expect(variants["message.completed"]).toBeDefined();
    for (const schema of Object.values(variants)) expect(() => expandSchema(schema)).not.toThrow();
    expect(JSON.stringify(expandSchema(event))).toContain('"replayable"');
  });
});
