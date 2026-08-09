# SLS Techtrade Innovations LLP — Website

## Current state (as of this delivery)

### 1. Design system
`css/style.css` — dark navy corporate theme built on your actual brand colors:
- **Palette:** Ink Navy `#0A1424`, Royal Blue `#2456D6`, Logo Blue `#0B6EAA`,
  Logo Green `#0EA37D` — sampled directly from your logo file, not generic
  cyan/orange defaults.
- **Type:** Space Grotesk (display) + Inter (body) + IBM Plex Mono (data/labels),
  loaded from Google Fonts.
- **Logo:** your real logo file (`images/logo.png`, transparent background) is
  used in the nav and footer on every page — no placeholder SVG mark.
- **Capability strip:** a static (non-animated) row of key capabilities in the
  homepage hero and the Trading section on `logistics-trading.html`. This
  replaced an earlier animated scrolling ticker that had text-overlap
  rendering issues — the static version is simpler and won't glitch.
- Scroll-reveal, animated counters, hover lifts — respects `prefers-reduced-motion`.
- Fully responsive: mobile nav drawer (single hamburger-to-✕ toggle), stacked
  grids, fluid type via `clamp()`.

### 2. Photography
All photography is your own — no stock images anywhere in the current build:
- `images/truck-side-branded.jpg`, `truck-fleet-day.jpg`, `truck-fleet-night.jpg`,
  `truck-air-suspension-rear.jpg` — your fleet
- `images/warehouse-interior.jpg` — warehousing/distribution visual
- Used across About, Home, Logistics & Trading, and Specialized Cargo pages

### 3. Contact form
- `contact.html` → `#quoteForm` posts to a Google Apps Script Web App.
- Required fields: **Full Name, Phone Number, Email Address**. "Service
  Required" was removed per your request.
- `js/main.js` handles the submit, shows a status message, and degrades
  gracefully (still shows a success state locally) until setup is finished.
- `google-apps-script.gs` — paste-ready backend that appends each enquiry as
  a row into your sheet, tab `SLS_techtrade`.
- `GOOGLE_SHEETS_SETUP.md` — step-by-step setup guide, linked to your actual
  spreadsheet.
- **Still required before go-live:** deploy the Apps Script in your Google
  account and paste the resulting `/exec` URL into `GOOGLE_SHEET_ENDPOINT` at
  the top of `js/main.js`. This is the one step that needs your own Google
  login — nothing else blocks launch.

### 4. WhatsApp
Floating WhatsApp button on every page (`wa.me/919182960315`), using the real
WhatsApp icon with a small SLS favicon badge, pulse animation, pre-filled
enquiry message.

### 5. LinkedIn
`https://www.linkedin.com/company/sls-techtrade-innovations-llp/` in the
Organization JSON-LD `sameAs` on every page, footer social row, and the
Contact page.

### 6. SEO
- Unique `<title>` and meta description per page, `<link rel="canonical">`,
  Open Graph + Twitter Card tags, `Organization` + `BreadcrumbList` JSON-LD
  (all validated as parseable JSON).
- `og:image` and the JSON-LD `logo` field point to real hosted images
  (`images/truck-fleet-day.jpg` and `images/logo.png`) — previously these
  pointed to files that didn't exist in the delivery, which would have shown
  broken previews when links were shared on WhatsApp/LinkedIn/etc.
- `sitemap.xml` and `robots.txt` match the 5 live pages exactly and correctly
  disallow the old redirect stubs.

## File map
```
index.html                        Home
about.html                        About
logistics-trading.html            Logistics & Trading (merged, anchor sections)
specialized-cargo-transport.html  Specialized Cargo Transport
contact.html                      Contact + Request a Quote (Google Sheets)
logistics.html / trading.html / industries.html   redirect stubs (kept, noindexed)
css/style.css                     Design system
js/main.js                        Nav, reveal, counters, form → Sheets
images/                           Logo, favicons, fleet & warehouse photos, WhatsApp icon
google-apps-script.gs             Paste into Apps Script
GOOGLE_SHEETS_SETUP.md            Setup guide
sitemap.xml / robots.txt          SEO
```

## Before you go live
1. **Required:** Complete `GOOGLE_SHEETS_SETUP.md` and update
   `GOOGLE_SHEET_ENDPOINT` in `js/main.js` — this is the only remaining
   blocker; everything else is ready as-is.
2. Optional: swap the two placeholder legal links (`Privacy Policy`,
   `Terms & Conditions`, currently `href="#"`) once those pages exist.
3. Optional: confirm the LinkedIn URL is your final vanity URL if it changes
   in future.
