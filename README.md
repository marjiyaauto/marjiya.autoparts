# Marjiya Auto Jashore — মারজিয়া অটো যশোর

Genuine motorcycle spare parts, Bangladesh. Static Jekyll site for GitHub Pages.
Live: https://marjiyaauto.github.io/marjiya.autoparts/

## Run locally
```
bundle install
bundle exec jekyll serve      # http://localhost:4000/marjiya.autoparts/
```
Push to `main` → GitHub Pages builds and deploys.

## Where to edit what
| To change | Edit |
|---|---|
| Phone, WhatsApp, address, hours, rating, review count, couriers | `_config.yml` (used on every page) |
| Brands / models / categories / delivery cities | `_data/*.yml` (menus, footer, home page update automatically) |
| Customer reviews on the home page | `_data/reviews.yml` — **real reviews only** |
| Google Analytics | `google_analytics:` in `_config.yml` (blank = nothing loads) |
| Page design | `assets/css/style.css`; behaviour: `assets/js/main.js` |

## Before you rely on it
1. **Replace the generated brand images** in `assets/images/` (logo, `marjiya-auto-og.png`, icons) with your real ones. See `assets/images/README.md`.
2. Upload real product photos; pages show a placeholder until the files exist.
3. Keep `rating` and `review_count` in `_config.yml` equal to your Google Business Profile.
4. `robots.txt` only works at a domain root. On a `github.io/<repo>` project site, submit `…/marjiya.autoparts/sitemap.xml` in Google Search Console instead (or use a custom domain).

## Adding a product
Create `products/<slug>/index.html` with `layout: product` — copy the Pulsar 150 fuel tank page. Image paths start with `/assets/...` (no base path). Add `price: 1234` only if you want a price shown (it also enables product rich-result markup).
