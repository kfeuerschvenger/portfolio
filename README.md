<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/brand/banner-dark.svg">
    <img src="docs/assets/brand/banner-light.svg" alt="kfeuerschvenger: Software Engineer, compiled near the whales" width="100%">
  </picture>
</p>

<p align="center">
  <a href="https://github.com/kfeuerschvenger/portfolio/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/kfeuerschvenger/portfolio/ci.yml?branch=main&style=flat-square&label=CI&logo=githubactions&logoColor=white" alt="CI status"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-357d35?style=flat-square" alt="MIT license"></a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5.9">
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 7">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4.1">
</p>

<p align="center"><strong>English</strong> · <a href="README_es.md">Español</a></p>

<p align="center">
  <img src="docs/assets/screens/hero.gif" alt="The page boots: the name and the title type themselves into the terminal, then the page scrolls through About, Projects and Skills" width="100%">
</p>

**A portfolio that boots like a terminal and exits with code 0.**

Hi, I am Kevin, a Software Engineer from Puerto Madryn, and this is my corner of the internet: a single page dressed as a shell session, complete with phosphor green, a block cursor and scanlines you can almost hear humming.

Every section is a command. `cat about.txt` opens a vim window, `ls -la ~/projects` lists my repositories and `tree ~/skills` unfolds the stack. No backend, no cookies, no `sudo` required.

Compiled near the whales, so it is a little calmer than your average build.

## $ ./tour

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="docs/assets/screens/hero-framed.png" alt="The hero with the name Kevin Feuerschvenger typed into a terminal, the title Software Engineer and the location">
      <p><strong>$ whoami</strong> A name that types itself, a title that follows, and a photo that turns to colour when you point at it.</p>
    </td>
    <td width="50%" valign="top">
      <img src="docs/assets/screens/about-framed.png" alt="The about section as a vim buffer with numbered lines">
      <p><strong>$ cat about.txt</strong> Seven years of experience in a vim window. Try <code>:q</code>, nothing happens, which is on brand.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="docs/assets/screens/projects-framed.png" alt="The projects section as an ls -la table of repositories">
      <p><strong>$ ls -la ~/projects</strong> Every repository in one table, each row a link and each language a coloured dot.</p>
    </td>
    <td width="50%" valign="top">
      <img src="docs/assets/screens/skills-framed.png" alt="The skills section as a tree of eight folders">
      <p><strong>$ tree ~/skills</strong> Eight folders, from frontend to ai, so you can see the stack before you read a word.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="docs/assets/screens/contact-framed.png" alt="The contact section as a shell script window with GitHub, LinkedIn and email links">
      <p><strong>$ ./contact --help</strong> The only help page that ends with a way to reach me.</p>
    </td>
    <td width="50%" valign="top">
      <img src="docs/assets/screens/not-found-framed.png" alt="The 404 page styled as a terminal error">
      <p><strong>exit 404</strong> Even the wrong turn looks like a shell, and links back home without a fuss.</p>
    </td>
  </tr>
</table>

### $ man portfolio

- **One command per section.** The whole page is one long terminal session, scrolled by a fixed nav bar that lights up the section you are in.
- **Phone friendly.** Below the tablet breakpoint a `$ menu` button opens the links, closes on Escape and returns focus where it started.
- **Calm on request.** With reduced motion the name appears whole, the cursor stays home and nothing slides.
- **Checked, not hoped.** Forty-three tests, an accessibility scan on every component and a CI that refuses to be late.
- **Screenshots on demand.** The images above come from a script, so they are retaken after every change instead of drifting.

A visit, from the first keystroke to the contact window:

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "JetBrains Mono, Consolas, monospace", "primaryColor": "#090a0c", "primaryBorderColor": "#00ff00", "primaryTextColor": "#00ff00", "lineColor": "#357d35", "textColor": "#357d35", "edgeLabelBackground": "#090a0c"}}}%%
flowchart LR
  Boot["boot"] --> Who["whoami"] --> Title["title types in"] --> Links["links appear"]
  Links -->|scroll| About["cat about.txt"] --> Projects["ls ~/projects"] --> Skills["tree ~/skills"] --> Contact["./contact"]
  Contact -.->|unknown route| NotFound["exit 404"]
  classDef amber fill:#090a0c,stroke:#ffbf00,color:#ffbf00
  classDef cyan fill:#090a0c,stroke:#00ffff,color:#00ffff
  classDef red fill:#090a0c,stroke:#ff0000,color:#ff0000
  class Boot,Who,Title amber
  class About,Projects,Skills,Contact cyan
  class NotFound red
