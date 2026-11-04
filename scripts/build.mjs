import { mkdir, rm, writeFile, cp } from "node:fs/promises";
import { clinic, treatments, reviews } from "../src/content.mjs";

const out = new URL("../dist/", import.meta.url);
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(new URL("../public/", import.meta.url), out, { recursive: true });
await cp(
  new URL("../src/styles.css", import.meta.url),
  new URL("styles.css", out),
);
await cp(new URL("../src/site.js", import.meta.url), new URL("site.js", out));

const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const icons = {
  whatsapp:
    '<path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.8a8.5 8.5 0 1 1 16.1-4.1Z"/><path d="M8.1 7.5c.4-.3.8 0 1 .5l.6 1.4c.1.3-.2.6-.6 1 .7 1.6 1.6 2.5 3.3 3.2.4-.5.7-1 1-1l1.7.8c.5.2.5.6.3 1-.3.8-.9 1.3-1.7 1.3-2.6-.1-6.9-3.8-7-6.6 0-.7.6-1.4 1.4-1.6Z"/>',
  instagram:
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/>',
  phone:
    '<path d="m7 3 3 5-2 2c1.2 2.6 3.4 4.8 6 6l2-2 5 3c-.6 3-2 4-4 4C10 20 4 14 3 7c0-2 1-3.4 4-4Z"/>',
  arrow: '<path d="M3 12h17m-6-6 6 6-6 6"/>',
};
const icon = (name) =>
  `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
const wa = (label = "Enquire on WhatsApp", style = "primary", treatment = "") =>
  `<a class="button ${style}" href="${clinic.whatsapp}?text=${encodeURIComponent(treatment ? `Hi Amy, I’d like to enquire about ${treatment}.` : "Hi Amy, I’d like to enquire about a facial at The Skin Reset Clinic.")}" target="_blank" rel="noopener noreferrer">${icon("whatsapp")}${label}</a>`;
const nav = [
  ["/", "Home"],
  ["/about/", "About"],
  ["/treatments/", "Treatments"],
  ["/the-clinic/", "The Clinic"],
  ["/contact/", "Contact"],
];
const divider =
  '<div class="ornament" aria-hidden="true"><span></span>✦<span></span></div>';
const brand = `<img src="/assets/brand-symbol.webp" alt="" width="415" height="460"><span class="brand-words"><span>THE SKIN RESET</span><span class="brand-clinic">- CLINIC -</span><span class="brand-tagline">RESET. RENEW. RESTORE</span></span>`;
function header(path) {
  return `<header class="site-header"><div class="header-inner"><a class="brand" href="/" aria-label="The Skin Reset Clinic home">${brand}</a><button class="menu-toggle" aria-expanded="false" aria-controls="main-nav">Menu <span aria-hidden="true">☰</span></button><nav id="main-nav" aria-label="Main navigation">${nav.map(([url, label]) => `<a href="${url}"${url === path ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>${wa("Enquire on WhatsApp", "dark header-cta")}</div></header>`;
}
function footer() {
  return `<footer class="site-footer"><div class="footer-main"><p>The Skin Reset Clinic, Cheadle Hulme</p><div class="footer-links"><a href="/privacy/">Privacy</a><a href="/booking-information/">Booking information</a></div><a class="footer-social" href="${clinic.instagram}" target="_blank" rel="noopener noreferrer">${icon("instagram")}<span>Follow on Instagram for seasonal<br>facials and clinic updates.</span></a></div><p class="copyright">© ${new Date().getFullYear()} The Skin Reset Clinic. Reset. Renew. Restore.</p></footer>`;
}
function booking() {
  return `<section class="booking-band" aria-labelledby="booking-heading"><div class="container"><h2 id="booking-heading">Make time for your skin.</h2><p class="eyebrow light">Appointments by arrangement</p><div class="appointment-times"><p><strong>Wednesday:</strong> 4.30pm &amp; 6pm</p><p><strong>Friday:</strong> 9.30am, 11am &amp; 12.30pm</p></div><div class="booking-links">${wa()}<a href="tel:+447814079580">${icon("phone")}${clinic.phone}</a><a href="${clinic.instagram}" target="_blank" rel="noopener noreferrer">${icon("instagram")}@theskinresetclinicuk</a></div><p class="booking-note">£20 deposit · Full clinic address shared after booking</p></div></section>`;
}
const intro = `<section class="intro shadow-wash"><div class="container intro-grid"><div><h2>A facial that<br>starts with you.</h2><span class="short-rule" aria-hidden="true"></span></div><div class="intro-copy"><p>Every appointment at The Skin Reset Clinic starts with a thorough consultation and skin analysis, so your treatment is tailored to your skin, your concerns and your goals.</p><p>I use <strong>Circadia</strong> professional skincare alongside personalised products and techniques to support your skin and leave it feeling refreshed and balanced.</p></div></div></section>`;
function cards() {
  return `<section class="treatment-section container" aria-labelledby="treatment-heading"><h2 id="treatment-heading" class="center">Three ways to reset.</h2>${divider}<div class="treatment-grid">${treatments.map((t) => `<article class="treatment-card"><a class="treatment-photo" href="/treatments/#${t.id}" tabindex="-1" aria-hidden="true"><img src="/assets/${t.image}" alt="" width="280" height="161" loading="lazy"></a><h3><a href="/treatments/#${t.id}">${t.name}</a></h3><p>${t.summary}</p><p class="treatment-meta">${t.duration} minutes · £${t.price}</p><a class="text-link" href="/treatments/#${t.id}">Explore this facial ${icon("arrow")}</a></article>`).join("")}</div></section>`;
}
const reviewBand = `<section class="review-band shadow-wash" aria-label="Client review"><div class="container"><div class="quote-mark" aria-hidden="true">“</div><figure><blockquote>“The thorough personal consultation,<br class="desktop-break"> beautiful room and heated bed were<br class="desktop-break"> all really lovely.”</blockquote><figcaption>Jo · Client review</figcaption></figure><a class="text-link" href="/about/#client-reviews">More kind words ${icon("arrow")}</a></div></section>`;
const seasonal = `<aside class="seasonal"><span aria-hidden="true">✦</span><p>A little something seasonal?<br><a href="${clinic.instagram}" target="_blank" rel="noopener noreferrer">Follow on Instagram</a> for occasional seasonal facials, offers and clinic updates. You can also find <strong>The Skin Reset Clinic</strong> on Facebook.</p></aside>`;
function pageIntro(kicker, title, description) {
  return `<section class="page-intro shadow-wash"><div class="container"><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="lead">${description}</p></div></section>`;
}

const pages = {
  "/": {
    title: "Bespoke Facials in Cheadle Hulme | The Skin Reset Clinic",
    description:
      "Bespoke facials with Amy, a VTCT qualified Skin Therapist in Cheadle Hulme. Circadia skincare and Dermalux LED, tailored to you. Facials from £45.",
    body: `<section class="hero"><img class="hero-image" src="/assets/skincare-still-life.webp" alt="Skincare, soft linen and flowers in warm dappled light" width="1536" height="1024" fetchpriority="high"><div class="container hero-content"><p class="eyebrow">Bespoke facials · Cheadle Hulme</p><span class="short-rule" aria-hidden="true"></span><h1>Your skin.<br>Your space.<br>Your reset.</h1><p class="hero-description">Personalised skincare and time<br class="desktop-break"> for yourself, with Amy.</p><div class="hero-actions"><a class="button primary" href="/treatments/">Explore treatments ${icon("arrow")}</a>${wa("Book by WhatsApp", "outline")}</div></div></section><div class="trust-strip"><span>VTCT qualified</span><i aria-hidden="true">·</i><span>Fully insured</span><i aria-hidden="true">·</i><span>One client at a time</span></div>${intro}${cards()}${reviewBand}${booking()}`,
  },
  "/about/": {
    title: "Meet Amy | The Skin Reset Clinic, Cheadle Hulme",
    description:
      "Meet Amy, a VTCT qualified and fully insured Skin Therapist. A personal approach to facials, Circadia skincare and skin mixology in Cheadle Hulme.",
    body: `${pageIntro("Your skin, understood", "A personal approach.<br>A little time for you.", "Bespoke skincare with Amy, your VTCT qualified and fully insured Skin Therapist in Cheadle Hulme.")}<section class="container editorial"><div class="editorial-image"><img src="/assets/skincare-still-life.webp" alt="Professional skincare still life with soft linen" width="1536" height="1024"></div><div><p class="eyebrow">Hello, I’m Amy</p><h2>Your facial starts<br>with a conversation.</h2><p>I want every appointment to feel personal. We begin with a thorough consultation and skin analysis, giving us time to talk about your skin, your concerns and what you would like from your treatment.</p><p>I use Circadia professional skincare and skin mixology, combining different products and ingredients to create a treatment around your individual needs.</p><p>Whether you are looking for a relaxing reset or a more targeted facial, I adapt the products and techniques to suit you.</p>${wa("Let’s talk about your skin")}</div></section><section class="soft-section"><div class="container prose"><p class="eyebrow">Thoughtfully personalised</p><h2>Three treatments.<br>Many ways to make them yours.</h2><p>My menu is deliberately simple. Rather than separate paid add-ons, I personalise each appointment, incorporating LED therapy into a facial where appropriate and adapting the other elements to the time available.</p><a class="text-link" href="/treatments/">Find your facial ${icon("arrow")}</a></div></section><section id="client-reviews" class="container reviews-section"><h2 class="center">Kind words, from clients.</h2>${divider}<div class="reviews-grid">${reviews.map((r) => `<figure class="review"><span class="small-quote" aria-hidden="true">“</span><blockquote>${r.quote}</blockquote><figcaption>— ${r.name}</figcaption></figure>`).join("")}</div></section>${booking()}`,
  },
  "/treatments/": {
    title: "Bespoke Facials & LED Treatments | The Skin Reset Clinic",
    description:
      "Explore The Reset Facial (£75), Advanced Reset Facial (£90) and LED Skin Reset (£45). Personalised Circadia skincare and Dermalux Flex MD in Cheadle Hulme.",
    body: `${pageIntro("The treatment menu", "Three ways to reset.", "Every facial is bespoke. We start with a consultation and skin analysis, then choose products and techniques around your skin, your concerns and your goals.")}<div class="container treatment-jumps">${treatments.map((t) => `<a href="#${t.id}">${t.name}<span>£${t.price}</span></a>`).join("")}</div><div class="container treatment-details">${treatments.map((t, i) => `<article class="treatment-detail" id="${t.id}"><div class="detail-visual"><img src="/assets/${t.image}" alt="${t.alt}" width="280" height="161" loading="lazy"><span class="treatment-number">0${i + 1}</span></div><div><p class="eyebrow">${t.duration} minutes · £${t.price}</p><h2>${t.name}</h2><p class="lead">${t.introduction}</p>${t.paragraphs.map((p) => `<p>${p}</p>`).join("")}${wa("Enquire about this facial", "primary", t.name)}</div></article>`).join("")}</div><div class="container">${seasonal}<section class="faq-section"><h2>A few things you might be wondering.</h2><details><summary>Which facial should I choose?</summary><p>If you’re unsure, send Amy a message. Every appointment begins with a consultation and skin analysis, so the products and techniques can be tailored to your needs.</p></details><details><summary>Do you offer paid add-ons or courses?</summary><p>There are currently no separate paid add-ons or treatment courses. The menu is kept simple and each appointment is personalised. Additional treatments or courses may be introduced as the clinic develops.</p></details><details><summary>Can LED be included in my facial?</summary><p>LED therapy can be incorporated into The Reset Facial or The Advanced Reset Facial where appropriate, depending on your skin, the treatment and time available. Other elements are adapted to allow sufficient time.</p></details><details><summary>Is extra time needed for my first appointment?</summary><p>Please allow a little extra time for a full consultation and skin assessment at your first appointment.</p></details></section></div>${booking()}`,
  },
  "/the-clinic/": {
    title: "Your Visit | The Skin Reset Clinic, Cheadle Hulme",
    description:
      "Your visit to The Skin Reset Clinic in Cheadle Hulme. Appointments on Wednesdays and Fridays, a personal consultation and time to relax.",
    body: `${pageIntro("The clinic · Cheadle Hulme", "Your space.<br>Time to switch off.", "A personal appointment with Amy, with time to understand your skin and settle into your treatment.")}<section class="container editorial"><div><p class="eyebrow">A little space for yourself</p><h2>Thoughtful skincare.<br>A calm, personal visit.</h2><p>Every visit begins with a conversation and skin analysis. From the products selected to the techniques used, your treatment is tailored around you.</p><p>Clients have described the clinic’s beautiful room and heated bed, and the chance to feel at ease throughout their appointment.</p><p>The clinic is in <strong>Cheadle Hulme</strong>. The full address is shared once your booking is confirmed.</p><a class="text-link" href="/booking-information/">Plan your first visit ${icon("arrow")}</a></div><div class="brand-panel"><img src="/assets/logo.webp" alt="The Skin Reset Clinic — Reset, Renew, Restore" width="1125" height="1115" loading="lazy"></div></section><section class="soft-section"><div class="container visit-grid"><div><p class="eyebrow">By arrangement</p><h2>Clinic availability.</h2><p>Wednesday: 4.30pm &amp; 6pm<br>Friday: 9.30am, 11am &amp; 12.30pm</p><p>Additional availability is planned as the clinic grows. Message Amy to discuss current appointments.</p></div><div><p class="eyebrow">Your first appointment</p><h2>A little extra time.</h2><p>Please allow a little extra time for a full consultation and skin assessment on your first visit.</p><p>A £20 deposit by bank transfer secures your appointment. The remaining balance is paid after your treatment by cash or bank transfer.</p></div></div></section>${booking()}`,
  },
  "/contact/": {
    title: "Contact & Book a Facial | The Skin Reset Clinic",
    description:
      "Book a bespoke facial with Amy in Cheadle Hulme. WhatsApp or text 07814 079580, or message @theskinresetclinicuk on Instagram.",
    body: `${pageIntro("Let’s find your reset", "Good skin starts<br>with a conversation.", "Ready to book, or wondering which facial is right for you? Get in touch with Amy to talk through your skin and current appointment availability.")}<section class="container contact-grid"><div><p class="eyebrow">Get in touch</p><h2>Say hello to Amy.</h2><div class="contact-actions">${wa()}<a class="button outline" href="sms:+447814079580">${icon("phone")}Text ${clinic.phone}</a><a class="button outline" href="${clinic.instagram}" target="_blank" rel="noopener noreferrer">${icon("instagram")}Message on Instagram</a></div><p>You can also send a message to <strong>The Skin Reset Clinic</strong> on Facebook.</p><p class="small">Bookings are arranged directly with Amy. Your appointment is secured once your £20 bank transfer deposit has been received.</p></div><div class="contact-note"><p class="eyebrow">Cheadle Hulme</p><h2>A time for you.</h2><dl><dt>Wednesday</dt><dd>4.30pm &amp; 6pm</dd><dt>Friday</dt><dd>9.30am, 11am &amp; 12.30pm</dd></dl><p>Appointments by arrangement. The full clinic address is shared after your booking is confirmed.</p><a class="text-link" href="/booking-information/">Booking &amp; cancellations ${icon("arrow")}</a></div></section><div class="container">${seasonal}</div>`,
  },
  "/booking-information/": {
    title: "Booking Information & Cancellations | The Skin Reset Clinic",
    description:
      "How to book at The Skin Reset Clinic, including your £20 deposit, payment information, first visit and 48-hour cancellation and changes policy.",
    body: `${pageIntro("Before your visit", "Booking information.", "Everything you need to know about arranging your appointment.")}<section class="container policy prose"><h2>How to book</h2><p>Contact Amy by text or WhatsApp on <a href="tel:+447814079580">${clinic.phone}</a>, or send a message on Instagram or Facebook to discuss your appointment.</p><ol><li>A <strong>£20 deposit by bank transfer</strong> is required to secure your appointment.</li><li>The remaining balance is payable after your treatment, either by <strong>cash or bank transfer</strong>.</li><li>The <strong>full clinic address</strong> will be shared once your booking is confirmed.</li><li>For your first appointment, please allow a little extra time for a full consultation and skin assessment.</li></ol><h2>Cancellations &amp; changes</h2><p>Please give at least <strong>48 hours’ notice</strong> if you need to cancel or rearrange your appointment.</p><p>With 48 hours’ notice, your <strong>£20 deposit can be transferred to a new appointment</strong>.</p><p>With less than 48 hours’ notice, or for a missed appointment, <strong>the deposit will be retained</strong>.</p><p>To change an appointment, please contact Amy directly.</p>${wa("Contact Amy")}</section>${booking()}`,
  },
  "/privacy/": {
    title: "Privacy Information | The Skin Reset Clinic",
    description:
      "Privacy information for The Skin Reset Clinic. Ask Amy for the full or short privacy notice and information about treatment records.",
    body: `${pageIntro("Your information", "Privacy, with care.", "Your personal information and treatment records are handled confidentially.")}<section class="container policy prose"><h2>The clinic’s privacy notice</h2><p>The Skin Reset Clinic has a full and a short privacy notice available on request. Please contact Amy to request a copy or to ask about how your personal information is used.</p><p>During your consultation, the consent and treatment agreement includes this statement:</p><blockquote class="policy-quote">“I understand that my personal information and treatment records will be stored securely and handled confidentially in line with The Skin Reset Clinic Privacy Policy”</blockquote><h2>Contacting the clinic</h2><p>WhatsApp, Instagram and Facebook links take you to those services. Information you share there is also handled under the relevant service’s privacy terms.</p><p>This website does not include an enquiry form, advertising trackers or analytics scripts.</p>${wa("Request the privacy notice")}</section>`,
  },
  "/404/": {
    title: "Page Not Found | The Skin Reset Clinic",
    description: "Find your way back to The Skin Reset Clinic.",
    body: `${pageIntro("A small detour", "Let’s find your way back.", "This page could not be found. Your reset is still here.")}<div class="container not-found"><a class="button primary" href="/">Back to home ${icon("arrow")}</a><a class="button outline" href="/treatments/">Explore treatments</a></div>`,
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: clinic.name,
  description: pages["/"].description,
  telephone: "+447814079580",
  areaServed: { "@type": "Place", name: "Cheadle Hulme" },
  priceRange: "£45–£90",
  sameAs: [clinic.instagram],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Bespoke facials",
    itemListElement: treatments.map((t) => ({
      "@type": "Offer",
      price: String(t.price),
      priceCurrency: "GBP",
      itemOffered: { "@type": "Service", name: t.name, description: t.summary },
    })),
  },
};
for (const [path, page] of Object.entries(pages)) {
  const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><meta name="theme-color" content="#faf6f0"><meta property="og:type" content="website"><meta property="og:locale" content="en_GB"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:image" content="/assets/skincare-still-life.webp"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/brand-symbol.webp"><link rel="preload" href="/assets/cormorant-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css"><script src="/site.js" defer></script><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script></head><body><a class="skip-link" href="#main">Skip to content</a>${header(path)}<main id="main">${page.body}</main>${footer()}</body></html>`;
  const target = path === "/" ? out : new URL(path.slice(1), out);
  await mkdir(target, { recursive: true });
  await writeFile(new URL("index.html", target), html);
  if (path === "/404/") await writeFile(new URL("404.html", out), html);
}
await writeFile(new URL("robots.txt", out), "User-agent: *\nAllow: /\n");
console.log(`Built ${Object.keys(pages).length} pages into dist/`);
