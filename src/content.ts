/**
 * Every visible string and image reference for the page.
 *
 * KHURE Residence is a fictional concept written for a web-development portfolio. Nothing
 * here describes a real development: there is no address, developer, permit, price, phone
 * number or completion date, and the figures in `FACTS` are design counts rather than
 * commercial claims.
 */

export const BRAND = {
  name: 'KHURE',
  suffix: 'RESIDENCE',
  full: 'KHURE Residence',
  city: 'ULAANBAATAR',
  kind: 'RESIDENTIAL CONCEPT',
  year: '2026',
}

export const NAV = [
  { label: 'Төслийн тухай', href: '#philosophy' },
  { label: 'Байршил', href: '#location' },
  { label: 'Орон сууц', href: '#residences' },
  { label: 'Төлөвлөлт', href: '#plans' },
  { label: 'Холбоо барих', href: '#contact' },
]

/** Section index shown in the left-hand scroll rule. */
export const CHAPTERS = [
  { id: 'hero', label: 'Эхлэл' },
  { id: 'philosophy', label: 'Үзэл' },
  { id: 'architecture', label: 'Архитектур' },
  { id: 'location', label: 'Байршил' },
  { id: 'residences', label: 'Орон сууц' },
  { id: 'plans', label: 'Төлөвлөлт' },
  { id: 'amenities', label: 'Орчин' },
  { id: 'gallery', label: 'Галерей' },
  { id: 'facts', label: 'Тоо' },
  { id: 'contact', label: 'Холбоо' },
]

export const HERO = {
  headline: ['Гэрэл, харьцаа,', 'нам гүм байдал.'],
  support: 'Хотын төвд ойрхон, өдөр тутмын хөдөлгөөнд тохируулж төлөвлөсөн орон сууцны концепц.',
}

export const PHILOSOPHY = {
  eyebrow: '01 — PHILOSOPHY',
  headline: ['Амьдрах орон зай', 'зөвхөн метр квадратаар', 'хэмжигдэхгүй.'],
  body: [
    'Өдрийн гэрэл хаанаас тусч, агаар хэрхэн солигдож, нам гүм байдал хаана эхлэхийг бид эхлээд төлөвлөдөг.',
    'Метр квадратаас илүүтэй, өрөө хоорондын зай, хөдөлгөөний чиглэл шийдвэрлэдэг.',
  ],
  notes: [
    { k: 'DAYLIGHT', v: 'Өдрийн гэрэл' },
    { k: 'SPACE', v: 'Орон зайн уян хатан' },
    { k: 'PRIVACY', v: 'Хувийн нууцлал' },
    { k: 'FUNCTION', v: 'Хэрэгцээт төлөвлөлт' },
  ],
}

export const ARCHITECTURE = {
  eyebrow: '02 — ARCHITECTURE',
  headline: ['Хэлбэр нь', 'хэрэгцээнээс.'],
  body: 'Фасадны хэмнэл, гэрлийн өнцөг, амрах булан — бүгд нэг шийдлийн үргэлжлэл.',
  /** Overlay labels, placed as percentages of the pinned frame. */
  /**
   * Kept clear of the lower-left copy block: the headline and paragraph occupy roughly the
   * bottom 40% on the left, so every label sits above or to the right of it.
   */
  labels: [
    { id: 'facade', en: 'FACADE', mn: 'Фасад', x: 20, y: 22 },
    { id: 'daylight', en: 'DAYLIGHT', mn: 'Өдрийн гэрэл', x: 72, y: 15 },
    { id: 'terrace', en: 'PRIVATE TERRACE', mn: 'Хувийн террас', x: 80, y: 40 },
    { id: 'landscape', en: 'LANDSCAPE', mn: 'Ногоон орчин', x: 44, y: 30 },
    { id: 'view', en: 'URBAN VIEW', mn: 'Хотын харагдац', x: 74, y: 64 },
  ],
}

export const LOCATION = {
  eyebrow: '03 — LOCATION',
  headline: ['Өдөр тутмын', 'зай ойрхон.'],
  body: 'Ажил, сургууль, үйлчилгээ, ногоон орчин — дөрвөн зайг нэг цэгээс хэмжиж төлөвлөсөн.',
  /** Conceptual proximity diagram — deliberately no distances or travel times. */
  rings: [
    { label: 'Хотын төв', r: 96 },
    { label: 'Сургууль', r: 74 },
    { label: 'Үйлчилгээ', r: 54 },
    { label: 'Ногоон орчин', r: 34 },
  ],
  note: 'Диаграм нь концепцийн зорилгоор бүтээгдсэн бөгөөд бодит зай, цагийг илэрхийлэхгүй.',
}

