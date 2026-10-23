export const docsOrigin = (process.env.NEXT_PUBLIC_DOCS_URL ?? 'http://localhost:3219').replace(/\/$/, '');
export const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stg.hast.so').replace(/\/$/, '');
