'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Plus,
  Calendar,
  Download,
  BookOpen,
  Users,
  Zap,
  ShieldCheck,
  MousePointer2,
  Palette,
  ChevronDown,
  Sparkles,
  Layers,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuthModal } from "@/context/AuthModalContext";
import { SetyLogo } from "@/components/sety/brand";
import { SiteHeader } from "@/components/sety/SiteHeader";
import { StickyCTA } from "@/components/sety/sticky-cta";
import { turkishCreatorIcons } from "@/components/sety/hero-icons";
import { CreatorPreview } from "@/components/sety/creator-preview";

interface BentoDetail {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  howItWorks: string[];
  example: string;
}

const bentoDetails: Record<string, BentoDetail> = {
  session: {
    id: "session",
    badge: "ZAMANINI DEĞERE DÖNÜŞTÜR",
    title: "Birebir Seanslar, Danışmanlık & Koçluk",
    subtitle: "Uzmanlığını ve saatini tek linkten sat.",
    description:
      "Takipçilerinin veya danışanlarının WhatsApp veya DM'de gün ve saat sormasına son ver. Otomatik takvim ile seans rezervasyonlarını kolayca al.",
    items: [
      "Psikolojik danışmanlık & terapi ön görüşmeleri",
      "1:1 Kariyer, e-ticaret ve dijital iş koçluğu",
      "Özel dersler & yabancı dil pratik seansları",
      "Portföy, CV ve tasarım inceleme görüşmeleri",
      "Grup workshopları ve strateji seansları",
    ],
    howItWorks: [
      "Müsait gün ve saatlerini belirlersin.",
      "Danışanın tek tıkla seans tipini seçip randevusunu oluşturur.",
      "Google Meet / Zoom bağlantısı ve WhatsApp teyidi otomatik iletilir.",
    ],
    example: "Örnek: Uzm. Klinik Psikolog Gizem Hanım — Ayda 30+ seans randevusu.",
  },
  digital: {
    id: "digital",
    badge: "BİR KERE ÜRET. TEKRAR TEKRAR SAT.",
    title: "Dijital Ürünler, Şablonlar & Tasarımlar",
    subtitle: "Dosyalarını ve yaratıcı çözümlerini anında indirmeye aç.",
    description:
      "Günde onlarca kişiye aynı dosyayı göndermek yerine, güvenli dosya teslimatı sağlayan Sety vitrinine yükle. Pasif gelirin tadını çıkar.",
    items: [
      "Canva & Notion şablonları ve planlayıcılar",
      "Figma UI kitleri, ikon setleri ve tasarım sistemleri",
      "Lightroom fotoğraf preset'leri ve video LUT'ları",
      "Excel / Google Sheets finansal ve bütçe tabloları",
      "Yazılımcılar için kod snippet'ları ve hazır şablonlar",
    ],
    howItWorks: [
      "Dosyanı veya indirme linkini (Drive/Dropbox vb.) eklersin.",
      "Müşteri ödemesini tamamladığı an indirme butonuna ulaşır.",
      "Lisanslı dosya doğrudan alıcının e-postasına da arşivlenir.",
    ],
    example: "Örnek: Tasarımcı Deniz Yılmaz — İçerik Planlama Kiti ile 200+ satış.",
  },
  book: {
    id: "book",
    badge: "BİLGİN, BİRİNİN YOL HARİTASI.",
    title: "E-Kitaplar, Rehberler & PDF Dokümanlar",
    subtitle: "Deneyimlerini ve bilgi birikimini sayfalara dök.",
    description:
      "Yıllar içinde edindiğin sektör tecrübesi, bir başkasının yolunu aydınlatacak en değerli kaynaktır. Dijital kitaplarınla kitleni eğit ve gelir yarat.",
    items: [
      "Sektörel uzmanlık rehberleri ve vaka analizleri",
      "Adım adım başarı formülleri ve 'How-To' kılavuzları",
      "Sağlıklı beslenme, fitness ve tarif e-kitapları",
      "Kontrol listeleri (checklists) ve çalışma kağıtları",
      "Yapay zeka (AI) prompt kütüphaneleri ve ipuçları",
    ],
    howItWorks: [
      "PDF rehberini tek tıkla mağazana yüklersin.",
      "Fiyatını belirler, kapak görselini eklersin.",
      "Takipçilerin masaüstünden ve mobilden anında okumaya başlar.",
    ],
    example: "Örnek: 'Fikirden İlk Satışa' 48 sayfalık PDF rehberi.",
  },
  community: {
    id: "community",
    badge: "BİRLİKTE DAHA FAZLASI.",
    title: "Topluluklar, Bültenler & Mini Kurslar",
    subtitle: "Bilgini yaşayan bir deneyime ve sadık kitleye dönüştür.",
    description:
      "Tek seferlik satışların ötesine geçerek düzenli abonelik veya özel topluluk erişimi sun. En sadık destekçilerinle derin bağlar kur.",
    items: [
      "Özel Telegram ve Discord komünite erişimi",
      "Haftalık ücretli e-posta bültenleri (Substack tarzı)",
      "Kısa video modüllerden oluşan pratik mini kurslar",
      "Aylık üyelik ve soru-cevap (Q&A) seansları",
      "Ağ oluşturma (networking) ve mentörlük grupları",
    ],
    howItWorks: [
      "Özel topluluk veya kurs içerik linkini belirlersin.",
      "Katılımcılar abone olduklarında otomatik giriş yetkisi kazanır.",
      "Düzenli gelir akışını tek bir panelden takip edersin.",
    ],
    example: "Örnek: 100+ üyeli 'Yaratıcı Girişimciler Topluluğu'.",
  },
};

