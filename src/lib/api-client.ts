export async function readApiJson<T>(res: Response): Promise<{ data: T | null; raw: string }> {
  const raw = await res.text();
  if (!raw) return { data: null, raw: "" };
  try {
    return { data: JSON.parse(raw) as T, raw };
  } catch {
    return { data: null, raw };
  }
}

export function apiErrorMessage(
  res: Response,
  data: { error?: string } | null,
  raw: string,
  fallback: string,
): string {
  if (data?.error) return data.error;
  if (raw && !raw.startsWith("{")) {
    return `Strežnik je vrnil nepričakovan odgovor (${res.status}). Preverite Clerk in bazo.`;
  }
  return fallback;
}
