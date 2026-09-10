# OpenTecho · Digital Planner

An open-source digital planner generator. Runs entirely in the browser — no install required — and produces a cross-year planner with fixed page ordering, exportable as SVG or PDF.

> 中文说明见 [README-cn.md](README-cn.md)

**Live Demo: https://fengdonglu.github.io/OpenTecho/**

## Features

- **Runs in the browser**: pure frontend, no installation, all data processed locally (nothing is uploaded)
- **Cross-year layout**: previous year Q4 (Oct–Dec) → full year (Jan–Dec) → next year Q1 (Jan–Mar), each month followed by its weekly pages
- **Lunar calendar & holidays**: lunar conversion via [lunar-javascript](https://github.com/6tail/lunar-javascript), plus statutory and folk holiday markers
- **Multiple themes**: Minimal / Sakura / Milk Tea / Lemon / Matcha / Cyan / Indigo / Grape, with a color/grayscale toggle for export
- **i18n**: 简体中文 / 繁體中文 / English
- **Configurable week start**: Monday / Sunday
- **Export**: SVG (single page or all pages) or PDF (200dpi JPEG, B6 single page 125×176mm, B5 spread 250×176mm)

## Tech Stack

Vue 3 · TypeScript · Vite · Pinia · jsPDF · lunar-javascript

## Quick Start

```bash
npm install
npm run dev     # dev server at http://localhost:3000
npm run build   # type-check + production build
```

## Project Structure

```
src/
├── components/preview/   # SVG preview component
├── generators/           # document assembly (cross-year ordering)
├── locales/              # Chinese/English messages
├── stores/               # Pinia state
├── templates/            # page templates: three-year/yearly/monthly/weekly/intro/grid/blank/contact/meeting
├── types/                # type definitions
└── utils/                # date, lunar, holiday, svg, pdf, download
public/                   # favicon & static assets
```

## Usage

1. Set the year (auto-inferred from the current quarter), theme, week start and language
2. The sidebar index follows `Overview → prev Q4 → full year → next Q1 → Appendix`; click to jump
3. The appendix contains a "Guide" page plus configurable counts of "Grid", "Blank", "Contacts" and "Meeting Notes" pages
4. The right panel previews the current page; use prev/next or type a page number to jump
5. Download SVG (single/all) or export PDF

## Roadmap

> The project currently implements only a small part of the PAL methodology.

- [ ] Slogan / annual theme — filled in at the start of the year, referenced by the year review
- [ ] Year review page — compared against the slogan set at the start of the year
- [ ] More PAL methodology features — to be scoped
- [ ] Appendix content — candidates: 24 solar terms table, zodiac-year reference, unit/paper conversion
- [ ] Extract core engine into an NPM package (`@opentecho/core`)

## Deployment

- **GitHub Pages**: pushing to `main`/`master` auto-builds and deploys (see `.github/workflows/deploy.yml`)
- **Self-hosted**: pushing a `v*` tag triggers a release workflow that builds `dist`, packages it into a zip, and uploads it as a release asset — download and serve the extracted folder with any static file server

## Acknowledgements

This project is a programmatic implementation of the **PAL** planner by 「不是闷」. The distinctive **I-beam axis (工字轴)** layout idea comes from PAL. Many thanks to the author for the thoughtful design — do check out the original for more usage ideas.

Built with Vibe Coding.

## License

[GPL-3.0](LICENSE)

## Author

[OpenTecho Team](https://github.com/fengdonglu/OpenTecho)
