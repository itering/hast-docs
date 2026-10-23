import { createHash } from "node:crypto";
import type { AppLocale } from "../../i18n/config";
import { getDocsContent } from "./content";

export async function getDocsSearchAsset(locale: AppLocale) {
  const { docsSearchIndex } = await getDocsContent(locale);
  const body = JSON.stringify(docsSearchIndex);
  const hash = createHash("sha256").update(body).digest("hex");
  return { file: `${locale}.${hash}.json`, body };
}
