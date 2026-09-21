import type {
  AboutContent,
  ArchiveContent,
  CapabilityContent,
  CollectionContent,
  ContactContent,
  IndexContent,
  InquiryContent,
  MastheadContent,
  MethodContent,
  NoteContent,
  NotFoundContent,
  ProductPageContent,
} from "@/types/content";

/**
 * The copy deck.
 *
 * **Voice.** Short declarative sentences. Specification and explanation, not
 * description. Passive construction is acceptable and often correct. The
 * vocabulary is range, capacity, tolerance, material, lead time, application
 * and limitation — never narrative, never an origin story.
 *
 * **What is banned here and why.** Two lists. The editorial family's words —
 * دست‌ساز، عاشقانه، با عشق، هنر، اصیل، لوکس، ناب — would read as borrowed from
 * a different kind of company. And the whole family's banned list — خلاق،
 * حرفه‌ای، باتجربه، منحصربه‌فرد، پیشرو، بهترین، باکیفیت — is banned because
 * every one of them is an unfalsifiable claim wearing the clothes of a fact.
 *
 * **No parentheses in Persian text, anywhere.** They break RTL rendering.
 *
 * Every export is annotated against an interface in `src/types/content.ts`
 * rather than left to inference (§52). Deleting a field below fails typecheck,
 * which is what makes "a CMS could supply this" a checkable claim.
 */

/* ========================================================================== */
/*  HOME — band 01: masthead                                                  */
/* ========================================================================== */

/**
 * The company's own specification sheet. It opens the site the way a datasheet
 * opens: name, one line saying what this is, then the numbers.
 *
 * There is no hero image, no statement quote, no brand story and no values
 * band on this homepage, and their absence is the design. A buyer in this trade
 * is not persuaded by a photograph across the top of a page; they read a site
 * as evidence of whether the company is organised.
 */
export const masthead: MastheadContent = {
  index: "01",
  descriptor:
    "سنجه قطعات کنترل سیال و ابزار اندازه‌گیری را برای خطوط صنعتی می‌سازد و مستقیم به سازنده و پیمانکار می‌فروشد.",
  facts: [
    { label: "حوزهٔ کاری", value: "شیرآلات کنترلی · ابزار دقیق · اتصالات خط" },
    { label: "بازهٔ سایز", value: '1/4" … 12"', data: true },
    { label: "بازهٔ فشار کاری", value: "0 … 40 bar", data: true },
    { label: "بازهٔ دمای کاری", value: "-50 … +400 °C", data: true },
    { label: "جنس بدنه", value: "فولاد زنگ‌نزن · برنج" },
    { label: "نوع اتصال", value: "فلنجی · دنده‌ای · جوشی · ویفری" },
  ],
};

/* ========================================================================== */
/*  HOME — band 02: capability table                                          */
/* ========================================================================== */

/**
 * The page's centrepiece, and the thing a business-to-business buyer actually
 * reads. Eleven lines of what is made against the ranges each is made in.
 *
 * Every cell is a physical attribute. There is no throughput figure, no
 * capacity statistic, no headcount and no lead-time promise in this table,
 * because those are claims about a company rather than descriptions of a part.
 */
