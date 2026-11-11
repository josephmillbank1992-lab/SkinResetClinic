# The Skin Reset Clinic

A responsive, static five-page website for Amy’s bespoke facial clinic in Cheadle Hulme, with booking information, privacy information and a custom 404 page.

## Develop

Requires Node.js 20 or newer. No external packages or install step are required.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Re-run the server after source changes.

```sh
npm run build
npm test
```

Build output is `dist/`. Vercel settings are included in `vercel.json`.

## Update the site

- `src/content.mjs`: contact details, treatments, prices and reviews.
- `scripts/build.mjs`: page content, shared navigation, footer and metadata.
- `src/styles.css`: responsive styling.
- `src/site.js`: accessible mobile navigation.
- `public/assets/`: optimised images, supplied logo and self-hosted fonts.

All bookings are direct enquiries by WhatsApp, text or social media. There is no online booking or payment system. A £20 deposit is arranged by bank transfer directly with Amy.

## Before the public launch

- Amy’s ten supplied photographs are placed according to The Skin Reset Clinic Photos and Pages guide. Optimised WebP versions are in `public/assets/`.
- Add the exact Facebook page URL when supplied; a guessed link is deliberately not used.
- Obtain Amy’s full privacy notice if she wants it published. The current privacy page offers it on request, as instructed.
- Confirm the purchased domain, then add canonical URLs, a sitemap and an absolute social sharing image URL for that domain. No unregistered domain is assumed in the build.
- Set up Google Business Profile separately. No invented Google rating or reviews are used.

The street address and postcode are intentionally excluded from the website and structured data. The booking policy says the full address is shared after booking.

Fonts: Cormorant Garamond and DM Sans, distributed under the SIL Open Font License. License files are included in `public/assets/`.
