# Cafe Parco

Website for **Cafe Parco** — a family-run Italian café on the edge of Vauxhall Park, London.

> 190 Fentiman Road, London SW8 1QY · 020 7091 0240 · 4.7★ on Google

A fast, static, single-page site built with vanilla HTML/CSS/JS — no build step required.

## Run it

It's a static site. Either open `index.html` directly, or (recommended, so the map embed behaves) serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
index.html          # all sections: hero, story, favourites, menu, gallery, visit
css/styles.css      # warm Italian-editorial design system (Fraunces + Manrope)
js/main.js          # Lenis + GSAP scroll, Splitting headings, Swiper gallery,
                    # menu tabs, mobile nav, live open/closed status
assets/img/         # photography
lib/                # vendored animation libraries (committed so the site runs as-is)
```

## Libraries

- [Lenis](https://github.com/darkroomengineering/lenis) — smooth scroll, synced to GSAP
- [GSAP + ScrollTrigger](https://gsap.com/) — scroll animations
- [Splitting.js](https://splitting.js.org/) — character/word heading reveals
- [Swiper](https://swiperjs.com/) — the gallery carousel

## Things to confirm with the café

- **Menu prices** are indicative (a disclaimer is shown on-page) — replace with the real ones in `index.html`.
- **Opening hours** live in one `HOURS` object in `js/main.js` (currently Mon–Fri 08:30–18:00, Sat/Sun 09:00–18:00).
- Add more photos to `assets/img/` and reference them in the gallery / favourites.
