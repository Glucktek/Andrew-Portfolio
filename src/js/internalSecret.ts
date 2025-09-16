const CURRENT = process.env.INTERNAL_API_TOKEN ?? "";
const DEV_BYPASS = (process.env.INTERNAL_API_DEV_BYPASS ?? "0").toString() === "1";
const IS_PROD = process.env.NODE_ENV === "production";

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) {
    r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return r === 0;
}

export function assertInternal(request: Request): Response | null {
  // Allow bypass only in non-production AND when explicitly enabled
  if (!IS_PROD && DEV_BYPASS) return null;

  if (!CURRENT) {
    return new Response("Server misconfiguration", { status: 500 });
  }
  const presented = request.headers.get("x-internal-secret") || "";
  if (!presented || !constantTimeEqual(presented, CURRENT)) {
    return new Response("Forbidden", { status: 403 });
  }
  return null;
}
