/**
 * Resolves the post-login redirect target from the `redirect` query parameter.
 *
 * Only same-origin, absolute app paths are allowed. Anything else (external or
 * protocol-relative URLs, query-string arrays, or missing values) falls back to
 * `/` to prevent open redirects (CWE-601).
 */
export function resolveLoginRedirect(raw: unknown): string {
  if (typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//')) {
    return raw
  }
  return '/'
}
