export function getPublicAppOrigin(fallbackOrigin?: string): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (fallbackOrigin) return fallbackOrigin.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function publicSurveyUrl(slug: string, fallbackOrigin?: string): string {
  return `${getPublicAppOrigin(fallbackOrigin)}/s/${slug}`;
}
