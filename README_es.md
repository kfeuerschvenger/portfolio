<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/brand/banner-dark.svg">
    <img src="docs/assets/brand/banner-light.svg" alt="kfeuerschvenger: Software Engineer, compilado cerca de las ballenas" width="100%">
  </picture>
</p>

<p align="center">
  <a href="https://github.com/kfeuerschvenger/portfolio/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/kfeuerschvenger/portfolio/ci.yml?branch=main&style=flat-square&label=CI&logo=githubactions&logoColor=white" alt="Estado de CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/licencia-MIT-357d35?style=flat-square" alt="Licencia MIT"></a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5.9">
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 7">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4.1">
</p>

<p align="center"><a href="README.md">English</a> · <strong>Español</strong></p>

<p align="center">
  <img src="docs/assets/screens/hero.gif" alt="La página arranca: el nombre y el título se escriben solos en la terminal y luego la página recorre Sobre mí, Proyectos y Habilidades" width="100%">
</p>

**Un portafolio que arranca como una terminal y termina con código de salida 0.**

Hola, soy Kevin, Software Engineer de Puerto Madryn, y este es mi rincón de internet: una sola página disfrazada de sesión de shell, con verde fósforo, cursor de bloque y líneas de barrido que casi se oyen zumbar.

Cada sección es un comando. `cat about.txt` abre una ventana de vim, `ls -la ~/projects` lista mis repositorios y `tree ~/skills` despliega el stack. Sin backend, sin cookies y sin necesidad de `sudo`.

Compilado cerca de las ballenas, así que resulta un poco más tranquilo que un build cualquiera.

## $ ./tour

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="docs/assets/screens/hero-framed.png" alt="La portada con el nombre Kevin Feuerschvenger escrito en una terminal, el título Software Engineer y la ubicación">
      <p><strong>$ whoami</strong> Un nombre que se escribe solo, un título que lo sigue y una foto que se pone a color cuando la señalas con el puntero.</p>
    </td>
    <td width="50%" valign="top">
      <img src="docs/assets/screens/about-framed.png" alt="La sección Sobre mí como un buffer de vim con líneas numeradas">
      <p><strong>$ cat about.txt</strong> Siete años de experiencia en una ventana de vim. Prueba <code>:q</code>: no pasa nada, y eso es parte del estilo.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="docs/assets/screens/projects-framed.png" alt="La sección de proyectos como una tabla ls -la de repositorios">
      <p><strong>$ ls -la ~/projects</strong> Todos los repositorios en una tabla, cada fila es un enlace y cada lenguaje lleva su punto de color.</p>
    </td>
    <td width="50%" valign="top">
      <img src="docs/assets/screens/skills-framed.png" alt="La sección de habilidades como un árbol de ocho carpetas">
      <p><strong>$ tree ~/skills</strong> Ocho carpetas, de frontend a ai, para ver el stack antes de leer una sola palabra.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="docs/assets/screens/contact-framed.png" alt="La sección de contacto como una ventana de script con enlaces a GitHub, LinkedIn y correo">
      <p><strong>$ ./contact --help</strong> La única página de ayuda que termina con una forma de escribirme.</p>
    </td>
    <td width="50%" valign="top">
      <img src="docs/assets/screens/not-found-framed.png" alt="La página 404 con aspecto de error de terminal">
      <p><strong>exit 404</strong> Hasta el camino equivocado parece un shell, y te devuelve al inicio sin drama.</p>
    </td>
  </tr>
</table>

### $ man portfolio

- **Un comando por sección.** Toda la página es una larga sesión de terminal, con una barra fija que ilumina la sección en la que estás.
- **Pensada también para el teléfono.** En pantallas chicas un botón `$ menu` abre los enlaces, se cierra con Escape y devuelve el foco donde estaba.
- **Tranquila si lo pides.** Con movimiento reducido el nombre aparece completo, el cursor se queda quieto y nada se desliza.
- **Verificada, no supuesta.** Cuarenta y tres pruebas, un análisis de accesibilidad en cada componente y un CI que nunca llega tarde.
- **Capturas a demanda.** Las imágenes de arriba salen de un script, así que se vuelven a tomar después de cada cambio en lugar de quedar desactualizadas.

