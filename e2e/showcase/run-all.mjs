// Runs the whole pipeline: every still and the hero recording, then the conversion.
//
// capture.mjs may fail on a still after the hero was recorded. The conversion is
// independent of the stills, so it runs whenever out/hero.json was written during
// this run, and the exit code is non-zero when either step failed.
//
// Usage, from e2e/showcase/: node run-all.mjs

import { spawnSync } from 'node:child_process';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const cutFile = path.join(here, 'out', 'hero.json');

const node = script => spawnSync(process.execPath, [path.join(here, script), ...(script === 'capture.mjs' ? ['all'] : [])], { cwd: here, stdio: 'inherit' }).status ?? 1;

/** True when the cut points were written after the given moment, so they belong to this run. */
const isFresh = async since => {
  try {
    return (await stat(cutFile)).mtimeMs >= since;
  } catch {
    return false;
  }
};

const startedAt = Date.now();
let status = node('capture.mjs');

if (await isFresh(startedAt)) {
  if (node('gif.mjs') !== 0) status = 1;
} else {
  console.error('FAIL the hero was not recorded in this run, so there is nothing to convert');
  status = 1;
}

process.exit(status);
