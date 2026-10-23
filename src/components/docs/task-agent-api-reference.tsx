import { DocsLink } from "./docs-link";
import type { AppLocale } from "@/i18n/config";
import { getApiReferenceLabels } from "./api-reference-labels";
import { CodeBlock } from "@hast/docs/components";
import { taskAgentSpec, taskAgentOperations, taskAgentApiGroups, operationGroup, expandSchema } from "@/content/docs/task-agent-openapi";
import { getAipHref } from "@/lib/aip-url";
import styles from "./task-agent-api-reference.module.css";

function JsonSchema({ value, seen = [] }: { value: unknown; seen?: string[] }) {
  return <CodeBlock className={styles.schema} language="json" title="JSON" code={JSON.stringify(expandSchema(value, seen), null, 2)} />;
}

export function ApiKeyLink({ locale = "zh-CN" }: { locale?: AppLocale }) {
  const t = getApiReferenceLabels(locale);
  return <DocsLink href={new URL("/api-keys", getAipHref()).toString()}>{t.manage}</DocsLink>;
}

export function TaskAgentApiReference({ locale = "zh-CN" }: { locale?: AppLocale }) {
  const t = getApiReferenceLabels(locale);
  return <div className={styles.reference}>
    <p>{taskAgentOperations.length} {t.intro}</p>
    <p><DocsLink href="/openapi/task-agent.json" download>{t.download}</DocsLink> · <DocsLink href={taskAgentSpec["x-hast-source"]}>{t.upstream}</DocsLink></p>
    <p>{t.date}: {taskAgentSpec["x-hast-retrieved-at"].slice(0, 10)} · {t.format}: Swagger / OpenAPI {taskAgentSpec.swagger} · {t.base}: <code>https://{taskAgentSpec.host}/api/public/v1</code>.</p>
    <p>{t.scope}</p>
    <h2 id="authentication">{t.auth}</h2>
    <p>{t.authBefore} <code>Authorization: Bearer hast_pk_...</code> {t.authAfter}</p>
    <JsonSchema value={taskAgentSpec.securityDefinitions.PublicBearer} />
    {taskAgentApiGroups.map(([group]) => <section key={group}>
      <h2 id={group}>{t.groups[group]}</h2>
      {taskAgentOperations.filter((operation) => operationGroup(operation.path) === group).map((operation) => <details className={styles.operation} key={`${operation.method}:${operation.path}`}>
        <summary className="cursor-pointer"><strong>{operation.method.toUpperCase()}</strong> <code>{operation.path}</code><span>{operation.summary}</span></summary>
        <div className={styles.body}>
          {operation.description && <p>{operation.description}</p>}
          <p>{t.request}: {operation.consumes?.join(", ") || t.unspecified}; {t.response}: {operation.produces?.join(", ") || t.responseDefault}.</p>
          <p><strong>{t.parameters}</strong></p>
          {operation.parameters?.length ? operation.parameters.map((parameter, index) => <div key={index}>
            <p><code>{String(parameter.name)}</code> · {String(parameter.in)} · {parameter.required ? t.required : t.optional}</p>
            <JsonSchema value={parameter} />
          </div>) : <p>{t.noParameters}</p>}
          <p><strong>{t.responses}</strong></p>
          {Object.entries(operation.responses).map(([status, response]) => <div key={status}>
            <p><code>{status}</code> {String(response.description ?? "")}</p>
            {response.schema !== undefined && <JsonSchema value={response.schema} />}
            {response.headers !== undefined && <JsonSchema value={response.headers} />}
          </div>)}
        </div>
      </details>)}
    </section>)}
  </div>;
}

export function TaskAgentEventSchemas({ locale = "zh-CN" }: { locale?: AppLocale }) {
  const t = getApiReferenceLabels(locale);
  const envelope = taskAgentSpec.definitions["api.TaskAgentEventDoc"];
  const variants = envelope["x-hast-event-variants"] as Record<string, unknown>;
  return <div className={styles.reference}>
    <details className={styles.operation}><summary className="cursor-pointer">{t.envelope}</summary><JsonSchema value={envelope} /></details>
    {Object.entries(variants).sort(([a], [b]) => a.localeCompare(b)).map(([name, schema]) =>
      <details className={styles.operation} key={name}><summary className="cursor-pointer"><code>{name}</code></summary><JsonSchema value={schema} seen={["api.TaskAgentEventDoc"]} /></details>)}
  </div>;
}
