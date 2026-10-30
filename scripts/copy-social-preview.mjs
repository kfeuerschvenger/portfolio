// Copies the committed social preview into public/ so Vite serves and emits it at /social-preview.png.
// The copy is git-ignored: docs/assets/brand/social-preview.png is the single source.
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../docs/assets/brand/social-preview.png', import.meta.url));
const target = fileURLToPath(new URL('../public/social-preview.png', import.meta.url));

copyFileSync(source, target);