export const capability: CapabilityContent = {
  index: "02",
  heading: "چه چیزی ساخته می‌شود",
  lead: "فهرست گروه‌های تولیدی و بازهٔ کاری هرکدام. اگر قطعهٔ مورد نیاز شما بیرون از این بازه‌هاست، همان را بنویسید تا مسیر دیگری پیشنهاد شود.",
  caption: "گروه‌های تولیدی به همراه بازهٔ سایز، بازهٔ فشار کاری و جنس بدنه.",
  columns: {
    group: "گروه محصول",
    size: "بازهٔ سایز",
    pressure: "بازهٔ فشار",
    material: "جنس بدنه",
  },
  rows: [
    { id: "c-01", group: "شیر کنترلی گلوب", size: '1/2" … 8"', pressure: "0 … 40 bar", material: "فولاد زنگ‌نزن" },
    { id: "c-02", group: "شیر توپی دنده‌ای", size: '1/4" … 2"', pressure: "0 … 25 bar", material: "برنج" },
    { id: "c-03", group: "شیر توپی فلنجی", size: '1/2" … 6"', pressure: "0 … 40 bar", material: "فولاد زنگ‌نزن" },
    { id: "c-04", group: "شیر پروانه‌ای ویفری", size: '2" … 12"', pressure: "0 … 16 bar", material: "فولاد زنگ‌نزن" },
    { id: "c-05", group: "شیر یک‌طرفه", size: '1/2" … 8"', pressure: "0 … 25 bar", material: "برنج و فولاد" },
    { id: "c-06", group: "گیج فشار عقربه‌ای", size: "63 … 160 mm", pressure: "0 … 25 bar", material: "فولاد زنگ‌نزن" },
    { id: "c-07", group: "فلومتر خطی", size: '1" … 6"', pressure: "0 … 16 bar", material: "فولاد زنگ‌نزن" },
    { id: "c-08", group: "پراب دما و غلاف", size: "6 … 12 mm", pressure: "0 … 40 bar", material: "فولاد زنگ‌نزن" },
    { id: "c-09", group: "زانویی و سه‌راهی جوشی", size: '1/2" … 10"', pressure: "0 … 40 bar", material: "فولاد زنگ‌نزن" },
    { id: "c-10", group: "فلنج گلودار", size: '1/2" … 12"', pressure: "0 … 40 bar", material: "فولاد زنگ‌نزن" },
    { id: "c-11", group: "صافی خط", size: '1/2" … 8"', pressure: "0 … 25 bar", material: "برنج و فولاد" },
  ],
};

/* ========================================================================== */
/*  HOME — band 03: product index                                             */
/* ========================================================================== */

export const productIndex: IndexContent = {
  index: "03",
  heading: "فهرست محصولات",
  lead: "نه محصول در سه گروه. هر خانه یک قطعه است و هیچ خانه‌ای از خانهٔ دیگر بزرگ‌تر نیست.",
  listLabel: "فهرست نه محصول",
  detailLabel: "مشخصات کامل",
  countLabel: "محصول",
  /** Three of each product's seven specifications, shown on every cell. Which
   *  three matter at a glance is an editorial decision, not a component's. */
  cellSpecs: ["سایز اسمی", "فشار کاری", "جنس بدنه"],
  allLabel: "مقایسهٔ کامل مشخصات",
  allHref: "/products/",
};

/* ========================================================================== */
/*  HOME — band 04: method                                                    */
/* ========================================================================== */

export const method: MethodContent = {
  index: "04",
  heading: "مسیر کار",
  lead: "چهار مرحله، از نخستین پیام تا پس از تحویل.",
  steps: [
    {
      id: "m-01",
      title: "استعلام",
      body: "شرایط خط را می‌فرستید: سیال، دبی، فشار و دمای کاری، سایز خط و نوع اتصال موجود. اگر عددی در دست نیست همان را هم می‌نویسید؛ فهرست ناقص از فهرست حدسی بهتر است.",
    },
    {
      id: "m-02",
      title: "انتخاب",
      body: "بر پایهٔ همان شرایط، سایز و جنس بدنه و نوع اتصال پیشنهاد می‌شود. جایی که قطعهٔ مناسبی در فهرست نیست همین گفته می‌شود و مسیر دیگری پیشنهاد می‌شود.",
    },
    {
      id: "m-03",
      title: "ساخت",
      body: "قطعه ماشین‌کاری و پرداخت می‌شود و ابعاد هر دسته پیش از بسته‌بندی کنترل می‌شود. هر تغییری که در مسیر ساخت لازم شود، پیش از اجرا اعلام می‌شود.",
    },
    {
      id: "m-04",
      title: "تحویل",
      body: "قطعه با کد کاتالوگ بسته‌بندی و تحویل می‌شود. پرسش‌های پس از نصب با همان کد پیگیری می‌شوند و پروندهٔ هر استعلام تا پایان نصب باز می‌ماند.",
    },
  ],
};

