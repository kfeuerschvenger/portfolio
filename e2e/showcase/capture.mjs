// Captures the screenshots and the hero recording used in the README.
//
// The portfolio is static, so there is no demo data: the script builds the
// app, serves the build with `vite preview` on a free odd port (or reuses the
// page named by SHOWCASE_URL), takes each shot in a real browser and writes two
// files per still: the raw screenshot, and the same screenshot inside a
// browser frame. The hero slug records a video instead, which gif.mjs turns
// into a GIF and an MP4.
//
// Usage, from e2e/showcase/:
//   node capture.mjs                     every still
//   SLUGS=hero,about node capture.mjs    a subset (a slug may also be an argument)
//   node capture.mjs hero                the video, for gif.mjs

import { spawn, spawnSync } from 'node:child_process';
import { copyFile, mkdir, rm, stat, writeFile } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(here, '..', '..');

const OUT = process.env.SHOWCASE_OUT ? path.resolve(process.env.SHOWCASE_OUT) : path.join(REPO, 'docs', 'assets', 'screens');
/** The hero video and its cut points, which are not committed. */
const WORK = path.join(here, 'out');

const VIEWPORT = { width: 1600, height: 1000 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };
/** Stills are taken at twice the pixel density, for crisp text. */
const RAW_SCALE = 2;
const MOBILE_SCALE = 3;
/** The framed composite is rendered at this density. */
const FRAME_SCALE = Number(process.env.SHOWCASE_FRAME_SCALE ?? 1.25);

const NAME = 'Kevin Feuerschvenger';
const SUBTITLE = 'Software Engineer';

const log = (...parts) => console.log(...parts);

// ---------------------------------------------------------------------------
// The app under capture
// ---------------------------------------------------------------------------

/** Resolves true when nothing is listening on the port. */
const portIsFree = port =>
  new Promise(resolve => {
    const probe = net.createServer();
    probe.once('error', () => resolve(false));
    probe.once('listening', () => probe.close(() => resolve(true)));
    probe.listen(port, '127.0.0.1');
  });

/** A random odd port that is free, so a dev server on the usual ports is never hit. */
const pickPort = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const port = 41000 + 2 * Math.floor(Math.random() * 4000) + 1;
    if (await portIsFree(port)) return port;
  }
  throw new Error('could not find a free odd port');
};

const build = () => {
  log('Building the app (npm run build)...');
  const result = spawnSync('npm', ['run', 'build'], { cwd: REPO, stdio: ['ignore', 'ignore', 'inherit'], shell: process.platform === 'win32' });
  if (result.status !== 0) throw new Error('npm run build failed');
};

/** Polls the URL until it answers, or gives up. */
const waitForServer = async (url, server) => {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`vite preview exited with code ${server.exitCode}`);
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // Not listening yet.
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`nothing answered at ${url}`);
};

/**
 * Starts `vite preview` for the build and returns its address and a stop function.
 * Vite is run through node and not through npm, so the process killed at the end
 * is the server itself and not a shell that would leave it running.
 */
const startServer = async () => {
  if (process.env.SHOWCASE_URL) {
    return { base: process.env.SHOWCASE_URL.replace(/\/$/, ''), stop: async () => {} };
  }

  build();
  const port = await pickPort();
  const vite = path.join(REPO, 'node_modules', 'vite', 'bin', 'vite.js');
  const server = spawn(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: REPO,
    stdio: 'ignore',
  });

  const base = `http://127.0.0.1:${port}`;
  const stop = async () => {
    if (server.exitCode === null) {
      server.kill();
      await new Promise(resolve => server.once('exit', resolve));
    }
  };

  try {
    await waitForServer(base, server);
  } catch (error) {
    await stop();
    throw error;
  }
  log(`Serving the build at ${base}`);
  return { base, stop };
};

// ---------------------------------------------------------------------------
// Page helpers
// ---------------------------------------------------------------------------

/** Resolves when every finite animation and transition has ended, so a shot is not taken mid entrance. */
const waitForCalm = page =>
  page.waitForFunction(
    () => document.getAnimations().every(animation => animation.effect?.getComputedTiming().iterations === Infinity || animation.playState !== 'running'),
    undefined,
    { timeout: 15_000 }
  );

