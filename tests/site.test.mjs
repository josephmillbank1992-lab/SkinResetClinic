import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import "../scripts/build.mjs";

const root = resolve("dist");
const routes = [
  "/",
  "/about/",
  "/treatments/",
  "/the-clinic/",
  "/contact/",
  "/booking-information/",
  "/privacy/",
  "/404/",
];
const pages = await Promise.all(
  routes.map(async (route) => ({
    route,
    html: await readFile(resolve(root, "." + route, "index.html"), "utf8"),
  })),
);
test("all local links, fragments and assets resolve", async () => {
  for (const { route, html } of pages) {
    assert.equal(
      (html.match(/<h1[ >]/g) || []).length,
      1,
      route + " has one main heading",
    );
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (!url.startsWith("/") && !url.startsWith("#")) continue;
      const [path, fragment] = url.split("#");
      const actualPath = path || route;
      const file = resolve(
        root,
        "." + actualPath,
        actualPath.endsWith("/") ? "index.html" : "",
      );
      assert.ok((await stat(file)).isFile(), route + " links to " + url);
      if (fragment) {
        const target = await readFile(file, "utf8");
        assert.ok(
          target.includes(`id="${fragment}"`),
          route + " fragment " + url,
        );
      }
    }
  }
});
test("private address is absent from all generated pages and metadata", () => {
  for (const { html } of pages)
    assert.doesNotMatch(html, /126|Grove Lane|SK8\s*7ND/i);
});
test("treatment prices, durations and booking terms match the supplied brief", () => {
  const treatments = pages.find((p) => p.route === "/treatments/").html;
  for (const item of [
    "60 minutes · £75",
    "75 minutes · £90",
    "50 minutes · £45",
    "Oxygen Rx",
    "Firming Peptide Mask",
    "Dermalux Flex MD",
  ])
    assert.ok(treatments.includes(item), item);
  const policy = pages.find((p) => p.route === "/booking-information/").html;
  for (const item of [
    "48 hours’ notice",
    "£20 deposit by bank transfer",
    "the deposit will be retained",
    "cash or bank transfer",
  ])
    assert.ok(policy.includes(item), item);
});
test("WhatsApp links use Amy’s number and include an enquiry", () => {
  for (const { html } of pages) {
    for (const [, url] of html.matchAll(/href="(https:\/\/wa.me\/[^\"]+)"/g)) {
      const parsed = new URL(url);
      assert.equal(parsed.pathname, "/447814079580");
      assert.match(parsed.searchParams.get("text"), /^Hi Amy,/);
    }
  }
});