/* ========================================================================== */
/*  HOME — band 05: technical note                                            */
/* ========================================================================== */

/**
 * The band that does the selling, and the band most likely to be cut for
 * looking boring. It is neither a blog post nor a brochure: it explains one
 * engineering principle that a reader of this site has to make a decision
 * about, and explaining it is the only credential this page offers.
 *
 * The figure beside it is a hand-drawn SVG rather than a photograph, and that
 * is deliberate — see `src/content/note.figure` in the report. A generated
 * image of a chart produces garbled axis text, and a chart is the one thing on
 * this site that must be read rather than looked at.
 */
export const note: NoteContent = {
  index: "05",
  heading: "منحنی مشخصه و رفتار حلقهٔ کنترلی",
  lead: "چرا یک شیر درست‌انتخاب‌شده هم می‌تواند حلقهٔ کنترلی را نوسانی کند.",
  figureLabel: "شکل",
  figureNumber: "01",
  figure: {
    src: "/media/figure-01.svg",
    alt: "نمودار درصد دبی در برابر درصد بازشدگی شیر، با دو منحنی نشانه‌گذاری‌شدهٔ A و B",
    ratio: "8/5",
    caption:
      "محور افقی درصد بازشدگی و محور عمودی درصد دبی است. منحنی A خطی و منحنی B هم‌درصد است.",
  },
  body: [
    "منحنی مشخصهٔ یک شیر کنترلی، رابطهٔ میان درصد بازشدگی شیر و درصد دبی عبوری از آن است. دو شکل رایج این منحنی خطی و هم‌درصد نام دارند و تفاوت میان آن دو تعیین می‌کند که یک حلقهٔ کنترلی در عمل آرام بماند یا نوسان کند.",
    "در منحنی خطی، هر درجه چرخش محور افزایش یکسانی در دبی می‌دهد. این رفتار وقتی درست است که افت فشار دو سر شیر در سراسر بازهٔ کاری تقریباً ثابت بماند؛ حالتی که در خطوط کوتاه با پمپ بزرگ دیده می‌شود و در بیشتر خطوط واقعی دیده نمی‌شود.",
    "با باز شدن شیر، دبی خط بالا می‌رود و افت فشار اصطکاکی لوله و زانویی‌ها و صافی نیز بالا می‌رود؛ در نتیجه سهم شیر از افت فشار کل کم می‌شود. اثر این تغییر آن است که شیر خطی در ابتدای بازه بسیار حساس و در انتهای بازه تقریباً بی‌اثر می‌شود.",
    "منحنی هم‌درصد برای جبران همین اثر ساخته شده است. در آن هر درجه چرخش، درصد ثابتی به دبی لحظه‌ای اضافه می‌کند: در بازشدگی کم تغییرات کوچک و در بازشدگی زیاد تغییرات بزرگ. وقتی چنین شیری روی خطی بنشیند که افت فشارش با دبی زیاد می‌شود، حاصل دو اثر تقریباً خطی از آب درمی‌آید و حلقهٔ کنترلی در تمام بازه پاسخ یکنواخت می‌دهد.",
    "نتیجهٔ عملی ساده است: انتخاب منحنی کار طراح خط است، نه کار سازندهٔ شیر. برای تصمیم‌گیری باید نسبت افت فشار شیر به افت فشار کل خط در دبی کمینه و بیشینه معلوم باشد. هر جا این نسبت خیلی پایین بیفتد هیچ منحنی‌ای رفتار کنترلی قابل قبولی نمی‌دهد و مسئله در اندازهٔ شیر است نه در شکل منحنی آن. شیر بزرگ‌تر از نیاز، شایع‌ترین علت نوسان در حلقه‌های کنترلی است؛ چنین شیری تمام کار خود را در بخش کوچکی از ابتدای بازه انجام می‌دهد و باقی بازه بی‌استفاده می‌ماند.",
  ],
};

/* ========================================================================== */
/*  HOME — band 06: contact                                                   */
/* ========================================================================== */