/** Resolves once the scroll position has not moved for a handful of frames. */
const waitForScrollEnd = page =>
  page.evaluate(
    () =>
      new Promise(resolve => {
        let last = -1;
        let still = 0;
        const tick = () => {
          still = window.scrollY === last ? still + 1 : 0;
          last = window.scrollY;
          if (still >= 8) resolve();
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      })
  );

/** Jumps to a section without animation, as the parallax offsets follow the scroll position. */
const jumpTo = async (page, id, offset = 0) => {
  await page.evaluate(
    ([target, shift]) => {
      const top = document.getElementById(target).getBoundingClientRect().top + window.scrollY + shift;
      window.scrollTo({ top, behavior: 'instant' });
    },
    [id, offset]
  );
  await waitForScrollEnd(page);
};

/** Throws when the text is not on the page, so a broken render fails the shot instead of being committed. */
const assertText = async (page, ...texts) => {
  for (const text of texts) {
    const found = await page.getByText(text, { exact: false }).first().isVisible();
    if (!found) throw new Error(`expected text "${text}" is not visible`);
  }
};

/** Waits for the web fonts and fails when the terminal font did not load. */
const assertFonts = async page => {
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => document.fonts.check('16px "JetBrains Mono"'));
  if (!loaded) throw new Error('JetBrains Mono did not load (is the machine offline?)');
};

/** Waits for the hero typing to finish: the name, the subtitle and the links, all complete. */
const waitForHero = async page => {
  await page.waitForFunction(
    ([name, subtitle]) => {
      const heading = document.querySelector('#home h1')?.textContent ?? '';
      const text = document.querySelector('#home')?.textContent ?? '';
      return heading.includes(name) && text.includes(subtitle) && text.includes('github') && text.includes('linkedin');
    },
    [NAME, SUBTITLE],
    { timeout: 20_000 }
  );
};

/** Waits for the page to be still, takes the pointer out of the way and checks the render. */
const settle = async page => {
  await assertFonts(page);
  await page.mouse.move(VIEWPORT.width - 4, VIEWPORT.height - 4);
  await waitForScrollEnd(page);
  await waitForCalm(page);
  await page.waitForTimeout(400);
};

const openHome = async (page, base) => {
  await page.goto(`${base}/`);
  await waitForHero(page);
};

// ---------------------------------------------------------------------------
// The inventory
// ---------------------------------------------------------------------------

/**
 * A still is a slug, a function that brings the page to the state to photograph, and
 * optionally a viewport, a device kind for the frame and the address the frame shows.
 */
const SHOTS = [
  {
    slug: 'hero',
    run: async (page, base) => {
      await openHome(page, base);
      await settle(page);
      await assertText(page, NAME, 'Software Engineer', 'Puerto Madryn');
    },
  },
  {
    slug: 'about',
    run: async (page, base) => {
      await openHome(page, base);
      await jumpTo(page, 'about', -40);
      await settle(page);
      await assertText(page, 'about.txt');
    },
  },
  {
    slug: 'projects',
    run: async (page, base) => {
      await openHome(page, base);
      await jumpTo(page, 'projects', -40);
      await settle(page);
      await assertText(page, 'BreezyBoard', 'walkthrough-studio');
    },
  },
  {
    slug: 'skills',
    // Eight groups: tall enough to show every one of them in a single shot.
    viewport: { width: VIEWPORT.width, height: 1900 },
    run: async (page, base) => {
      await openHome(page, base);
      await jumpTo(page, 'skills', 40);
      await settle(page);
      await assertText(page, 'frontend', 'ai/');
      // The last group must be fully inside the shot.
      for (const skill of ['Twilio', 'LLM APIs']) {
        const box = await page.locator('#skills').getByText(skill, { exact: true }).boundingBox();
        if (!box || box.y + box.height > 1900 - 60) throw new Error(`the skills group holding ${skill} is cut by the viewport`);
      }
    },
  },
  {
    slug: 'contact',
    run: async (page, base) => {
      await openHome(page, base);
      // Far enough down that the tail of the skills section is not seen through the nav bar.
      await jumpTo(page, 'contact', 30);
      await settle(page);
      await assertText(page, 'contact.sh');
    },
  },
  {
    slug: 'not-found',
    run: async (page, base) => {
      // A route the router does not know, different on every run.
      const route = `/lost-${Math.random().toString(36).slice(2, 8)}`;
      await page.goto(`${base}${route}`);
      await page.getByText('No such file or directory').waitFor();
      await settle(page);
      await assertText(page, route, '404');
      return { url: `feuerschvenger.com${route}` };
    },
  },
  {
    slug: 'mobile',
    mobile: true,
    run: async (page, base) => {
      await openHome(page, base);
      await settle(page);
      // The menu is the fix this shot shows: it opens, lists every section and stays on screen.
      await page.getByRole('button', { name: /menu/i }).click();
      await page.locator('#mobile-menu').waitFor({ state: 'visible' });
      await settle(page);
      const links = await page.locator('#mobile-menu a').allInnerTexts();
      if (links.length !== 5) throw new Error(`the mobile menu lists ${links.length} links, expected 5`);
    },
  },
  {
    slug: 'mobile-hero',
    mobile: true,
    run: async (page, base) => {
      await openHome(page, base);
      await settle(page);
      await assertText(page, NAME);
    },
  },
];

