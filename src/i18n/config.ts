export const LOCALES = ['en', 'ja', 'zh-CN'] as const;
export type AppLocale = typeof LOCALES[number];
export const DEFAULT_LOCALE: AppLocale = 'en';
export function isAppLocale(value: string): value is AppLocale { return (LOCALES as readonly string[]).includes(value); }
