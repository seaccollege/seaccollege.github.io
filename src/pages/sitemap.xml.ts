import type { APIRoute } from 'astro';

function getBase(site: string | URL | undefined, request: Request | undefined) {
  let base: string | undefined;
  if (site) {
    if (typeof site === 'string') base = site;
    else if (site instanceof URL) base = site.href;
    else base = String(site);
  }

  if (!base || !/^https?:\/\//i.test(base)) {
    const host = request?.headers.get('host');
    const protocol = request?.headers.get('x-forwarded-proto') || 'https';
    base = host ? `${protocol}://${host}` : 'https://seaccollege.github.io';
  }
  return base.replace(/\/$/, '');
}

function urlFor(base: string, path: string) {
  // ensure single leading slash
  if (!path.startsWith('/')) path = `/${path}`;
  return `${base}${path}`;
}

export const GET: APIRoute = async ({ site, request }) => {
  const base = getBase(site, request);

  // Collect .astro pages from the src/pages folder at build time.
  // Vite's import.meta.glob provides the matching file list keys.
  // We intentionally only glob .astro pages to avoid API/TS files.
  const modules = import.meta.glob('/src/pages/**/*.astro');
  const files = Object.keys(modules)
    .filter((p) => !/404\.astro$|500\.astro$|error\//i.test(p))
    .map((p) => {
      // strip the leading /src/pages and extension
      let route = p.replace(/^\/src\/pages/, '').replace(/\.astro$/, '');
      // remove /index endings
      route = route.replace(/\/index$/i, '') || '/';
      // normalize to single leading slash
      if (!route.startsWith('/')) route = `/${route}`;
      return route === '/index' ? '/' : route;
    })
    // dedupe and sort
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();

  const urls = files.map((p) => urlFor(base, p));

  // Basic sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (u) => `  <url>\n    <loc>${u}</loc>\n  </url>`
    )
    .join('\n')}\n</urlset>`;

  return new Response(sitemap, { headers: { 'Content-Type': 'application/xml' } });
};