/** Every slug that can be asked for: the stills and the hero recording. */
const HERO_VIDEO = 'hero-video';
const SLUGS = [...SHOTS.map(shot => shot.slug), HERO_VIDEO];

/**
 * The slug of the recording is `hero-video`, because `hero` is the still. The README
 * and the output files call the animation hero (hero.gif, hero.mp4).
 */
const selectSlugs = () => {
  const requested = [process.env.SLUGS ?? '', ...process.argv.slice(2)]
    .flatMap(list => list.split(','))
    .map(slug => slug.trim())
    .filter(Boolean);

  const unknown = requested.filter(slug => !SLUGS.includes(slug));
  if (unknown.length > 0) {
    throw new Error(`Unknown slug ${unknown.join(', ')}. Known slugs: ${SLUGS.join(', ')}`);
  }

  return requested.length > 0 ? requested : SHOTS.map(shot => shot.slug);
};

/** Puts a raw screenshot in the frame and returns the framed PNG. */
const frameShot = async (framePage, raw, { width, url, device }) => {
  await framePage.evaluate(shot => window.placeShot(shot), {
    src: `data:image/png;base64,${raw.toString('base64')}`,
    width,
    url,
    device,
  });
  return framePage.locator('#stage').screenshot({ type: 'png' });
};

const kilobytes = async file => `${Math.round((await stat(file)).size / 1024)} KB`;

const takeStill = async (shot, { browser, base, framePage }) => {
  const viewport = shot.mobile ? MOBILE_VIEWPORT : (shot.viewport ?? VIEWPORT);
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: shot.mobile ? MOBILE_SCALE : RAW_SCALE,
    isMobile: Boolean(shot.mobile),
    hasTouch: Boolean(shot.mobile),
    colorScheme: 'dark',
    locale: 'en-US',
    timezoneId: 'UTC',
  });

  try {
    const page = await context.newPage();
    const extra = (await shot.run(page, base)) ?? {};
    const raw = await page.screenshot({ type: 'png' });
    const framed = await frameShot(framePage, raw, {
      width: viewport.width,
      url: extra.url,
      device: shot.mobile ? 'phone' : 'browser',
    });

    await writeFile(path.join(OUT, `${shot.slug}.png`), raw);
    await writeFile(path.join(OUT, `${shot.slug}-framed.png`), framed);
  } finally {
    await context.close();
  }
};

// ---------------------------------------------------------------------------
// The hero recording
// ---------------------------------------------------------------------------