export const RESIDENCES = [
  {
    id: 'a',
    type: 'A TYPE',
    rooms: '1 BEDROOM',
    title: 'Нэг өрөө',
    body: 'Гэрэл сайтай, нээлттэй төлөвлөлт. Ганцаараа эсвэл хосуудад.',
    img: 'res-a',
    alt: 'Зочин, хоол, гал тогоо нэг орон зайд нээлттэй байрласан нэг өрөө байр',
    spec: [
      { k: 'LAYOUT', v: 'Нээлттэй' },
      { k: 'LIGHT', v: 'Зүүн / өмнөд' },
      { k: 'OUTDOOR', v: 'Тагт' },
    ],
  },
  {
    id: 'b',
    type: 'B TYPE',
    rooms: '2 BEDROOM',
    title: 'Хоёр өрөө',
    body: 'Ажиллах, амрах хоёр бүс тусдаа. Гэр бүлийн эхний сонголт.',
    img: 'res-b',
    alt: 'Хоёр өрөө байрны гэрэл сайтай зочны бүс',
    spec: [
      { k: 'LAYOUT', v: 'Бүсчилсэн' },
      { k: 'LIGHT', v: 'Хоёр талын' },
      { k: 'OUTDOOR', v: 'Тагт' },
    ],
  },
  {
    id: 'c',
    type: 'C TYPE',
    rooms: '3 BEDROOM',
    title: 'Гурван өрөө',
    body: 'Нам гүм унтлагын хэсэг, зочид хүлээн авах уужим талбай.',
    img: 'res-c',
    alt: 'Гурван өрөө байрны террас, хотын харагдацтай суух хэсэг',
    spec: [
      { k: 'LAYOUT', v: 'Тусгаарласан' },
      { k: 'LIGHT', v: 'Гурван талын' },
      { k: 'OUTDOOR', v: 'Террас' },
    ],
  },
] as const

export const AMENITIES = [
  { id: 'lobby', en: 'LOBBY', mn: 'Лобби', body: 'Оршин суугчдыг угтах нам гүм эхлэл.', img: 'lobby', alt: 'Оршин суугчдын лобби, лифтний хэсэг' },
  { id: 'fitness', en: 'FITNESS', mn: 'Фитнес', body: 'Өдөр бүрийн хөдөлгөөн гэрээсээ хэдхэн алхмын зайд.', img: 'fitness', alt: 'Оршин суугчдын фитнесийн танхим' },
  { id: 'children', en: 'CHILDREN', mn: 'Хүүхдийн орчин', body: 'Хүүхдүүд аюулгүй тоглох хамгаалалттай талбай.', img: 'playground', alt: 'Барилгын хажуугийн хүүхдийн тоглоомын талбай, олсон сүлжээ' },
  { id: 'landscape', en: 'LANDSCAPE', mn: 'Ногоон байгууламж', body: 'Барилга хоорондын ногоон зурвас, сүүдэртэй суудал.', img: 'courtyard', alt: 'Хоёр орон сууцны барилгын хоорондох ногоон зурвас, алхах зам' },
  { id: 'parking', en: 'PARKING', mn: 'Зогсоол', body: 'Дулаан, хаалттай зогсоол. Өвлийн өглөө хялбар.', img: 'parking', alt: 'Барилгын доорх хаалттай зогсоол, цэвэрхэн эгнээ' },
  { id: 'security', en: 'SECURITY', mn: 'Аюулгүй байдал', body: 'Хяналттай нэвтрэлт, 24 цагийн ажиллагаа.', img: 'res-facade', alt: 'Олон айлын орон сууцны фасад, тагт бүхий давхрууд' },
] as const

export const GALLERY = [
  { img: 'architecture', alt: 'Доороос харсан орчин үеийн орон сууцны барилга', ratio: 'portrait' },
  { img: 'philosophy', alt: 'Өдрийн гэрэлтэй нээлттэй зочны орон зай', ratio: 'landscape' },
  { img: 'facade-detail', alt: 'Фасадны геометр өнгөлгөөний нарийн деталь', ratio: 'square' },
  { img: 'lounge', alt: 'Терраст нээгддэг нийтийн амралтын хэсэг', ratio: 'landscape' },
  { img: 'stair', alt: 'Дотоод шатны архитектурын деталь', ratio: 'portrait' },
  { img: 'night-city', alt: 'Шөнийн хотын харагдац', ratio: 'landscape' },
] as const

export const FACTS = [
  { n: '03', k: 'RESIDENCE TYPES', mn: 'Орон сууцны төрөл' },
  { n: '06', k: 'LIFESTYLE SPACES', mn: 'Нийтийн орчин' },
  { n: '01', k: 'DESIGN PHILOSOPHY', mn: 'Нэгдсэн үзэл' },
  { n: '2026', k: 'CONCEPT', mn: 'Концепцийн он' },
]

export const CONTACT = {
  eyebrow: '10 — CONTACT',
  headline: ['Төлөвлөлтийг', 'бүтнээр нь.'],
  body: 'KHURE Residence — гурван төрлийн орон сууц, нийтийн орчин, төлөвлөлтийг нэгтгэсэн концепц.',
  primary: 'Эхнээс нь үзэх',
  secondary: 'Төлөвлөлт үзэх',
  /** Shown instead of a phone number or address, which would be invented. */
  disclosure: 'Энэ бол зохиомол концепц төсөл. Бодит борлуулалт, хаяг, холбоо барих мэдээлэл байхгүй.',
}

export const FOOTER = {
  lines: [
    'KHURE Residence',
    'Fictional residential concept',
    'Designed & developed as a portfolio project',
  ],
}

/** Builds a responsive srcset for the two widths downloaded into /public/img. */
export const srcSet = (name: string) =>
  `/img/${name}-900.webp 900w, /img/${name}-1800.webp 1800w`
export const src = (name: string) => `/img/${name}-1800.webp`