export const contact: ContactContent = {
  index: "06",
  heading: "تماس",
  lead: "استعلام با تلفن، رایانامه یا واتس‌اپ آغاز می‌شود. سبد خرید و قیمت آنلاین در کار نیست؛ هر قطعه بر پایهٔ شرایط خط قیمت می‌خورد.",
  labels: {
    address: "نشانی",
    phone: "تلفن",
    email: "رایانامه",
    hours: "ساعت کاری",
    route: "مسیر استعلام",
  },
  routeNote: "کد محصول را همراه پیام بفرستید تا نخستین پاسخ کامل باشد.",
};

/* ========================================================================== */
/*  ROUTE — /products/                                                        */
/* ========================================================================== */

export const collection: CollectionContent = {
  index: "01",
  heading: "مقایسهٔ کامل مشخصات",
  lead: "همهٔ نه محصول در یک جدول، با پنج ستون مشخصات. کاربرد و محدودیت هر قطعه جمله‌اند و در صفحهٔ همان قطعه آمده‌اند، نه در یک خانهٔ جدول.",
  tableLabel: "جدول مقایسهٔ مشخصات نه محصول",
  tableCaption: "کد، نام، گروه و پنج مشخصهٔ اندازه‌گیری‌شدنی هر محصول، در یک جدول.",
  tableHint: "جدول از کنار کشیده می‌شود.",
  codeColumn: "کد",
  nameColumn: "نام محصول",
  comparisonLabels: ["سایز اسمی", "فشار کاری", "دمای کاری", "جنس بدنه", "نوع اتصال"],
  groupsIndex: "02",
  groupsLabel: "فهرست بر پایهٔ گروه",
  seo: {
    title: "فهرست محصولات",
    description:
      "مقایسهٔ مشخصات نه محصول سنجه در یک جدول: سایز اسمی، فشار کاری، دمای کاری، جنس بدنه و نوع اتصال، به همراه فهرست گروه‌بندی‌شده.",
  },
};

/* ========================================================================== */
/*  ROUTE — /products/[slug]/                                                 */
/* ========================================================================== */

export const productPage: ProductPageContent = {
  detailsIndex: "01",
  detailsHeading: "مشخصات فنی",
  detailsCaption: "مشخصات این محصول، شامل بازهٔ کاری و محدودیت آن.",
  descriptionIndex: "02",
  descriptionHeading: "توضیح فنی",
  viewsIndex: "03",
  viewsHeading: "نمای دیگر",
  relatedIndex: "04",
  relatedHeading: "محصولات هم‌گروه",
  relatedCaption: "دو محصول دیگر از همین گروه.",
  relatedColumns: { code: "کد", name: "نام محصول", category: "گروه" },
  backLabel: "بازگشت به فهرست محصولات",
  breadcrumbHome: "صفحهٔ اصلی",
  breadcrumbCollection: "فهرست محصولات",
  breadcrumbLabel: "مسیر صفحه",
  openLabel: "مشاهدهٔ مشخصات",
};

export const inquiry: InquiryContent = {
  label: "استعلام در واتس‌اپ",
  /** `{product}` and `{code}` are substituted at render time. The code is the
   *  point: a buyer should never have to retype what the page already knew. */
  message: "سلام. دربارهٔ {product} با کد {code} استعلام دارم.",
  generalLabel: "شروع استعلام در واتس‌اپ",
  generalMessage: "سلام. برای یک خط صنعتی استعلام قطعه دارم.",
  newWindow: "در پنجرهٔ تازه باز می‌شود",
};

/* ========================================================================== */
/*  ROUTE — /gallery/  (the technical archive)                                */
/* ========================================================================== */

export const archive: ArchiveContent = {
  index: "01",
  heading: "آرشیو فنی",
  lead: "شش نما از مسیر ساخت، بازرسی و سرویس. هر شکل شماره و شرح دارد؛ تصویر بی‌شرح در این آرشیو جایی ندارد.",
  viewLabel: "نمای بزرگ",
  figureLabel: "شکل",
  seo: {
    title: "آرشیو فنی",
    description:
      "شش نمای شماره‌گذاری‌شده از کارگاه سنجه: ماشین‌کاری، انبار قطعات، بازرسی ابعادی، میز آزمون فشار و سرویس.",
  },
};

