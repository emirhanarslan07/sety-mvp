'use client';

import {
  ArrowUpRight,
  Check,
  CheckCheck,
  Download,
  Calendar,
  TrendingUp,
  Wallet,
  Star,
} from "lucide-react";
import { SetyLogo } from "./brand";
import { useTranslation } from "@/lib/i18n/context";

export function CreatorPreview() {
  const { lang } = useTranslation();
  const isEn = lang === 'en';

  return (
    <div className="creator-stage">
      <div className="stage-grid" />
      <div className="micro-card revenue-card">
        <span className="micro-label">
          <span className="micro-icon">
            <Wallet size={16} />
          </span>{" "}
          {isEn ? "SAMPLE STORE REVENUE" : "ÖRNEK MAĞAZA GELİRİ"}
        </span>
        <strong>
          {isEn ? "$2,850" : "₺42.850"}<span>.00</span>
        </strong>
        <small>
          <TrendingUp size={13} /> {isEn ? "+24.8% vs last month" : "%24,8 geçen aya göre"}
        </small>
        <div className="mini-bars">
          {[22, 36, 27, 46, 38, 58, 50, 70, 60, 86, 76, 100].map((v, i) => (
            <i key={i} style={{ height: `${v}%` }} />
          ))}
        </div>
      </div>
      <div className="micro-card sale-card">
        <span className="success-dot" /> {isEn ? "New sale!" : "Yeni bir satış!"}
        <div className="sale-info">
          <div className="sale-thumb">
            <Download size={17} />
          </div>
          <div>
            <strong>{isEn ? "Content Planner Kit" : "İçerik Planlama Kiti"}</strong>
            <small>{isEn ? "Just now · $19" : "Az önce · ₺290"}</small>
          </div>
          <CheckCheck size={18} />
        </div>
      </div>
      <div className="creator-phone">
        <div className="phone-top">
          <span>9:41</span>
          <span>● ▰</span>
        </div>
        <div className="phone-photo">
          <img
            src="/creator-deniz.jpg"
            width={1024}
            height={1024}
            loading="lazy"
            alt="Creator Deniz Yilmaz"
          />
          <span className="photo-label">{isEn ? "TELL YOUR STORY." : "KENDİ HİKÂYENİ YAZ."}</span>
        </div>
        <div className="phone-content">
          <div className="creator-name">
            Deniz Yılmaz{" "}
            <span>
              <Check size={11} />
            </span>
          </div>
          <p>{isEn ? "Digital Creator & Entrepreneur" : "İçerik üreticisi & yaratıcı girişimci"}</p>
          <div className="phone-socials">
            ↗ <span>deniz.yilmaz</span> · <span>{isEn ? "Contact" : "İletişim"}</span>
          </div>
          <div className="phone-product">
            <span className="product-art lilac">
              <Calendar />
            </span>
            <div>
              <small>{isEn ? "1:1 CONSULTATION" : "BİREBİR DANIŞMANLIK"}</small>
              <strong>{isEn ? "Brand Strategy Coaching" : "Markanı birlikte büyütelim"}</strong>
              <span>{isEn ? "45 min · 1:1 Video Call" : "45 dk · Online görüşme"}</span>
            </div>
            <b>{isEn ? "$75" : "₺1.500"}</b>
          </div>
          <div className="phone-product">
            <span className="product-art lime">
              <Download />
            </span>
            <div>
              <small>{isEn ? "DIGITAL PRODUCT" : "DİJİTAL ÜRÜN"}</small>
              <strong>{isEn ? "Content Planning Kit" : "İçerik Planlama Kiti"}</strong>
              <span>{isEn ? "1 Month of inspiration in 1 file" : "Bir aylık ilham, tek dosyada."}</span>
            </div>
            <b>{isEn ? "$19" : "₺290"}</b>
          </div>
          <div className="phone-product">
            <span className="product-art peach">
              <Star />
            </span>
            <div>
              <small>{isEn ? "E-BOOK" : "E-KİTAP"}</small>
              <strong>{isEn ? "The Creator's Roadmap" : "Yaratıcının Yol Haritası"}</strong>
              <span>{isEn ? "From 0 to your first $1,000" : "Fikirden ilk satışa."}</span>
            </div>
            <b>{isEn ? "$12" : "₺190"}</b>
          </div>
          <div className="phone-powered">
            Powered by <SetyLogo />
          </div>
        </div>
      </div>
      <div className="micro-card payout-card">
        <span className="payout-icon">
          <Check size={18} />
        </span>
        <div>
          <small>{isEn ? "Payout deposited." : "Ödeme hesabında."}</small>
          <strong>
            {isEn ? "$75.00" : "₺1.500,00"} <ArrowUpRight size={15} />
          </strong>
          <span>{isEn ? "Keep building and growing." : "Sen üretmeye devam et."}</span>
        </div>
      </div>
      <div className="micro-card community-card">
        <div className="avatar-stack">
          {["D", "E", "S", "M"].map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <strong>{isEn ? "An audience that values your work." : "Bilgine değer veren bir kitle."}</strong>
        <small>
          <Star size={12} fill="currentColor" /> {isEn ? "Your content. Your clients." : "Senin içeriklerin. Senin müşterilerin."}
        </small>
      </div>
    </div>
  );
}