Una visita, desde la primera tecla hasta la ventana de contacto:

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "JetBrains Mono, Consolas, monospace", "primaryColor": "#090a0c", "primaryBorderColor": "#00ff00", "primaryTextColor": "#00ff00", "lineColor": "#357d35", "textColor": "#357d35", "edgeLabelBackground": "#090a0c"}}}%%
flowchart LR
  Boot["arranque"] --> Who["whoami"] --> Title["se escribe el título"] --> Links["aparecen los enlaces"]
  Links -->|scroll| About["cat about.txt"] --> Projects["ls ~/projects"] --> Skills["tree ~/skills"] --> Contact["./contact"]
  Contact -.->|ruta desconocida| NotFound["exit 404"]
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
  <img src="docs/assets/diagrams/architecture.svg" alt="Las fuentes se compilan en una imagen de Docker, un contenedor nginx detrás de nginx-proxy-manager sirve la aplicación React de una sola página, y el CI y el pipeline de capturas corren alrededor del build" width="100%">
</picture>

Una aplicación React de una sola página, con estilos de Tailwind CSS 4 y empaquetada por Vite, se entrega como archivos estáticos dentro de una imagen `nginx:alpine`. nginx agrega los encabezados de seguridad, los límites de tasa por cliente y el respaldo que permite que los enlaces profundos lleguen al router, y trabaja detrás de nginx-proxy-manager. GitHub Actions revisa, prueba, compila y audita cada cambio, y un pipeline de Playwright toma las capturas.

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
git clone https://github.com/kfeuerschvenger/portfolio.git
npm ci
npm run dev
```

Después abre http://localhost:5173. Hace falta Node 22.

> [!TIP]
> Usa los scripts de npm en lugar de `vite` directamente, y consulta [ENVIRONMENT.md](docs/ENVIRONMENT.md) para Docker, la configuración del proxy y las dos variables de despliegue. Las guías están en inglés.

## $ ls docs/

El README es la pantalla de arranque. Las guías son las páginas del manual.

| Documento | El gancho |
|---|---|
| [Architecture](docs/ARCHITECTURE.md) | Rutas, la página, el comportamiento del scroll, los tokens de diseño y la marca |
| [Environment](docs/ENVIRONMENT.md) | Instalación local, Docker, nginx-proxy-manager, qué hace nginx y qué revisar cuando algo se traba |
| [Customization](docs/CUSTOMIZATION.md) | Dónde vive cada palabra, cómo agregar un proyecto o una habilidad y cómo volver a tomar las capturas |
| [Testing](docs/TESTING.md) | La suite de Vitest, los análisis de accesibilidad y las trampas de probar un efecto de tipeo |
| [CI](docs/CI.md) | Tres jobs, el flujo de ramas, la auditoría semanal y los checks obligatorios |
| [Roadmap](docs/ROADMAP.md) | Las pequeñas cosas que quedan en la lista, empezando por el cursor doble |

---

<p align="center">
  <strong>Puerto Madryn, Patagonia · 42°46′S</strong><br>
  Compilado cerca de las ballenas por <strong>Kevin Feuerschvenger</strong> · Software Engineer
</p>

<p align="center">
  <a href="https://github.com/kfeuerschvenger"><img src="https://img.shields.io/badge/GitHub-kfeuerschvenger-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="https://www.linkedin.com/in/kevin-feuerschvenger/"><img src="https://img.shields.io/badge/LinkedIn-kevin--feuerschvenger-0A66C2?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI%2BPHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0yMC40NSAyMC40NWgtMy41NnYtNS41N2MwLTEuMzMtLjAyLTMuMDQtMS44NS0zLjA0LTEuODUgMC0yLjE0IDEuNDUtMi4xNCAyLjk0djUuNjdIOS4zNVY5aDMuNDF2MS41NmguMDVjLjQ4LS45IDEuNjQtMS44NSAzLjM3LTEuODUgMy42IDAgNC4yNyAyLjM3IDQuMjcgNS40NnY2LjI4ek01LjM0IDcuNDNhMi4wNiAyLjA2IDAgMSAxIDAtNC4xMyAyLjA2IDIuMDYgMCAwIDEgMCA0LjEzek03LjEyIDIwLjQ1SDMuNTZWOWgzLjU2djExLjQ1eiIvPjwvc3ZnPg%3D%3D" alt="LinkedIn"></a>
  <a href="https://feuerschvenger.com/"><img src="https://img.shields.io/badge/Portfolio-feuerschvenger.com-357d35?style=flat-square&logo=googlechrome&logoColor=white" alt="Portfolio"></a>
</p>

<p align="center"><sub>Código publicado bajo la <a href="LICENSE">licencia MIT</a>. La foto de perfil y los recursos de marca (el logo K, los banners y los íconos) tienen todos los derechos reservados.</sub></p>
