'use client';

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/context/AuthModalContext";
import { SetyLogo } from "@/components/sety/brand";
import { SiteHeader } from "@/components/sety/SiteHeader";
import { StickyCTA } from "@/components/sety/sticky-cta";
import { turkishCreatorIcons } from "@/components/sety/hero-icons";
import { CreatorPreview } from "@/components/sety/creator-preview";

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

  return (
    <div className="landing">
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
          <div className="launch-label">
            <span /> ÜRETİCİLER İÇİN YENİ BİR BAŞLANGIÇ <ArrowUpRight size={13} />
          </div>
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
            <strong>Sen üret. Sety ile kazanmaya başla.</strong>
          </p>
          <Button className="main-cta" onClick={() => openModal("signup")}>
            Ücretsiz mağazanı aç <ArrowUpRight />
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
        <div className="creator-bottom">
          <span>
            <ShieldCheck size={16} /> Sana ait bir mağaza, baştan sona.
          </span>
          <Button variant="link" asChild>
            <Link href="/psikologgizemtepebas">
              Bir mağazayı keşfet <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>

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
            Sety’de senin için bir yer var.
          </p>
        </div>
        <div className="bento-grid">
          <article className="bento bento-session">
            <div className="bento-top">
              <span className="bento-icon">
                <Calendar />
              </span>
              <span className="category-label">ZAMANINI DEĞERE DÖNÜŞTÜR</span>
              <ArrowUpRight />
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
            </div>
          </article>

          <article className="bento bento-digital">
            <div className="bento-top">
              <span className="bento-icon">
                <Download />
              </span>
              <span className="category-label">BİR KERE ÜRET. TEKRAR TEKRAR SAT.</span>
              <ArrowUpRight />
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
              <span>Dijital dosyalar</span>
            </div>
          </article>

          <article className="bento bento-book">
            <div className="bento-top">
              <span className="bento-icon">
                <BookOpen />
              </span>
              <span className="category-label">BİLGİN, BİRİNİN YOL HARİTASI.</span>
              <ArrowUpRight />
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
          </article>

          <article className="bento bento-community">
            <div className="bento-top">
              <span className="bento-icon">
                <Users />
              </span>
              <span className="category-label">BİRLİKTE DAHA FAZLASI.</span>
              <ArrowUpRight />
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
          </article>
        </div>
        <div className="sell-bottom">
          <span>Ne üretiyorsan, onun için bir Sety var.</span>
          <Button onClick={() => openModal("signup")}>
            Kendi mağazanı oluştur <ArrowUpRight />
          </Button>
        </div>
      </section>

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

      <section className="final-cta">
        <span className="eyebrow">
          <Zap size={14} /> LANSMANA ÖZEL
        </span>
        <h2>
          İlk satışına giden yol,
          <br />
          <span>bugün başlasın.</span>
        </h2>
        <p>
          Aylık ücret yok. Kurulum ücreti yok.
          <br />
          Lansman döneminde sadece üret, paylaş, sat.
        </p>
        <Button className="main-cta" onClick={() => openModal("signup")}>
          Şimdi ücretsiz mağazanı aç <ArrowUpRight />
        </Button>
        <div className="hero-checks">
          <span>
            <Check /> Kredi kartı gerekmez
          </span>
          <span>
            <Check /> Kontrol tamamen sende
          </span>
        </div>
      </section>

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

      <footer className="footer">
        <div className="footer-top">
          <div>
            <SetyLogo />
            <p>Senin fikrin. Senin işin. Senin Sety’n.</p>
          </div>
          <div className="footer-links">
            <a href="#nasil-calisir">Nasıl çalışır?</a>
            <a href="#neler-satabilirsin">Neler satabilirsiniz?</a>
            <Link href="/dashboard">
              Örnek panel <ArrowUpRight size={12} />
            </Link>
          </div>
          <Button variant="link" onClick={() => openModal("login")}>
            Giriş yap <ArrowUpRight />
          </Button>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Sety. Tüm hakları saklıdır.</span>
          <span>Üreten herkes için, özenle.</span>
          <span>Türkiye’den, dünyaya. ↗</span>
        </div>
      </footer>
      <StickyCTA />
    </div>
  );
}