/** Scrolls to a document position with an eased path, one step per animation frame. */
const glide = (page, to, duration) =>
  page.evaluate(
    ([target, ms]) =>
      new Promise(resolve => {
        const from = window.scrollY;
        const started = performance.now();
        const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
        const step = now => {
          const t = Math.min(1, (now - started) / ms);
          window.scrollTo({ top: from + (target - from) * ease(t), behavior: 'instant' });
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      }),
    [to, duration]
  );

const sectionTop = (page, id, shift = 0) =>
  page.evaluate(([target, offset]) => document.getElementById(target).getBoundingClientRect().top + window.scrollY + offset, [id, shift]);

/**
 * The hero runs in the full Chromium build in its new headless mode, not in the
 * headless shell that Playwright launches by default. The shell rasterizes in
 * software and renders scrolling at about 13 frames a second, which the video
 * shows as stutter. The full build renders at the display rate. Stills do not
 * move, so they stay on the shell.
 */
const recordHero = async base => {
  const dir = path.join(WORK, 'video');
  await rm(dir, { recursive: true, force: true });

  const browser = await chromium.launch({ channel: 'chromium' });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    locale: 'en-US',
    timezoneId: 'UTC',
    recordVideo: { dir, size: VIEWPORT },
  });

  try {
    const page = await context.newPage();
    const recordingStarted = Date.now();

    // Load once so the fonts are cached, then reload for the recorded take: the typing
    // animation runs again, and the text is set in the terminal font from the first frame.
    await page.goto(`${base}/`);
    await waitForHero(page);
    await assertFonts(page);
    await page.waitForTimeout(300);
    await page.goto('about:blank');

    // The footage before this moment is the warm up, and gif.mjs cuts it.
    const startAt = (Date.now() - recordingStarted) / 1000 + 0.3;
    await page.goto(`${base}/`);
    await waitForHero(page);
    await assertText(page, NAME, SUBTITLE);
    await page.mouse.move(VIEWPORT.width - 4, VIEWPORT.height - 4);
    await page.waitForTimeout(500);

    // The flow is kept short on purpose: every frame of a scroll changes the whole
    // picture, and that is what decides whether the GIF fits its size budget.
    for (const [id, shift, pause] of [
      ['about', -40, 1000],
      ['projects', -40, 1100],
      ['skills', -40, 1500],
    ]) {
      await glide(page, await sectionTop(page, id, shift), 1100);
      await waitForCalm(page);
      await page.waitForTimeout(pause);
    }
    await assertText(page, 'ai/');

    const endAt = (Date.now() - recordingStarted) / 1000;
    await context.close();
    const video = await page.video().path();
    await copyFile(video, path.join(WORK, 'hero.webm'));
    await writeFile(path.join(WORK, 'hero.json'), JSON.stringify({ start: Number(startAt.toFixed(2)), end: Number(endAt.toFixed(2)) }));
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const main = async () => {
  const slugs = selectSlugs();
  const stills = SHOTS.filter(shot => slugs.includes(shot.slug));

  await mkdir(WORK, { recursive: true });
  await mkdir(OUT, { recursive: true });

  const failures = [];
  const report = (slug, ok, detail) => {
    log(`${ok ? 'OK  ' : 'FAIL'} ${slug}${detail ? `  ${detail}` : ''}`);
    if (!ok) failures.push(slug);
  };

  const server = await startServer();
  let browser;

  try {
    browser = await chromium.launch();
    const frameContext = await browser.newContext({ viewport: { width: 2000, height: 1500 }, deviceScaleFactor: FRAME_SCALE });
    const framePage = await frameContext.newPage();
    await framePage.goto(pathToFileURL(path.join(here, 'frame.html')).href);

    for (const shot of stills) {
      try {
        await takeStill(shot, { browser, base: server.base, framePage });
        report(shot.slug, true, `${await kilobytes(path.join(OUT, `${shot.slug}.png`))} raw, ${await kilobytes(path.join(OUT, `${shot.slug}-framed.png`))} framed`);
      } catch (error) {
        report(shot.slug, false, error.message.split('\n')[0]);
      }
    }

    if (slugs.includes(HERO_VIDEO)) {
      try {
        await recordHero(server.base);
        report(HERO_VIDEO, true, 'recorded, run gif.mjs to convert it');
      } catch (error) {
        report(HERO_VIDEO, false, error.message.split('\n')[0]);
      }
    }
  } finally {
    await browser?.close().catch(() => {});
    await server.stop();
  }

  if (failures.length > 0) {
    log(`\n${failures.length} failed: ${failures.join(', ')}`);
    process.exit(1);
  }
  log('\nAll shots captured.');
};

main().catch(error => {
  console.error(`FAIL ${error.message}`);
  process.exit(1);
});
