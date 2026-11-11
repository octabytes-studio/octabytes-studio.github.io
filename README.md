# OctaBytes studio site

The public landing page for OctaBytes, served from GitHub Pages at
<https://octabytes-studio.github.io/>.

## What's here

| Path | Purpose |
|---|---|
| `index.html` | Landing page |
| `404.html` | Custom not-found page |
| `assets/css/site.css` | All styling |
| `assets/js/site.js` | Menu, gallery, reveal and octagon interactions |
| `assets/fonts/` | Self-hosted Instrument Sans, Instrument Serif and JetBrains Mono (SIL OFL) |
| `assets/work/` | Real screenshots from Quizoo, Slingtide and KOMET, converted to WebP |
| `assets/img/` | Logo, favicons and social share image |
| `app-ads.txt` | AdMob verification file — do not remove |

## Editing

- Project copy and statuses live in `index.html`. Quizoo is live on Google Play;
  Slingtide and KOMET are marked “In development” until their store listings exist.
- The three project galleries are defined in `<template data-gallery="…">` blocks.
  They drive the lightbox without any extra JSON.
- Colours and type are tokenised at the top of `assets/css/site.css`.
- No build step, no framework and no client-side tracking.

## Publishing

Push to `main`. GitHub Pages serves the repository root automatically. The
`app-ads.txt` file must stay at the root because AdMob crawls the hostname root.
