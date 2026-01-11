How to add Font Awesome assets for offline use

Option A (recommended, using pnpm/npm):
1. Install the package:

```bash
pnpm add @fortawesome/fontawesome-free --save
# or
npm install @fortawesome/fontawesome-free --save
```

2. Copy the needed files to the public folder (from project root):

PowerShell (Windows):
```powershell
mkdir -Force public\vendor\fontawesome\css
mkdir -Force public\vendor\fontawesome\webfonts
Copy-Item -Path node_modules\@fortawesome\fontawesome-free\css\all.min.css -Destination public\vendor\fontawesome\css\ -Force
Copy-Item -Path node_modules\@fortawesome\fontawesome-free\webfonts\* -Destination public\vendor\fontawesome\webfonts\ -Force
```

Unix/macOS:
```bash
mkdir -p public/vendor/fontawesome/css public/vendor/fontawesome/webfonts
cp node_modules/@fortawesome/fontawesome-free/css/all.min.css public/vendor/fontawesome/css/
cp node_modules/@fortawesome/fontawesome-free/webfonts/* public/vendor/fontawesome/webfonts/
```

Option B (manual):
- Download the Font Awesome Free ZIP from https://fontawesome.com (Free Download) and extract the `css/all.min.css` and the `webfonts` folder into `public/vendor/fontawesome/`.

After copying the files:
- Build and deploy your site so the files are served from `/vendor/fontawesome/...`.
- In the browser, open DevTools → Application → Service Workers and unregister/refresh the SW if necessary, then reload the site online once to let the service worker precache the assets.

Test offline:
- With DevTools open, go to Application → Service Workers → check "Offline" (or Network → Offline), then reload the page. Icons should render when offline.
