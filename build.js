import { build } from 'esbuild';
import { copyFile, mkdir, rm } from 'node:fs/promises';

const { API_KEY, SECRET_KEY } = process.env;

if (!API_KEY || !SECRET_KEY) {
  console.error('ERROR: Please export your Last.fm API credentials:');
  console.log('  export API_KEY=xxx');
  console.log('  export SECRET_KEY=xxx\n');
  process.exit(1);
}

await rm('./dist', { recursive: true, force: true });
await rm('./bandcamp-scrobbler.xpi', { force: true });
await rm('./bandcamp-scrobbler.zip', { force: true });

await build({
  entryPoints: [
    'src/background.js',
    'src/popup.jsx',
  ],
  bundle: true,
  outdir: 'dist',
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.SECRET_KEY': JSON.stringify(process.env.SECRET_KEY || ''),
  },
  jsxFactory: 'h',
});

const { MODE, BROWSER } = process.env;

const manifest = MODE === 'dev' ? `manifest.${BROWSER}.dev.json`: `manifest.${BROWSER}.json`;
const resources = MODE === 'dev' ? 'resources.dev' : 'resources';

const files = [
  ['popup.html', 'popup.html'],
  ['popup.css', 'popup.css'],
  [manifest, 'manifest.json'],
  [`${resources}/icon16.png`, 'resources/icon16.png'],
  [`${resources}/icon48.png`, 'resources/icon48.png'],
  [`${resources}/icon128.png`, 'resources/icon128.png'],
];

await mkdir('./dist/resources');

for (const [src, dest] of files) {
  await copyFile(`./static/${src}`, `./dist/${dest}`);
}
