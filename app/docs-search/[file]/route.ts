import { LOCALES } from "@/i18n/config";
import { getDocsSearchAsset } from "@/content/docs/search-asset";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return Promise.all(LOCALES.map(async (locale) => ({
    file: (await getDocsSearchAsset(locale)).file,
  })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const locale = LOCALES.find((value) => file.startsWith(`${value}.`));
  if (!locale) return new Response(null, { status: 404 });
  const asset = await getDocsSearchAsset(locale);
  if (file !== asset.file) return new Response(null, { status: 404 });
  return new Response(asset.body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
