import type { MetadataRoute } from "next";

const BASE = "https://dastafzar.example.com"; // TODO: real domain at launch
const PAGES = ["", "/tools/jalali-calendar", "/tools/date-converter", "/tools/age-calculator", "/tools/date-difference", "/tools/nowruz-countdown"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({ url: BASE + p, changeFrequency: "weekly", priority: p === "" ? 1 : 0.8 }));
}
