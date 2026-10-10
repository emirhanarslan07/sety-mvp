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

export function CreatorPreview() {
  return (
    <div className="creator-stage">
      <div className="stage-grid" />
      <div className="micro-card revenue-card">
        <span className="micro-label">
          <span className="micro-icon">
            <Wallet size={16} />
          </span>{" "}
          BU AYKİ KAZANCIN
        </span>
        <strong>
          ₺42.850<span>,00</span>
        </strong>
        <small>
          <TrendingUp size={13} /> %24,8 <span>geçen aya göre</span>
        </small>
        <div className="mini-bars">
          {[22, 36, 27, 46, 38, 58, 50, 70, 60, 86, 76, 100].map((v, i) => (
            <i key={i} style={{ height: `${v}%` }} />
          ))}
        </div>
      </div>
      <div className="micro-card sale-card">
        <span className="success-dot" /> Yeni bir satış!
        <div className="sale-info">
          <div className="sale-thumb">
            <Download size={17} />
          </div>
          <div>
            <strong>İçerik Planlama Kiti</strong>
            <small>Az önce · ₺290</small>
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
            alt="Örnek içerik üreticisi Deniz"
          />
          <span className="photo-label">KENDİ HİKÂYENİ YAZ.</span>
        </div>
        <div className="phone-content">
          <div className="creator-name">
            Deniz Yılmaz{" "}
            <span>
              <Check size={11} />
            </span>
          </div>
          <p>İçerik üreticisi & yaratıcı girişimci</p>
          <div className="phone-socials">
            ↗ <span>deniz.yilmaz</span> · <span>İletişim</span>
          </div>
          <div className="phone-product">
            <span className="product-art lilac">
              <Calendar />
            </span>
            <div>
              <small>BİREBİR DANIŞMANLIK</small>
              <strong>Markanı birlikte büyütelim</strong>
              <span>45 dk · Online görüşme</span>
            </div>
            <b>₺1.500</b>
          </div>
          <div className="phone-product">
            <span className="product-art lime">
              <Download />
            </span>
            <div>
              <small>DİJİTAL ÜRÜN</small>
              <strong>İçerik Planlama Kiti</strong>
              <span>Bir aylık ilham, tek dosyada.</span>
            </div>
            <b>₺290</b>
          </div>
          <div className="phone-product">
            <span className="product-art peach">
              <Star />
            </span>
            <div>
              <small>E-KİTAP</small>
              <strong>Yaratıcının Yol Haritası</strong>
              <span>Fikirden ilk satışa.</span>
            </div>
            <b>₺190</b>
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
          <small>Ödeme hesabında.</small>
          <strong>
            ₺1.500,00 <ArrowUpRight size={15} />
          </strong>
          <span>Sen üretmeye devam et.</span>
        </div>
      </div>
      <div className="micro-card community-card">
        <div className="avatar-stack">
          {["D", "E", "S", "M"].map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <strong>Bilgine değer veren bir kitle.</strong>
        <small>
          <Star size={12} fill="currentColor" /> Senin içeriklerin. Senin müşterilerin.
        </small>
      </div>
    </div>
  );
}