/* ========================================================================== */
/*  ROUTE — /about/                                                           */
/* ========================================================================== */

export const about: AboutContent = {
  index: "01",
  heading: "دربارهٔ سنجه",
  lead: "یک کارگاه ساخت قطعه، و یک فهرست که عمداً کوتاه نگه داشته شده است.",
  body: [
    "سنجه قطعات کنترل سیال و ابزار اندازه‌گیری می‌سازد و همان‌ها را مستقیم به سازنده، پیمانکار و واحد نگهداری می‌فروشد. میان ما و کسی که قطعه را نصب می‌کند واسطه‌ای نیست، و این تنها یک ترتیب فروش نیست: پرسش نصب مستقیم به کسی می‌رسد که قطعه را ماشین‌کاری کرده است.",
    "فهرست عمداً کوتاه است. نه قطعه در سه گروه، هر گروه سه قطعه. هر قطعه‌ای که به فهرست اضافه شود یک بازهٔ کاری تازه، یک انبار تازه و یک مسیر سرویس تازه می‌آورد. فهرست کوتاه یعنی هر قطعه واقعاً موجود است و بازهٔ کاری‌اش واقعاً آزموده شده است.",
    "چیزی که این‌جا نمی‌بینید هم بخشی از همین تصمیم است. قیمت آنلاین نداریم، چون قیمت قطعه به سیال، فشار، دما و نوع اتصال خط بستگی دارد و عددی که بدون این‌ها اعلام شود دوباره اصلاح خواهد شد. فرم تماس هم نداریم؛ تلفن و رایانامه و واتس‌اپ سریع‌ترند.",
    "در هر استعلام، جایی که قطعهٔ مناسبی در فهرست نداریم همین را می‌گوییم. فروختن قطعه‌ای که در بازهٔ اشتباه کار می‌کند، برای ما یک فروش است و برای خط شما یک خرابی شش ماه بعد. محدودیت هر قطعه روی صفحهٔ خودش نوشته شده است، نه در پانوشت.",
    "این صفحه‌ها را با همین نگاه ساخته‌ایم: هر عددی که می‌بینید یک مشخصهٔ فیزیکی است و هیچ ادعایی دربارهٔ گواهی، تأییدیه یا انطباق با استاندارد در کار نیست. اگر سندی لازم دارید، در استعلام بپرسید.",
  ],
  factsHeading: "بازهٔ کاری",
  contactHeading: "تماس",
  facts: [
    { label: "گروه‌های تولیدی", value: "شیرآلات کنترلی · ابزار دقیق · اتصالات خط" },
    { label: "شمار محصول", value: "9", data: true },
    { label: "بازهٔ سایز", value: '1/4" … 12"', data: true },
    { label: "بازهٔ فشار کاری", value: "0 … 40 bar", data: true },
    { label: "بازهٔ دمای کاری", value: "-50 … +400 °C", data: true },
    { label: "جنس بدنه", value: "فولاد زنگ‌نزن · برنج" },
  ],
  seo: {
    title: "دربارهٔ ما",
    description:
      "سنجه قطعات کنترل سیال و ابزار اندازه‌گیری می‌سازد و مستقیم به سازنده و پیمانکار می‌فروشد. فهرست کوتاه، بازهٔ کاری مشخص و محدودیت نوشته‌شدهٔ هر قطعه.",
  },
};

/* ========================================================================== */
/*  ROUTE — /404                                                              */
/* ========================================================================== */

export const notFound: NotFoundContent = {
  index: "404",
  heading: "این نشانی در فهرست نیست.",
  lead: "صفحه‌ای که خواسته‌اید وجود ندارد یا جابه‌جا شده است. فهرست کامل محصولات از این‌جا باز می‌شود.",
  action: { label: "رفتن به فهرست محصولات", href: "/products/" },
};
