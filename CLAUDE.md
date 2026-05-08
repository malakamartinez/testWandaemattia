# Wanda & Mattia Wedding PWA

## Vision
Luxury italian minimal web app for the wedding day experience, mobile-first, elegant, warm, and highly functional.

## Brand Core
- Couple: Wanda & Mattia
- Date: 27 Giugno 2026
- Ceremony: Basilica di Otranto, 15:30
- Reception: Torre del Parco 1419, Lecce
- Heritage: Italian, Pugliese, Mediterranean

## Design Tokens
- `--color-bg: #fdf8f4`
- `--color-surface: #fef3ec`
- `--color-primary: #e8845a`
- `--color-primary-dark: #c4623a`
- `--color-accent: #1a3a5c`
- `--color-gold: #c9a96e`
- `--color-text: #2c1a0e`
- `--color-text-muted: #7a6a5a`
- `--color-divider: #e8d8c8`
- Display font: Cormorant Garamond
- Body font: DM Sans

## UX Principles
- One-page narrative with 9 sections as separate visual scenes.
- Every CTA is clear and touch friendly (minimum 44px target).
- Accessible by default: semantic structure, keyboard focus, labels, contrast.
- Reduced motion fallback with `prefers-reduced-motion`.

## Technical Constraints
- Stack: pure HTML, CSS, vanilla JS.
- No backend: localStorage for RSVP, game, gallery, audio metadata.
- PWA installable with manifest + service worker.
- Assets local or inline SVG, no external raster images.

## Editable Content Anchors
In `index.html`, update:
- `window.WEDDING_CONTENT` for texts, locations, links, hotels, FAQ.
- `window.GAME_MISSIONS` for Fantasposi tasks and points.
- `window.STORY_CHAPTERS` for timeline cards.

## QA Checklist
- Mobile (375px), tablet, desktop layout sanity.
- Countdown accuracy and section navigation.
- RSVP validation and JSON export.
- Gallery upload, persist, zip download.
- Audio recording availability and fallback messaging.
- Service worker registration and offline shell load.
