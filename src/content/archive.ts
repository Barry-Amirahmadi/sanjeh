import type { ArchiveItem } from "@/types/content";

/**
 * PLACEHOLDER CONTENT — the technical archive.
 *
 * Six process and plant images at one ratio. **Every caption is required**, and
 * the type enforces it: an uncaptioned technical image is a decoration, and
 * this site does not decorate. A caption here says what the picture shows and
 * why it is worth showing — it is not a mood line.
 *
 * `category` is the axis a future archive filter would use, so the values are
 * a small controlled vocabulary rather than free text.
 */
export const archiveItems: ArchiveItem[] = [
  {
    id: "a-01",
    title: "تراشکاری بدنه",
    category: "ساخت",
    caption: "ماشین‌کاری بدنهٔ شیر از قطعهٔ ریختگی، پیش از پرداخت سطح نشیمنگاه.",
    image: {
      src: "/media/a-01.jpg",
      alt: "محور تراش با براده‌های فلزی روی میز دستگاه",
      ratio: "1/1",
    },
    order: 1,
  },
  {
    id: "a-02",
    title: "قفسهٔ قطعات آماده",
    category: "انبار",
    caption: "قطعات پرداخت‌شده پیش از مونتاژ، جداشده بر اساس سایز اسمی.",
    image: {
      src: "/media/a-02.jpg",
      alt: "قفسهٔ کارگاهی پر از قطعات فولاد زنگ‌نزن آماده",
      ratio: "1/1",
    },
    order: 2,
  },
  {
    id: "a-03",
    title: "ابزار اندازه‌گیری",
    category: "بازرسی",
    caption: "کولیس و میکرومتر روی میز بازرسی؛ ابعاد هر دسته پیش از بسته‌بندی کنترل می‌شود.",
    image: {
      src: "/media/a-03.jpg",
      alt: "کولیس و میکرومتر روی میز فولادی کارگاه",
      ratio: "1/1",
    },
    order: 3,
  },
  {
    id: "a-04",
    title: "میز آزمون فشار",
    category: "بازرسی",
    caption: "چیدمان لوله‌کشی و مانیفولد میز آزمون، برای بستن قطعه در دو سر خط.",
    image: {
      src: "/media/a-04.jpg",
      alt: "میز آزمون فشار با لوله‌کشی و مانیفولدهای فلزی",
      ratio: "1/1",
    },
    order: 4,
  },
  {
    id: "a-05",
    title: "راهروی انبار",
    category: "انبار",
    caption: "بریده‌های لوله در راهروی انبار، چیده‌شده بر اساس قطر.",
    image: {
      src: "/media/a-05.jpg",
      alt: "ردیف بریده‌های لوله روی هم در راهروی انبار",
      ratio: "1/1",
    },
    order: 5,
  },
  {
    id: "a-06",
    title: "باز کردن شیر برای سرویس",
    category: "سرویس",
    caption: "اجزای یک شیر باز شده و به ترتیب مونتاژ روی میز چیده شده است.",
    image: {
      src: "/media/a-06.jpg",
      alt: "میز کار با اجزای باز شدهٔ یک شیر، چیده‌شده به ترتیب",
      ratio: "1/1",
    },
    order: 6,
  },
];

export const sortedArchive = [...archiveItems].sort((a, b) => a.order - b.order);
