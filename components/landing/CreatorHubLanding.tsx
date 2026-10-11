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
  Mail,
  Loader2,
  CheckCircle2,
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
import { useTranslation } from "@/lib/i18n/context";
import { supabase } from "@/lib/supabase/client";
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

const bentoDetailsTR: Record<string, BentoDetail> = {
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
    example: "Örnek: Danışman Deniz Yılmaz — Ayda 25+ seans randevusu.",
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

const bentoDetailsEN: Record<string, BentoDetail> = {
  session: {
    id: "session",
    badge: "MONETIZE YOUR TIME",
    title: "1:1 Coaching & Consultations",
    subtitle: "Sell your expertise and time from a single bio link.",
    description:
      "Stop the endless back-and-forth messaging on Instagram DMs or WhatsApp. Let clients pick a date and book calls automatically with calendar integration.",
    items: [
      "1:1 Coaching & Mentorship sessions",
      "Career, business & design portfolio reviews",
      "Tutoring & language practice calls",
      "Strategy sessions & discovery consultations",
      "Group workshops & mastermind calls",
    ],
    howItWorks: [
      "Set your available hours and time slots.",
      "Clients book and pay with 1 click.",
      "Google Meet / Zoom link is created and sent automatically.",
    ],
    example: "Example: Alex Morgan — 25+ coaching calls booked monthly.",
  },
  digital: {
    id: "digital",
    badge: "CREATE ONCE. SELL FOREVER.",
    title: "Digital Products & Templates",
    subtitle: "Turn your creative files into instant downloads.",
    description:
      "Deliver files securely with automatic download links instead of sending manual emails. Enjoy hands-free passive income.",
    items: [
      "Notion & Canva templates and planners",
      "Figma UI kits, icon sets & design systems",
      "Lightroom presets & video LUTs",
      "Financial spreadsheets & budget planners",
      "Code snippets, developer starters & prompts",
    ],
    howItWorks: [
      "Upload your file or enter a download URL.",
      "Buyer receives instant download access immediately upon checkout.",
      "Licensed file is also emailed to the buyer.",
    ],
    example: "Example: Creator Deniz — $4,000+ sold in Notion kits.",
  },
  book: {
    id: "book",
    badge: "YOUR KNOWLEDGE, A ROADMAP FOR OTHERS.",
    title: "E-Books & PDF Guides",
    subtitle: "Package your hard-earned experience into pages.",
    description:
      "Your industry insights can guide thousands of others. Educate your audience and build authority with digital guides.",
    items: [
      "Industry playbooks and deep-dive case studies",
      "Step-by-step how-to roadmaps",
      "Health, fitness & recipe e-books",
      "Actionable checklists and worksheets",
      "AI prompt playbooks and workflow recipes",
    ],
    howItWorks: [
      "Upload your PDF guide in 1 click.",
      "Set your price and add a cover image.",
      "Followers read and download instantly across mobile and desktop.",
    ],
    example: "Example: 'From 0 to First Dollar' 48-page PDF guide.",
  },
  community: {
    id: "community",
    badge: "STRONGER TOGETHER.",
    title: "Communities & Newsletters",
    subtitle: "Build a loyal recurring audience.",
    description:
      "Move beyond one-off sales. Create monthly memberships, paid newsletters, or exclusive mastermind groups.",
    items: [
      "Private Telegram and Discord community access",
      "Weekly paid email newsletters",
      "Bite-sized video mini-courses",
      "Monthly member Q&A and networking calls",
      "Accountability circles and masterminds",
    ],
    howItWorks: [
      "Provide your community or course link.",
      "Subscribers gain automatic access upon signup.",
      "Track monthly recurring revenue in one central dashboard.",
    ],
    example: "Example: 100+ member 'Creative Founders Club'.",
  },
};

const faqsTR = [
  [
    "Sety ile neler satabilirim?",
    "Birebir danışmanlık seanslarını, e-kitaplarını, şablonlarını, dijital dosyalarını ve mini kurslarını tek bir mağazada sunabilirsin.",
  ],
  [
    "Mağazamı açmak için teknik bilgi gerekiyor mu?",
    "Hayır. Mağaza adını belirle, profilini kişiselleştir ve ürünlerini ekle. Kod yazmadan 2 dakikada dijital vitrinini oluşturabilirsin.",
  ],
  [
    "Ödemelerimi nasıl alırım?",
    "Ödeme altyapını mağazana bağlayarak tahsilatını doğrudan kendi banka veya ödeme hesabından yönetebilirsin.",
  ],
  [
    "Lansman döneminde komisyon ödeyecek miyim?",
    "Lansmana özel mağaza açılışı tamamen ücretsizdir (%0 komisyon). Kredi kartı gerekmeden anında başlayabilirsin.",
  ],
  [
    "Seanslar ve dijital ürünler birlikte satılabilir mi?",
    "Evet. Takipçilerin aynı vitrinde seanslarını inceleyebilir, dijital ürünlerini keşfedebilir ve doğrudan satın alabilir.",
  ],
];

const faqsEN = [
  [
    "How do I receive payments?",
    "Payments are deposited directly to your bank account via our secure payment partners (Stripe, Polar). Fast, secure, and fully automated.",
  ],
  [
    "Does Sety take a commission?",
    "During our launch period, Sety takes 0% commission. You keep 100% of your earnings, only paying standard payment processing fees.",
  ],
  [
    "Is it hard to connect my payment provider?",
    "Not at all. You can connect your payment account in under 60 seconds with zero coding or technical setup required.",
  ],
  [
    "How do refunds work?",
    "You have full control over refund requests and order management directly from your intuitive creator dashboard.",
  ],
  [
    "Do I need technical knowledge?",
    "No technical skills needed. Customize your storefront, upload your products or calendar, and start selling in 2 minutes.",
  ],
];

export function CreatorHubLanding() {
  const { openModal } = useAuthModal();
  const { lang } = useTranslation();
  const isEn = lang === 'en';

  const [faq, setFaq] = useState<number | null>(null);
  const [activeBento, setActiveBento] = useState<BentoDetail | null>(null);

  // Waitlist form state
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistError, setWaitlistError] = useState("");

  const bentoDetails = isEn ? bentoDetailsEN : bentoDetailsTR;
  const faqs = isEn ? faqsEN : faqsTR;

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

  // Polar checkout handler with Supabase session check
  const handlePolarCheckout = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = "https://polar.sh/sety/checkout";
      } else {
        openModal("signup");
      }
    } catch {
      openModal("signup");
    }
  };

  // Waitlist submit handler
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes("@")) return;

    setWaitlistLoading(true);
    setWaitlistError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: waitlistEmail, source: "landing_footer" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWaitlistSuccess(true);
        setWaitlistEmail("");
      } else {
        setWaitlistError(data.error || "An error occurred. Please try again.");
      }
    } catch {
      setWaitlistError("Connection error. Please try again.");
    } finally {
      setWaitlistLoading(false);
    }
  };

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
            <span /> {isEn ? "LAUNCH SPECIAL · 47 SPOTS REMAINING" : "LANSMANA ÖZEL · 47 KONTENJAN KALDI"}{" "}
            <ArrowUpRight size={13} />
          </button>
          <h1>
            {isEn ? (
              <>
                The simplest way to turn
                <br className="desktop-break" /> your followers into
                <br />
                <span>customers.</span>
              </>
            ) : (
              <>
                Takipçilerini müşteriye
                <br className="desktop-break" /> dönüştürmenin
                <br />
                <span>en kolay yolu.</span>
              </>
            )}
          </h1>
          <p>
            {isEn ? (
              <>
                Put one link in your bio. Sell coaching, digital products, and guides.
                <br className="desktop-break" /> You create — Sety handles the rest.
                <br />
                <strong>You create. Start earning with Sety.</strong>
              </>
            ) : (
              <>
                Bildiğin, ürettiğin, ilham verdiğin her şeyin bir değeri var.
                <br className="desktop-break" /> Seanslarını ve dijital ürünlerini tek bir linkten sat.
                <br />
                <strong>Sen üret. Sety ile kazanmaya başla.</strong>
              </>
            )}
          </p>
          <Button
            className="main-cta hero-main-cta bg-[#5500FF] hover:bg-[#4400cc] !text-white font-black shadow-xl"
            onClick={() => openModal("signup")}
          >
            <span>{isEn ? "Get your free store" : "Ücretsiz mağazanı aç"}</span>
            <ArrowUpRight />
          </Button>
          <div className="hero-checks">
            <span>
              <Check /> {isEn ? "2-minute setup" : "2 dakikada kurulum"}
            </span>
            <span>
              <Check /> {isEn ? "No credit card required" : "Kredi kartı gerekmez"}
            </span>
            <span>
              <Check /> {isEn ? "Free during launch" : "Lansmana özel ücretsiz"}
            </span>
          </div>
        </div>
        <a href={isEn ? "#how-it-works" : "#nasil-calisir"} className="hero-scroll">
          {isEn ? "DISCOVER MORE" : "DAHA FAZLASINI KEŞFET"} <ChevronDown size={15} />
        </a>
      </section>

      {/* ═══ CREATOR SHOWCASE SECTION ═══ */}
      <section className="creator-section" id={isEn ? "how-it-works" : "nasil-calisir"}>
        <div className="section-heading">
          <span className="eyebrow">
            {isEn ? "A STORE THAT REPRESENTS YOU" : "SENİ YANSITAN BİR MAĞAZA"}
          </span>
          <h2>
            {isEn ? (
              <>
                Your bio link.
                <br />
                <span>Tailored to your work.</span>
              </>
            ) : (
              <>
                Biyografindeki link.
                <br />
                <span>Senin tarzında.</span>
              </>
            )}
          </h2>
          <p>
            {isEn ? (
              <>
                Custom branding, smooth checkout, and seamless bookings.
                <br />
                Designed specifically for modern digital creators.
              </>
            ) : (
              <>
                Markana uygun renkler, pürüzsüz ödeme ve otomatik randevu.
                <br />
                Yeni nesil üreticiler için tasarlandı.
              </>
            )}
          </p>
        </div>
        <CreatorPreview />
        <div className="creator-bottom-wrapper">
          <div className="creator-bottom">
            <span>
              <ShieldCheck size={18} />{" "}
              {isEn
                ? "Your store, completely owned by you."
                : "Sana ait bir mağaza, baştan sona."}
            </span>
            <Button variant="link" asChild>
              <Link href="/denizyilmaz">
                {isEn ? "Explore demo store" : "Örnek mağazayı incele"}{" "}
                <ArrowUpRight size={16} />
              </Link>
            </Button>
          </div>
          <p className="creator-disclaimer-note">
            {isEn
              ? "* Demo store and representative data"
              : "* Temsili mağaza ve örnek satış verileri"}
          </p>
        </div>
      </section>

      {/* ═══ BENTO REVENUE WAYS SECTION ═══ */}
      <section className="sell-section" id={isEn ? "what-to-sell" : "neler-satabilirsin"}>
        <div className="section-heading">
          <span className="eyebrow">
            {isEn ? "MONETIZE YOUR EXPERTISE" : "BİLGİNİ PAYLAŞ. DEĞERİNİ KAZAN."}
          </span>
          <h2>
            {isEn ? (
              <>
                You focus on creating.
                <br />
                <span>We handle everything else.</span>
              </>
            ) : (
              <>
                Tek mağaza.
                <br />
                <span>Birden fazla kazanç yolu.</span>
              </>
            )}
          </h2>
          <p>
            {isEn ? (
              <>
                Sell your time, your digital files, or your knowledge from a single link.
                <br />
                Click on any card below to explore how it works.
              </>
            ) : (
              <>
                İster bir saatini, ister aylarca biriktirdiğin bilgiyi sat.
                <br />
                Kartlara tıklayarak detayları keşfet.
              </>
            )}
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
              <span className="category-label">
                {isEn ? "TURN YOUR TIME INTO VALUE" : "ZAMANINI DEĞERE DÖNÜŞTÜR"}
              </span>
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#5500FF] hover:text-white flex items-center justify-center transition-colors ml-auto"
                aria-label="View details"
              >
                <ArrowUpRight size={15} />
              </button>
            </div>
            <h3>
              {isEn ? (
                <>
                  1:1 Coaching &<br />
                  Consultations.
                </>
              ) : (
                <>
                  Birebir seanslar.
                  <br />
                  Gerçek bir etki.
                </>
              )}
            </h3>
            <p>
              {isEn ? (
                <>
                  Mentoring, consulting, or tutoring.
                  <br />
                  Meet clients seamlessly with auto-booking.
                </>
              ) : (
                <>
                  Koçluk, danışmanlık veya özel ders.
                  <br />
                  Uzmanlığını, sana ihtiyaç duyanlarla buluştur.
                </>
              )}
            </p>
            <div className="session-visual">
              <div className="booking-header">
                <span>{isEn ? "Take a step forward." : "Birlikte bir adım ileri."}</span>
                <span className="live-tag">
                  <span /> Online
                </span>
              </div>
              <div className="booking-days">
                {[
                  [isEn ? "MON" : "PZT", "12"],
                  [isEn ? "TUE" : "SAL", "13"],
                  [isEn ? "WED" : "ÇAR", "14"],
                  [isEn ? "THU" : "PER", "15"],
                  [isEn ? "FRI" : "CUM", "16"],
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
                  <Calendar size={13} /> {isEn ? "45 min · Strategy Call" : "45 dk · Birebir strateji görüşmesi"}
                </span>
                <strong>{isEn ? "$75" : "₺1.500"}</strong>
              </div>
            </div>
            <div className="bento-tags">
              <span>{isEn ? "Coaching" : "Danışmanlık"}</span>
              <span>{isEn ? "Mentorship" : "Koçluk"}</span>
              <span>{isEn ? "Tutoring" : "Özel ders"}</span>
              <span>{isEn ? "Strategy" : "Terapi"}</span>
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
              <span className="category-label">
                {isEn ? "CREATE ONCE. SELL FOREVER." : "BİR KERE ÜRET. TEKRAR TEKRAR SAT."}
              </span>
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#5500FF] hover:text-white flex items-center justify-center transition-colors ml-auto"
                aria-label="View details"
              >
                <ArrowUpRight size={15} />
              </button>
            </div>
            <h3>
              {isEn ? (
                <>
                  Digital products
                  <br />& templates.
                </>
              ) : (
                <>
                  Dijital ürünler
                  <br />& şablonlar.
                </>
              )}
            </h3>
            <p>
              {isEn ? (
                <>
                  Notion templates, Canva graphics, and tools
                  <br />
                  delivered instantly upon checkout.
                </>
              ) : (
                <>
                  Tasarımlarını, dosyalarını ve hazır çözümlerini
                  <br />
                  indirmeye hazır ürünlere dönüştür.
                </>
              )}
            </p>
            <div className="template-visual">
              <div className="template-page">
                <small>THE CREATOR KIT / 01</small>
                <strong>
                  Plan less.
                  <br />
                  Create more.
                </strong>
                <span>{isEn ? "CONTENT PLANNING KIT" : "İÇERİK PLANLAMA KİTİ"}</span>
                <div className="template-grid">
                  {Array.from({ length: 6 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
              </div>
              <div className="template-side">
                <div>
                  <small>{isEn ? "FILE FORMAT" : "DOSYA FORMATI"}</small>
                  <b>Notion / PDF</b>
                </div>
                <div>
                  <small>{isEn ? "PRICE" : "FİYAT"}</small>
                  <b>{isEn ? "$19" : "₺290"}</b>
                </div>
                <div>
                  <small>{isEn ? "DELIVERY" : "TESLİMAT"}</small>
                  <b>{isEn ? "Instant Download" : "Anında İndirme"}</b>
                </div>
              </div>
            </div>
            <div className="bento-tags">
              <span>Notion</span>
              <span>Canva</span>
              <span>Presets</span>
              <span>Figma</span>
            </div>
          </article>

          {/* Card 3: E-Books & Guides */}
          <article
            className="bento bento-book cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            onClick={() => setActiveBento(bentoDetails.book)}
          >
            <div className="bento-top">
              <span className="bento-icon">
                <BookOpen />
              </span>
              <span className="category-label">
                {isEn ? "YOUR KNOWLEDGE, A ROADMAP." : "BİLGİN, BİRİNİN YOL HARİTASI."}
              </span>
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#5500FF] hover:text-white flex items-center justify-center transition-colors ml-auto"
                aria-label="View details"
              >
                <ArrowUpRight size={15} />
              </button>
            </div>
            <h3>
              {isEn ? (
                <>
                  E-Books &<br />
                  PDF guides.
                </>
              ) : (
                <>
                  E-Kitaplar &<br />
                  rehberler.
                </>
              )}
            </h3>
            <p>
              {isEn ? (
                <>
                  Package your experience into high-value playbooks.
                  <br />
                  Educate your followers and earn passively.
                </>
              ) : (
                <>
                  Yılların deneyimini sayfalara dök.
                  <br />
                  Rehberlerinle kitlene ilham ol.
                </>
              )}
            </p>
            <div className="book-visual">
              <div className="book-cover">
                <small>GUIDE / 2026</small>
                <strong>
                  {isEn ? (
                    <>
                      0 TO FIRST
                      <br />
                      DOLLAR
                    </>
                  ) : (
                    <>
                      FİKİRDEN
                      <br />
                      İLK SATIŞA
                    </>
                  )}
                </strong>
                <span>{isEn ? "Creator Roadmap" : "Yaratıcının El Kitabı"}</span>
              </div>
              <div className="book-details">
                <div>
                  <small>{isEn ? "LENGTH" : "SAYFA SAYISI"}</small>
                  <b>48 {isEn ? "Pages" : "Sayfa"}</b>
                </div>
                <div>
                  <small>{isEn ? "PRICE" : "FİYAT"}</small>
                  <b>{isEn ? "$12" : "₺190"}</b>
                </div>
                <div>
                  <small>{isEn ? "COMPATIBLE" : "UYUMLULUK"}</small>
                  <b>iOS / Android / PC</b>
                </div>
              </div>
            </div>
            <div className="bento-tags">
              <span>PDF</span>
              <span>{isEn ? "E-Book" : "E-Kitap"}</span>
              <span>{isEn ? "Playbook" : "Rehber"}</span>
            </div>
          </article>

          {/* Card 4: Communities */}
          <article
            className="bento bento-community cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            onClick={() => setActiveBento(bentoDetails.community)}
          >
            <div className="bento-top">
              <span className="bento-icon">
                <Users />
              </span>
              <span className="category-label">
                {isEn ? "STRONGER TOGETHER." : "BİRLİKTE DAHA FAZLASI."}
              </span>
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#5500FF] hover:text-white flex items-center justify-center transition-colors ml-auto"
                aria-label="View details"
              >
                <ArrowUpRight size={15} />
              </button>
            </div>
            <h3>
              {isEn ? (
                <>
                  Communities &<br />
                  memberships.
                </>
              ) : (
                <>
                  Topluluklar &<br />
                  mini kurslar.
                </>
              )}
            </h3>
            <p>
              {isEn ? (
                <>
                  Build recurring income through Telegram groups,
                  <br />
                  Discord channels, and private newsletters.
                </>
              ) : (
                <>
                  Tek seferlik satışın ötesine geç.
                  <br />
                  Abonelik ve özel erişimle kitle büyüt.
                </>
              )}
            </p>
            <div className="community-visual">
              <div className="community-card-inner">
                <div className="community-header">
                  <span>{isEn ? "CREATOR MASTERMIND" : "YARATICILAR TOPLULUĞU"}</span>
                  <span className="member-count">100+ {isEn ? "Members" : "Üye"}</span>
                </div>
                <div className="community-members">
                  {["A", "B", "C", "D", "E"].map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                  <span className="more">+95</span>
                </div>
                <div className="community-footer">
                  <div>
                    <small>{isEn ? "PLATFORM" : "KANAL"}</small>
                    <b>Discord / Telegram</b>
                  </div>
                  <div>
                    <small>{isEn ? "PRICE" : "FİYAT"}</small>
                    <b>{isEn ? "$9/mo" : "₺99/ay"}</b>
                  </div>
                </div>
              </div>
            </div>
            <div className="bento-tags">
              <span>{isEn ? "Memberships" : "Topluluk erişimi"}</span>
              <span>{isEn ? "Video courses" : "Video kurs"}</span>
              <span>{isEn ? "Newsletters" : "Bülten"}</span>
            </div>
          </article>
        </div>
        <div className="sell-bottom">
          <span>
            {isEn
              ? "Whatever you create, there is a home for it on Sety."
              : "Ne üretiyorsan, onun için bir Sety var."}
          </span>
          <Button onClick={() => openModal("signup")}>
            {isEn ? "Create your store" : "Kendi mağazanı oluştur"}{" "}
            <ArrowUpRight />
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
                  {isEn ? "What You Can Sell" : "Neler Satabilirsin?"}
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
                  {isEn ? "How It Works" : "Nasıl Çalışır?"}
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
                💡 <b>{isEn ? "Example:" : "Örnek:"}</b> {activeBento.example}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setActiveBento(null)}
                className="rounded-full text-xs"
              >
                {isEn ? "Close" : "Kapat"}
              </Button>
              <Button
                onClick={() => {
                  setActiveBento(null);
                  openModal("signup");
                }}
                className="rounded-full bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold text-xs shadow-md"
              >
                {isEn ? "Start Selling in This Niche" : "Bu Alanda Mağaza Aç"}{" "}
                <ArrowUpRight size={14} className="ml-1" />
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ═══ 3 STEPS SECTION ═══ */}
      <section className="steps-section">
        <div className="steps-intro">
          <span className="eyebrow">
            {isEn ? "FROM IDEA TO FIRST DOLLAR" : "FİKİRDEN İLK SATIŞA"}
          </span>
          <h2>
            {isEn ? (
              <>
                Live in minutes,
                <br />
                <span>while having coffee.</span>
              </>
            ) : (
              <>
                Bir kahve molasında
                <br />
                <span>mağazan yayında.</span>
              </>
            )}
          </h2>
          <p>
            {isEn ? (
              <>
                Forget technical headaches.
                <br />
                Focus on what you love creating.
              </>
            ) : (
              <>
                Teknik detayları değil,
                <br />
                bir sonraki büyük fikrini düşün.
              </>
            )}
          </p>
          <Button variant="link" onClick={() => openModal("signup")}>
            {isEn ? "Get started" : "Hadi başlayalım"} <ArrowRight />
          </Button>
        </div>
        <div className="steps-list">
          {[
            {
              n: "01",
              icon: Palette,
              title: isEn ? "Set up your store." : "Kendin gibi bir mağaza oluştur.",
              text: isEn
                ? "Add your digital products and go live instantly with your unique bio link."
                : "Adını seç, profilini ekle. Renklerinle, tarzınla tamamen sana ait bir vitrin.",
            },
            {
              n: "02",
              icon: Plus,
              title: isEn ? "Share your link." : "İlk ürününe bir yer aç.",
              text: isEn
                ? "Add your Sety link to your bio on Instagram, TikTok, or X and start selling immediately."
                : "Seans, e-kitap ya da şablon. Ürününü ekle, fiyatını belirle, satışa hazır ol.",
            },
            {
              n: "03",
              icon: MousePointer2,
              title: isEn ? "Get paid." : "Linkini paylaş. Kazanmaya başla.",
              text: isEn
                ? "Sales are notified in real time. Payment goes directly to your account."
                : "Biyografine tek link koy. Takipçilerin keşfetsin, ürünlerin değerini bulsun.",
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

      {/* ═══ PRICING / FINAL CTA SECTION (Connected to Polar) ═══ */}
      <section className="final-cta">
        <span className="eyebrow !text-[#C4FF00] inline-flex items-center gap-1.5 justify-center">
          <Zap size={14} className="fill-[#C4FF00] text-[#C4FF00]" />{" "}
          {isEn ? "FREE DURING LAUNCH · ONLY 47 SPOTS LEFT" : "LANSMANA ÖZEL · 47 KONTENJAN KALDI"}
        </span>
        <h2 className="!text-white">
          {isEn ? (
            <>
              Free during launch.
              <br />
              <span className="!text-[#C4FF00]">Start selling today.</span>
            </>
          ) : (
            <>
              İlk satışına giden yol,
              <br />
              <span className="!text-[#C4FF00]">bugün başlasın.</span>
            </>
          )}
        </h2>
        <p className="!text-white/80">
          {isEn ? (
            <>
              No commission. No monthly fee. No setup cost.
              <br />
              Just open your store and monetize your audience.
            </>
          ) : (
            <>
              Aylık ücret yok. Kurulum ücreti yok.
              <br />
              Lansman döneminde sadece üret, paylaş, sat.
            </>
          )}
        </p>
        <Button
          className="main-cta bg-[#C4FF00] hover:bg-[#b2ee00] text-slate-950 font-black shadow-lg"
          onClick={handlePolarCheckout}
        >
          <span>
            {isEn ? "Get started — no credit card needed" : "Şimdi ücretsiz mağazanı aç"}
          </span>
          <ArrowUpRight />
        </Button>
        <div className="hero-checks">
          <span>
            <Check /> {isEn ? "2-minute setup" : "Kredi kartı gerekmez"}
          </span>
          <span>
            <Check /> {isEn ? "Unlimited products" : "Kontrol tamamen sende"}
          </span>
          <span>
            <Check /> {isEn ? "0% commission" : "%0 komisyon"}
          </span>
        </div>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <section className="faq-section">
        <div>
          <span className="eyebrow">
            {isEn ? "NO GUESSWORK." : "AKLINDA KALMASIN."}
          </span>
          <h2>
            {isEn ? (
              <>
                Common questions.
                <br />
                <span>Clear answers.</span>
              </>
            ) : (
              <>
                Güzel sorular.
                <br />
                <span>Net cevaplar.</span>
              </>
            )}
          </h2>
          <p>
            {isEn ? (
              <>
                Everything you need to know
                <br />
                before launching your store.
              </>
            ) : (
              <>
                Yeni bir başlangıç için
                <br />
                bilmek isteyeceklerin.
              </>
            )}
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

      {/* ═══ EXPANDED FOOTER WITH WAITLIST & SOCIALS ═══ */}
      <footer className="footer pb-32">
        <div className="max-w-[1140px] mx-auto px-6 pt-16 pb-12">
          {/* Waitlist / Newsletter Banner */}
          <div className="mb-14 p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C4FF00]">
                {isEn ? "STAY UPDATED" : "GÜNCEL KAL"}
              </span>
              <h3 className="text-xl md:text-2xl font-black tracking-tight">
                {isEn ? "Join the Sety Creator Circle" : "Sety Üretici Topluluğuna Katıl"}
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                {isEn
                  ? "Get early product drops, growth guides, and platform updates delivered to your inbox."
                  : "Yeni özellikler, büyüme rehberleri ve lansman duyuruları için e-postanı bırak."}
              </p>
            </div>

            <form onSubmit={handleWaitlistSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5">
              {waitlistSuccess ? (
                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 size={16} />
                  <span>{isEn ? "You're on the list! 🎉" : "Sıraya başarıyla eklendiniz! 🎉"}</span>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder={isEn ? "Enter your email" : "E-posta adresini yaz"}
                    className="px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-white placeholder:text-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5500FF] min-w-[240px]"
                  />
                  <Button
                    type="submit"
                    disabled={waitlistLoading}
                    className="rounded-full bg-[#5500FF] hover:bg-[#4400cc] text-white text-xs font-black px-5 py-2.5 shrink-0"
                  >
                    {waitlistLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>{isEn ? "Join Waitlist" : "Haberdar Ol"}</span>
                    )}
                  </Button>
                </>
              )}
              {waitlistError && (
                <p className="text-[11px] text-red-400 mt-1 sm:hidden">{waitlistError}</p>
              )}
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-slate-200/80 pb-12">
            {/* Col 1: Brand & Socials */}
            <div className="space-y-4">
              <SetyLogo />
              <p className="text-xs text-slate-600 leading-relaxed max-w-[260px]">
                {isEn
                  ? "The simplest way to turn your followers into customers. Sell 1:1 sessions and digital products from a single link in bio."
                  : "Takipçilerini müşteriye dönüştürmenin en kolay yolu. Seanslarını ve dijital ürünlerini tek linkten sat."}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <a
                  href="https://instagram.com/sety.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-[#5500FF] hover:border-[#5500FF]/40 shadow-2xs transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="mailto:hello@sety.store"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-[#5500FF] hover:border-[#5500FF]/40 shadow-2xs transition-all"
                  aria-label="Email"
                >
                  <Mail size={14} />
                </a>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isEn ? "Product" : "Ürün & Keşfet"}
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <a
                    href={isEn ? "#how-it-works" : "#nasil-calisir"}
                    className="hover:text-[#5500FF] transition-colors"
                  >
                    {isEn ? "How It Works" : "Nasıl Çalışır?"}
                  </a>
                </li>
                <li>
                  <a
                    href={isEn ? "#what-to-sell" : "#neler-satabilirsin"}
                    className="hover:text-[#5500FF] transition-colors"
                  >
                    {isEn ? "What You Can Sell" : "Neler Satabilirsin?"}
                  </a>
                </li>
                <li>
                  <Link
                    href="/denizyilmaz"
                    className="hover:text-[#5500FF] transition-colors inline-flex items-center gap-1"
                  >
                    {isEn ? "Demo Store (Deniz Yilmaz)" : "Örnek Vitrin (Deniz Yılmaz)"}{" "}
                    <ArrowUpRight size={11} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-[#5500FF] transition-colors inline-flex items-center gap-1"
                  >
                    {isEn ? "Live Dashboard Preview" : "Canlı Panel Önizleme"}{" "}
                    <ArrowUpRight size={11} />
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openModal("login")}
                    className="hover:text-[#5500FF] transition-colors"
                  >
                    {isEn ? "Log In" : "Giriş Yap"}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Categories */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isEn ? "Ways to Earn" : "Kazanç Yolları"}
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveBento(bentoDetails.session)}
                    className="hover:text-[#5500FF] transition-colors text-left"
                  >
                    {isEn ? "1:1 Coaching & Calls" : "Birebir Seans & Danışmanlık"}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveBento(bentoDetails.digital)}
                    className="hover:text-[#5500FF] transition-colors text-left"
                  >
                    {isEn ? "Digital Products & Kits" : "Dijital Ürünler & Şablonlar"}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveBento(bentoDetails.book)}
                    className="hover:text-[#5500FF] transition-colors text-left"
                  >
                    {isEn ? "E-Books & Frameworks" : "E-Kitaplar & Rehberler"}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveBento(bentoDetails.community)}
                    className="hover:text-[#5500FF] transition-colors text-left"
                  >
                    {isEn ? "Communities & Memberships" : "Topluluklar & Mini Kurslar"}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal & Security */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isEn ? "Legal & Trust" : "Güvenlik & Yasal"}
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link href="/privacy" className="hover:text-[#5500FF] transition-colors">
                    {isEn ? "Privacy Policy" : "Gizlilik Politikası"}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#5500FF] transition-colors">
                    {isEn ? "Terms of Service" : "Kullanım Şartları"}
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="hover:text-[#5500FF] transition-colors">
                    {isEn ? "Refund Policy" : "İade Koşulları"}
                  </Link>
                </li>
                <li className="pt-1 text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  <span>{isEn ? "Polar & SSL Encrypted" : "Polar & SSL Korumalı"}</span>
                </li>
                <li className="text-[11px] text-slate-400">
                  <span>Contact: </span>
                  <a href="mailto:hello@sety.store" className="text-[#5500FF] hover:underline font-medium">
                    hello@sety.store
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span>© 2026 Sety. {isEn ? "All rights reserved." : "Tüm hakları saklıdır."}</span>
            <span>{isEn ? "Crafted with care for independent creators." : "Üreten herkes için, özenle tasarlandı."}</span>
            <span className="font-semibold text-slate-700">
              {isEn ? "Global Creator Platform 🚀" : "Türkiye’den, dünyaya 🚀"}
            </span>
          </div>
        </div>
      </footer>

      <StickyCTA />
    </div>
  );
}
