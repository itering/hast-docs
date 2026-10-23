const AIP_URL = (
  process.env.NEXT_PUBLIC_AIP_URL ?? "https://aip.hast.so"
).replace(/\/$/, "");

export function getAipHref() {
  return AIP_URL;
}