const faqs = [
  [
    "Sety ile neler satabilirim?",
    "Birebir danışmanlık seanslarını, e-kitaplarını, şablonlarını, dijital dosyalarını ve mini kurslarını tek bir mağazada sunabilirsin.",
  ],
  [
    "Mağazamı açmak için teknik bilgi gerekiyor mu?",
    "Hayır. Mağaza adını belirle, profilini kişiselleştir ve ürünlerini ekle. Kod yazmadan kendi dijital vitrinini oluşturabilirsin.",
  ],
  [
    "Ödemelerimi nasıl alırım?",
    "Ödeme altyapını mağazana bağlayarak tahsilatını doğrudan kendi banka veya ödeme hesabından yönetebilirsin.",
  ],
  [
    "Lansman döneminde ücret ödeyecek miyim?",
    "Lansmana özel mağaza açılışı tamamen ücretsizdir (%0 komisyon). Kredi kartı gerekmeden anında başlayabilirsin.",
  ],
  [
    "Seanslar ve dijital ürünler birlikte satılabilir mi?",
    "Evet. Takipçilerin aynı vitrinde seanslarını inceleyebilir, dijital ürünlerini keşfedebilir ve doğrudan sana ulaşabilir.",
  ],
];

export function CreatorHubLanding() {
  const { openModal } = useAuthModal();
  const [faq, setFaq] = useState<number | null>(null);
  const [activeBento, setActiveBento] = useState<BentoDetail | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const auth = urlParams.get("auth");
      if (auth === "signup" || auth === "register") {
        openModal("signup");
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (auth === "login") {
        openModal("login");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [openModal]);

  return (
    <div className="landing">
      {/* ═══ HERO SECTION ═══ */}
      <section className="hero">
        <SiteHeader />
        <div className="hero-icons" aria-hidden="true">
          {turkishCreatorIcons.map(({ id, icon: Icon, className }) => (
            <div key={id} className={`original-hero-icon ${className}`}>
              <div>
                <Icon />
              </div>
            </div>
          ))}
        </div>
        <div className="hero-copy">
          <button
            type="button"
            onClick={() => openModal("signup")}
            className="launch-label cursor-pointer hover:scale-105 transition-transform"
          >
            <span /> LANSMANA ÖZEL · %0 KOMİSYON <ArrowUpRight size={13} />
          </button>
          <h1>
            Takipçilerini müşteriye
            <br className="desktop-break" /> dönüştürmenin
            <br />
            <span>en kolay yolu.</span>
          </h1>
          <p>
            Bildiğin, ürettiğin, ilham verdiğin her şeyin bir değeri var.
            <br className="desktop-break" /> Seanslarını ve dijital ürünlerini tek bir linkten sat.
            <br />
            <span className="hero-highlight-tag">Sen üret, Sety ile kazanmaya başla ✨</span>
          </p>
          <Button
            className="main-cta hero-main-cta bg-[#5500FF] hover:bg-[#4400cc] !text-white font-black shadow-xl"
            onClick={() => openModal("signup")}
          >
            <span>Ücretsiz mağazanı aç</span>
            <ArrowUpRight />
          </Button>
          <div className="hero-checks">
            <span>
              <Check /> 2 dakikada kurulum
            </span>
            <span>
              <Check /> Kredi kartı gerekmez
            </span>
            <span>
              <Check /> Lansmana özel ücretsiz
            </span>
          </div>
        </div>
        <a href="#nasil-calisir" className="hero-scroll">
          DAHA FAZLASINI KEŞFET <ChevronDown size={15} />
        </a>
      </section>

      {/* ═══ CREATOR SHOWCASE SECTION ═══ */}
      <section className="creator-section" id="nasil-calisir">
        <div className="section-heading">
          <span className="eyebrow">
            <span className="tiny-line" /> KÜÇÜK BİR LİNK. BÜYÜK BİR POTANSİYEL.
          </span>
          <h2>
            Senin yeteneğin.
            <br />
            Senin mağazan. <span>Senin kazancın.</span>
          </h2>
          <p>
            Takipçilerinin seni keşfettiği yerden, ilk satışına kadar.
            <br />
            Sana ait, profesyonel bir vitrin. Karmaşa yok, sınır yok.
          </p>
        </div>
        <CreatorPreview />
        <div className="creator-bottom-wrapper">
          <div className="creator-bottom">
            <span>
              <ShieldCheck size={18} /> Sana ait bir mağaza, baştan sona.
            </span>
            <Button variant="link" asChild>
              <Link href="/denizyilmaz">
                Örnek mağazayı incele <ArrowUpRight size={16} />
              </Link>
            </Button>
          </div>
          <p className="creator-disclaimer-note">
            * Temsili mağaza ve örnek satış verileri
          </p>
        </div>
      </section>

      {/* ═══ BENTO REVENUE WAYS SECTION ═══ */}
      <section className="sell-section" id="neler-satabilirsin">
        <div className="section-heading">
          <span className="eyebrow">BİLGİNİ PAYLAŞ. DEĞERİNİ KAZAN.</span>
          <h2>
            Tek mağaza.
            <br />
            <span>Birden fazla kazanç yolu.</span>
          </h2>
          <p>
            İster bir saatini, ister aylarca biriktirdiğin bilgiyi sat.
            <br />
            Kartlara tıklayarak detayları keşfet.
          </p>
        </div>
        <div className="bento-grid">
          {/* Card 1: Sessions */}
          <article
            className="bento bento-session cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            onClick={() => setActiveBento(bentoDetails.session)}
          >
            <div className="bento-top">
              <span className="bento-icon">
                <Calendar />
              </span>
              <span className="category-label">ZAMANINI DEĞERE DÖNÜŞTÜR</span>
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#5500FF] hover:text-white flex items-center justify-center transition-colors ml-auto"
                aria-label="Detayları gör"
              >
                <ArrowUpRight size={15} />
              </button>
            </div>
            <h3>
              Birebir seanslar.
              <br />
              Gerçek bir etki.
            </h3>
            <p>
              Koçluk, danışmanlık veya özel ders.
              <br />
              Uzmanlığını, sana ihtiyaç duyanlarla buluştur.
            </p>
            <div className="session-visual">
              <div className="booking-header">
                <span>Birlikte bir adım ileri.</span>
                <span className="live-tag">
                  <span /> Online
                </span>
              </div>
              <div className="booking-days">
                {[
                  ["PZT", "12"],
                  ["SAL", "13"],
                  ["ÇAR", "14"],
                  ["PER", "15"],
                  ["CUM", "16"],
                ].map(([d, n], i) => (
                  <div className={i === 2 ? "selected" : ""} key={d}>
                    <small>{d}</small>
                    <b>{n}</b>
                  </div>
                ))}
              </div>
              <div className="booking-times">
                <span>10:00</span>
                <span className="selected">
                  14:30 <Check size={12} />
                </span>
                <span>16:00</span>
              </div>
              <div className="booking-footer">
                <span>
                  <Calendar size={13} /> 45 dk · Birebir strateji görüşmesi
                </span>
                <strong>₺1.500</strong>
              </div>
            </div>
            <div className="bento-tags">
              <span>Danışmanlık</span>
              <span>Koçluk</span>
              <span>Özel ders</span>
              <span>Terapi</span>
            </div>
          </article>

          {/* Card 2: Digital Products */}
          <article
            className="bento bento-digital cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            onClick={() => setActiveBento(bentoDetails.digital)}
          >
            <div className="bento-top">
              <span className="bento-icon">
                <Download />
              </span>
              <span className="category-label">BİR KERE ÜRET. TEKRAR TEKRAR SAT.</span>
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#5500FF] hover:text-white flex items-center justify-center transition-colors ml-auto"
                aria-label="Detayları gör"
              >
                <ArrowUpRight size={15} />
              </button>
            </div>
            <h3>
              Dijital ürünler
              <br />& şablonlar.
            </h3>
            <p>
              Tasarımlarını, dosyalarını ve hazır çözümlerini
              <br />
              indirmeye hazır ürünlere dönüştür.
            </p>
            <div className="template-visual">
              <div className="template-page">
                <small>THE CREATOR KIT / 01</small>
                <strong>
                  Plan less.
                  <br />
                  Create more.
                </strong>
                <span>İÇERİK PLANLAMA KİTİ</span>
                <div className="template-grid">
                  {Array.from({ length: 6 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
              </div>
              <div className="download-note">
                <Download size={17} />
                <div>
                  <b>Bir sonraki büyük fikrin.</b>
                  <small>Hemen indir · ₺290</small>
                </div>
              </div>
            </div>
            <div className="bento-tags">
              <span>Tasarım şablonları</span>
              <span>Notion kitleri</span>
              <span>Dijital dosyalar</span>
            </div>
          </article>

          {/* Card 3: E-Books */}
          <article
            className="bento bento-book cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            onClick={() => setActiveBento(bentoDetails.book)}
          >
            <div className="bento-top">
              <span className="bento-icon">
                <BookOpen />
              </span>
              <span className="category-label">BİLGİN, BİRİNİN YOL HARİTASI.</span>
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#5500FF] hover:text-white flex items-center justify-center transition-colors ml-auto"
                aria-label="Detayları gör"
              >
                <ArrowUpRight size={15} />
              </button>
            </div>
            <h3>E-kitaplar & rehberler.</h3>
            <p>
              Bildiğin her şey, birinin öğrenmek istediği şey.
              <br />
              Deneyimini sayfalara taşı, gelirini büyüt.
            </p>
            <div className="book-visual">
              <div className="book-cover">
                <small>DENİZ YILMAZ</small>
                <strong>
                  Fikirden
                  <br />
                  ilk satışa.
                </strong>
                <ArrowUpRight size={42} />
                <span>YARATICININ YOL HARİTASI</span>
              </div>
              <div className="book-description">
                <span>PDF REHBER</span>
                <b>
                  Deneyiminden
                  <br />
                  doğan bir ürün.
                </b>
                <small>48 sayfa, sınırsız ilham.</small>
                <strong>
                  ₺190 <ArrowUpRight size={15} />
                </strong>
              </div>
            </div>
            <div className="bento-tags">
              <span>PDF Rehber</span>
              <span>E-Kitap</span>
              <span>Kontrol listeleri</span>
            </div>
          </article>

          {/* Card 4: Community & Courses */}
          <article
            className="bento bento-community cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            onClick={() => setActiveBento(bentoDetails.community)}
          >
            <div className="bento-top">
              <span className="bento-icon">
                <Users />
              </span>
              <span className="category-label">BİRLİKTE DAHA FAZLASI.</span>
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#5500FF] hover:text-white flex items-center justify-center transition-colors ml-auto"
                aria-label="Detayları gör"
              >
                <ArrowUpRight size={15} />
              </button>
            </div>
            <h3>Topluluklar & mini kurslar.</h3>
            <p>
              Seninle aynı tutkuyu paylaşan insanları bir araya getir.
              <br />
              Bilgini bir deneyime dönüştür.
            </p>
            <div className="community-visual">
              <div className="community-people">
                {["D", "A", "E", "S", "M"].map((x) => (
                  <span key={x}>{x}</span>
                ))}
                <span>+24</span>
              </div>
              <div className="course-row">
                <span>
                  <Check size={15} />
                </span>
                <b>01 — Fikrini bul</b>
                <small>12 dk</small>
              </div>
              <div className="course-row">
                <span>02</span>
                <b>İlk adımını at</b>
                <small>18 dk</small>
              </div>
              <div className="course-row">
                <span>03</span>
                <b>Birlikte büyütelim</b>
                <small>24 dk</small>
              </div>
            </div>
            <div className="bento-tags">
              <span>Topluluk erişimi</span>
              <span>Video kurs</span>
              <span>Bülten</span>
            </div>
          </article>
        </div>
        <div className="sell-bottom">
          <span>Ne üretiyorsan, onun için bir Sety var.</span>
          <Button onClick={() => openModal("signup")}>
            Kendi mağazanı oluştur <ArrowUpRight />
          </Button>
        </div>
      </section>

      {/* ═══ STRIPE-STYLE BENTO INFO MODAL ═══ */}
      <Dialog open={!!activeBento} onOpenChange={(open) => !open && setActiveBento(null)}>
        {activeBento && (
          <DialogContent className="max-w-[500px] w-[calc(100vw-32px)] p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden font-sans">
            <DialogHeader className="text-left space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#5500FF]">
                {activeBento.badge}
              </span>
              <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {activeBento.title}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-600 font-medium">
                {activeBento.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Neler Satabilirsin?
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {activeBento.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2"
                    >
                      <Check size={14} className="text-[#5500FF] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Nasıl Çalışır?
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {activeBento.howItWorks.map((step, idx) => (
                    <li key={step} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-[#5500FF] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100/80 text-xs text-purple-900 font-medium">
                💡 <b>Örnek:</b> {activeBento.example}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setActiveBento(null)}
                className="rounded-full text-xs"
              >
                Kapat
              </Button>
              <Button
                onClick={() => {
                  setActiveBento(null);
                  openModal("signup");
                }}
                className="rounded-full bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold text-xs shadow-md"
              >
                Bu Alanda Mağaza Aç <ArrowUpRight size={14} className="ml-1" />
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ═══ 3 STEPS SECTION ═══ */}
      <section className="steps-section">
        <div className="steps-intro">
          <span className="eyebrow">FİKİRDEN İLK SATIŞA</span>
          <h2>
            Bir kahve molasında
            <br />
            <span>mağazan yayında.</span>
          </h2>
          <p>
            Teknik detayları değil,
            <br />
            bir sonraki büyük fikrini düşün.
          </p>
          <Button variant="link" onClick={() => openModal("signup")}>
            Hadi başlayalım <ArrowRight />
          </Button>
        </div>
        <div className="steps-list">
          {[
            {
              n: "01",
              icon: Palette,
              title: "Kendin gibi bir mağaza oluştur.",
              text: "Adını seç, profilini ekle. Renklerinle, tarzınla tamamen sana ait bir vitrin.",
            },
            {
              n: "02",
              icon: Plus,
              title: "İlk ürününe bir yer aç.",
              text: "Seans, e-kitap ya da şablon. Ürününü ekle, fiyatını belirle, satışa hazır ol.",
            },
            {
              n: "03",
              icon: MousePointer2,
              title: "Linkini paylaş. Kazanmaya başla.",
              text: "Biyografine tek link koy. Takipçilerin keşfetsin, ürünlerin değerini bulsun.",
            },
          ].map((x) => (
            <div className="step" key={x.n}>
              <span className="step-number">{x.n}</span>
              <div>
                <x.icon size={19} />
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA SECTION ═══ */}
      <section className="final-cta">
        <span className="eyebrow !text-[#C4FF00] inline-flex items-center gap-1.5 justify-center">
          <Zap size={14} className="fill-[#C4FF00] text-[#C4FF00]" /> LANSMANA ÖZEL
        </span>
        <h2 className="!text-white">
          İlk satışına giden yol,
          <br />
          <span className="!text-[#C4FF00]">bugün başlasın.</span>
        </h2>
        <p className="!text-white/80">
          Aylık ücret yok. Kurulum ücreti yok.
          <br />
          Lansman döneminde sadece üret, paylaş, sat.
        </p>
        <Button
          className="main-cta bg-[#C4FF00] hover:bg-[#b2ee00] text-slate-950 font-black shadow-lg"
          onClick={() => openModal("signup")}
        >
          <span>Şimdi ücretsiz mağazanı aç</span>
          <ArrowUpRight />
        </Button>
        <div className="hero-checks">
          <span>
            <Check /> Kredi kartı gerekmez
          </span>
          <span>
            <Check /> Kontrol tamamen sende
          </span>
          <span>
            <Check /> %0 komisyon
          </span>
        </div>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <section className="faq-section">
        <div>
          <span className="eyebrow">AKLINDA KALMASIN.</span>
          <h2>
            Güzel sorular.
            <br />
            <span>Net cevaplar.</span>
          </h2>
          <p>
            Yeni bir başlangıç için
            <br />
            bilmek isteyeceklerin.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map(([q, a], i) => (
            <div className="faq-item" key={q}>
              <Button
                variant="ghost"
                aria-expanded={faq === i}
                onClick={() => setFaq(faq === i ? null : i)}
              >
                {q}
                <Plus className={faq === i ? "rotate-45" : ""} />
              </Button>
              {faq === i && <p>{a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ EXPANDED FOOTER WITH SOCIALS ═══ */}
      <footer className="footer pb-32">
        <div className="max-w-[1140px] mx-auto px-6 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-slate-200/80 pb-12">
            {/* Col 1: Brand & Socials */}
            <div className="space-y-4">
              <SetyLogo />
              <p className="text-xs text-slate-600 leading-relaxed max-w-[260px]">
                Takipçilerini müşteriye dönüştürmenin en kolay yolu. Seanslarını ve dijital ürünlerini tek linkten sat.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <a
                  href="https://instagram.com/sety.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-[#5500FF] hover:border-[#5500FF]/40 shadow-xs transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/setystore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-black hover:border-black/40 shadow-xs transition-all"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/company/setystore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-[#0A66C2] hover:border-[#0A66C2]/40 shadow-xs transition-all"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.762-2.239-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Ürün & Keşfet */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Ürün & Keşfet
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <a href="#nasil-calisir" className="hover:text-[#5500FF] transition-colors">
                    Nasıl Çalışır?
                  </a>
                </li>
                <li>
                  <a href="#neler-satabilirsin" className="hover:text-[#5500FF] transition-colors">
                    Neler Satabilirsin?
                  </a>
                </li>
                <li>
                  <Link href="/denizyilmaz" className="hover:text-[#5500FF] transition-colors inline-flex items-center gap-1">
                    Örnek Vitrin (Deniz Yılmaz) <ArrowUpRight size={11} />
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-[#5500FF] transition-colors inline-flex items-center gap-1">
                    Canlı Panel Önizleme <ArrowUpRight size={11} />
                  </Link>
                </li>
                <li>
                  <button type="button" onClick={() => openModal("login")} className="hover:text-[#5500FF] transition-colors">
                    Giriş Yap
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Çözümler */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Kazanç Yolları
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveBento(bentoDetails.session)}
                    className="hover:text-[#5500FF] transition-colors text-left"
                  >
                    Birebir Seans & Danışmanlık
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveBento(bentoDetails.digital)}
                    className="hover:text-[#5500FF] transition-colors text-left"
                  >
                    Dijital Ürünler & Şablonlar
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveBento(bentoDetails.book)}
                    className="hover:text-[#5500FF] transition-colors text-left"
                  >
                    E-Kitaplar & Rehberler
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveBento(bentoDetails.community)}
                    className="hover:text-[#5500FF] transition-colors text-left"
                  >
                    Topluluklar & Mini Kurslar
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Kurumsal & Güvenlik */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Güvenlik & Yasal
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link href="/privacy" className="hover:text-[#5500FF] transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#5500FF] transition-colors">
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="hover:text-[#5500FF] transition-colors">
                    İade Koşulları
                  </Link>
                </li>
                <li className="pt-1 text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  Shopier & SSL Korumalı
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span>© 2026 Sety. Tüm hakları saklıdır.</span>
            <span>Üreten herkes için, özenle tasarlandı.</span>
            <span className="font-semibold text-slate-700">Türkiye’den, dünyaya 🚀</span>
          </div>
        </div>
      </footer>

      <StickyCTA />
    </div>
  );
}