```

## $ cat architecture.txt

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/diagrams/architecture-dark.svg">
  <img src="docs/assets/diagrams/architecture.svg" alt="The sources are built into a Docker image, an nginx container behind nginx-proxy-manager serves the React single page app, and CI and the screenshot pipeline run around the build" width="100%">
</picture>

A React single page app, styled with Tailwind CSS 4 tokens and bundled by Vite, ships as static files inside an `nginx:alpine` image. nginx adds the security headers, per-client rate limits and the fallback that lets deep links reach the router, and sits behind nginx-proxy-manager. GitHub Actions lints, tests, builds and audits every change, and a Playwright pipeline takes the screenshots.

<p align="center">
  <img src="https://skillicons.dev/icons?i=react" alt="React" title="React" width="48">&nbsp;
  <img src="https://skillicons.dev/icons?i=ts" alt="TypeScript" title="TypeScript" width="48">&nbsp;
  <img src="https://skillicons.dev/icons?i=vite" alt="Vite" title="Vite" width="48">&nbsp;
  <img src="https://skillicons.dev/icons?i=tailwind" alt="Tailwind CSS" title="Tailwind CSS" width="48">&nbsp;
  <img src="https://skillicons.dev/icons?i=docker" alt="Docker" title="Docker" width="48">&nbsp;
  <img src="https://skillicons.dev/icons?i=nginx" alt="nginx" title="nginx" width="48">&nbsp;
  <img src="https://skillicons.dev/icons?i=githubactions" alt="GitHub Actions" title="GitHub Actions" width="48">&nbsp;
  <img src="https://skillicons.dev/icons?i=vitest" alt="Vitest" title="Vitest" width="48">&nbsp;
  <img src="https://skillicons.dev/icons?i=playwright" alt="Playwright" title="Playwright" width="48">
</p>

## $ npm run dev

```bash
git clone https://github.com/kfeuerschvenger/portfolio.git && cd portfolio
npm ci
npm run dev
```

Then open http://localhost:5173. You need Node 22.

> [!TIP]
> Use the npm scripts rather than `vite` directly, and see [ENVIRONMENT.md](docs/ENVIRONMENT.md) for Docker, the proxy setup and the two deployment variables.

## $ ls docs/

The README is the boot screen. The deep docs are the man pages.

| Document | The hook |
|---|---|
| [Architecture](docs/ARCHITECTURE.md) | Routes, the page, scroll behaviour, the design tokens and the brand |
| [Environment](docs/ENVIRONMENT.md) | Local setup, Docker, nginx-proxy-manager, what nginx does and what to check when it stalls |
| [Customization](docs/CUSTOMIZATION.md) | Where every word lives, how to add a project or a skill, and how to retake the screenshots |
| [Testing](docs/TESTING.md) | The Vitest suite, the accessibility scans and the gotchas of testing a typing effect |
| [CI](docs/CI.md) | Three jobs, the branch flow, the weekly audit and the required checks |
| [Roadmap](docs/ROADMAP.md) | The small things still on the list, starting with the double cursor |

---

<p align="center">
  <strong>Puerto Madryn, Patagonia · 42°46′S</strong><br>
  Compiled near the whales by <strong>Kevin Feuerschvenger</strong> · Software Engineer
</p>

<p align="center">
  <a href="https://github.com/kfeuerschvenger"><img src="https://img.shields.io/badge/GitHub-kfeuerschvenger-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="https://www.linkedin.com/in/kevin-feuerschvenger/"><img src="https://img.shields.io/badge/LinkedIn-kevin--feuerschvenger-0A66C2?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI%2BPHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0yMC40NSAyMC40NWgtMy41NnYtNS41N2MwLTEuMzMtLjAyLTMuMDQtMS44NS0zLjA0LTEuODUgMC0yLjE0IDEuNDUtMi4xNCAyLjk0djUuNjdIOS4zNVY5aDMuNDF2MS41NmguMDVjLjQ4LS45IDEuNjQtMS44NSAzLjM3LTEuODUgMy42IDAgNC4yNyAyLjM3IDQuMjcgNS40NnY2LjI4ek01LjM0IDcuNDNhMi4wNiAyLjA2IDAgMSAxIDAtNC4xMyAyLjA2IDIuMDYgMCAwIDEgMCA0LjEzek03LjEyIDIwLjQ1SDMuNTZWOWgzLjU2djExLjQ1eiIvPjwvc3ZnPg%3D%3D" alt="LinkedIn"></a>
  <a href="https://feuerschvenger.com/"><img src="https://img.shields.io/badge/Portfolio-feuerschvenger.com-357d35?style=flat-square&logo=googlechrome&logoColor=white" alt="Portfolio"></a>
</p>

<p align="center"><sub>Code released under the <a href="LICENSE">MIT license</a>. The profile photo and the brand assets (the K mark, banners and icons) are all rights reserved.</sub></p>
