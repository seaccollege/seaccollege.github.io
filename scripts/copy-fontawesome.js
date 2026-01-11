import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const srcCss = path.join(projectRoot, 'node_modules', '@fortawesome', 'fontawesome-free', 'css', 'all.min.css');
const srcWebfonts = path.join(projectRoot, 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts');
const destCssDir = path.join(projectRoot, 'public', 'vendor', 'fontawesome', 'css');
const destWebfontsDir = path.join(projectRoot, 'public', 'vendor', 'fontawesome', 'webfonts');

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function copy() {
  try {
    await ensureDir(destCssDir);
    await ensureDir(destWebfontsDir);

    await copyFile(srcCss, path.join(destCssDir, 'all.min.css'));

    const files = await readdir(srcWebfonts);
    await Promise.all(files.map((f) => copyFile(path.join(srcWebfonts, f), path.join(destWebfontsDir, f))));

    console.log('Font Awesome files copied to public/vendor/fontawesome');
  } catch (err) {
    console.error('Failed to copy Font Awesome assets:', err.message);
    process.exitCode = 1;
  }
}

copy();
