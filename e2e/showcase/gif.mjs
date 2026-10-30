// Converts the video that `node capture.mjs hero-video` records into the README's
// animation: a GIF built with a two pass palette, and an MP4.
//
// The GIF is 20 frames a second at 1100 pixels wide, trimmed to the part of the
// recording that shows the page loading and the scroll (capture.mjs writes the
// cut points beside the video). It must stay under 8 MB, which is what the README
// can carry without slowing the page. When the first encode is over, the script
// retries with coarser dithering and fewer colours before it gives up. Both files
// are encoded under out/, copied to temporary names in the output folder and
// renamed into place only when both copies succeeded.
//
// ffmpeg is found through FFMPEG, then the PATH.
//
// Usage, from e2e/showcase/: node gif.mjs

import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { copyFile, mkdir, readFile, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const WORK = path.join(here, 'out');
const OUT = process.env.SHOWCASE_OUT
  ? path.resolve(process.env.SHOWCASE_OUT)
  : path.resolve(here, '..', '..', 'docs', 'assets', 'screens');

const FPS = 20;
const WIDTH = 1100;
const MAX_GIF_BYTES = 8 * 1024 * 1024;

/**
 * Encodes tried in order until one fits the budget. `step` snaps every colour
 * channel to a multiple of it before the palette is built. The recording is VP9, and
 * its codec noise changes a few levels of almost every pixel in every frame, so the
 * GIF cannot reuse the pixels of the previous frame and balloons (22 MB for 11 s).
 * Snapping to steps of 16 hides that noise, and the dark terminal UI does not show it.
 */
const ATTEMPTS = [
  { step: 16, colors: 128, dither: 'bayer:bayer_scale=5' },
  { step: 16, colors: 96, dither: 'bayer:bayer_scale=5' },
  { step: 20, colors: 96, dither: 'bayer:bayer_scale=5' },
  { step: 24, colors: 64, dither: 'none' },
];

// Everything is encoded to temporary names in out/ and published only when the GIF fits.
const palette = path.join(WORK, 'hero-palette.png');
const gif = path.join(WORK, 'hero.tmp.gif');
const mp4 = path.join(WORK, 'hero.tmp.mp4');
const finalGif = path.join(OUT, 'hero.gif');
const finalMp4 = path.join(OUT, 'hero.mp4');

/** Removes the scratch files of the encode, on success and on failure. */
const cleanup = () => {
  for (const file of [palette, gif, mp4]) rmSync(file, { force: true });
};

const fail = message => {
  cleanup();
  console.error(`FAIL ${message}`);
  process.exit(1);
};

const ffmpeg = process.env.FFMPEG || 'ffmpeg';

const probe = spawnSync(ffmpeg, ['-version'], { encoding: 'utf8' });
if (probe.error || probe.status !== 0) {
  fail(
    `ffmpeg was not found (tried "${ffmpeg}"). Install it (winget install Gyan.FFmpeg, brew install ffmpeg or apt install ffmpeg) ` +
      'and open a new terminal, or point FFMPEG at the executable.'
  );
}

/** Runs ffmpeg and stops with its last lines when it fails. */
const run = (label, args) => {
  const result = spawnSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', ...args], { encoding: 'utf8' });
  if (result.status !== 0) {
    fail(`ffmpeg failed while ${label}:\n${(result.stderr || result.stdout || '').trim().split('\n').slice(-8).join('\n')}`);
  }
};

const video = path.join(WORK, 'hero.webm');
let cut;

const cutFile = path.join(WORK, 'hero.json');
try {
  const [videoStat, cutStat] = await Promise.all([stat(video), stat(cutFile)]);
  // capture.mjs writes the cut points after the video, so older cut points belong to another take.
  if (cutStat.mtimeMs < videoStat.mtimeMs) {
    fail(`${cutFile} is older than ${video}, so the cut points are stale. Record again: node capture.mjs hero-video`);
  }
  cut = JSON.parse(await readFile(cutFile, 'utf8'));
} catch {
  fail(`No usable recording at ${video} and ${cutFile}. Record it first: node capture.mjs hero-video`);
}

if (!Number.isFinite(cut?.start) || !Number.isFinite(cut?.end) || cut.end <= cut.start) {
  fail(`${cutFile} must hold finite numbers "start" and "end" with end greater than start, got ${JSON.stringify(cut)}. Record again: node capture.mjs hero-video`);
}

await mkdir(OUT, { recursive: true });

const trim = ['-ss', String(cut.start), '-to', String(cut.end), '-i', video];
const scale = `fps=${FPS},scale=${WIDTH}:-1:flags=lanczos`;
const snap = step => `lutrgb=r='trunc(val/${step})*${step}':g='trunc(val/${step})*${step}':b='trunc(val/${step})*${step}'`;

const size = async file => (await stat(file)).size;
const megabytes = bytes => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

let gifBytes = Infinity;
for (const attempt of ATTEMPTS) {
  const filters = `${scale},${snap(attempt.step)}`;
  // Pass one reads the whole clip and picks the colours that suit it. The diff
  // statistics weight the colours of what moves over the static page.
  run('building the palette', [...trim, '-vf', `${filters},palettegen=max_colors=${attempt.colors}:stats_mode=diff`, palette]);

  // Pass two draws every frame with that palette.
  run('encoding the GIF', [
    ...trim,
    '-i',
    palette,
    '-lavfi',
    `${filters} [x]; [x][1:v] paletteuse=dither=${attempt.dither}:diff_mode=rectangle`,
    '-loop',
    '0',
    gif,
  ]);

  gifBytes = await size(gif);
  console.log(`     step ${attempt.step}, ${attempt.colors} colours, dither ${attempt.dither}: ${megabytes(gifBytes)}`);
  if (gifBytes <= MAX_GIF_BYTES) break;
}

if (gifBytes > MAX_GIF_BYTES) {
  await rm(gif, { force: true });
  fail(
    `hero.gif is ${megabytes(gifBytes)}, over the ${megabytes(MAX_GIF_BYTES)} limit. The existing assets were left untouched. ` +
      'Tune WIDTH (output width) or FPS at the top of gif.mjs, the colour step and colour count in ATTEMPTS, or shorten the flow in capture.mjs.'
  );
}

run('encoding the MP4', [
  ...trim,
  '-vf',
  'fps=25,scale=1440:-2:flags=lanczos',
  '-c:v',
  'libx264',
  '-crf',
  '24',
  '-preset',
  'slow',
  '-pix_fmt',
  'yuv420p',
  '-movflags',
  '+faststart',
  '-an',
  mp4,
]);

const mp4Bytes = await size(mp4);

// Both encodes succeeded and the GIF fits: copy both to temporary names in the
// output folder, then rename them into place only when both copies exist.
const stagedGif = `${finalGif}.tmp`;
const stagedMp4 = `${finalMp4}.tmp`;
try {
  await Promise.all([copyFile(gif, stagedGif), copyFile(mp4, stagedMp4)]);
  await rename(stagedGif, finalGif);
  await rename(stagedMp4, finalMp4);
} catch (error) {
  await Promise.all([rm(stagedGif, { force: true }), rm(stagedMp4, { force: true })]);
  fail(`could not publish the animation: ${error.message}`);
}
cleanup();

console.log(`OK   hero.gif  ${megabytes(gifBytes)}`);
console.log(`OK   hero.mp4  ${megabytes(mp4Bytes)}`);
