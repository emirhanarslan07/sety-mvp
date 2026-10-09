export const products = [
  {
    id: 1,
    title: "Instagram Büyüme Rehberi",
    description: "64 sayfalık PDF e-kitap",
    type: "Dijital indirme",
    price: 249,
    sales: 86,
    active: true,
    icon: "book",
  },
  {
    id: 2,
    title: "1:1 Strateji Görüşmesi",
    description: "45 dk birebir koçluk",
    type: "Danışmanlık",
    price: 1490,
    sales: 24,
    active: true,
    icon: "target",
  },
  {
    id: 3,
    title: "Reels Şablon Paketi",
    description: "30 adet Canva şablonu",
    type: "Dijital indirme",
    price: 399,
    sales: 104,
    active: true,
    icon: "film",
  },
  {
    id: 4,
    title: "YouTube Kanalım",
    description: "Haftalık yeni videolar",
    type: "Link",
    price: 0,
    sales: 0,
    active: false,
    icon: "video",
  },
];

export const money = (n: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
