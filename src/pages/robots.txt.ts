import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: string) => `\
User-agent: *
Allow: /

Sitemap: ${sitemapURL}
`;

export const GET: APIRoute = ({ site, request }) => {
  // Ensure we have a valid absolute HTTP(S) base to resolve the sitemap URL.
  let base: string | undefined;
  if (site) {
    if (typeof site === 'string') base = site;
    else if (site instanceof URL) base = site.href;
    else base = String(site);
  }

  // If base is missing or not an http(s) URL, derive from the request or fallback.
  if (!base || !/^https?:\/\//i.test(base)) {
    const host = request?.headers.get('host');
    const protocol = request?.headers.get('x-forwarded-proto') || 'https';
    base = host ? `${protocol}://${host}` : 'https://seaccollege.github.io';
  }

  // Use an absolute path for the sitemap to avoid path-joining issues.
  let sitemapURL: string;
  try {
    sitemapURL = new URL('/sitemap.xml', base).toString();
  } catch (err) {
    // Defensive fallback to avoid throwing when base is malformed.
    sitemapURL = 'https://seaccollege.github.io/sitemap.xml';
  }
  return new Response(getRobotsTxt(sitemapURL), { headers: { 'Content-Type': 'text/plain' } });
};