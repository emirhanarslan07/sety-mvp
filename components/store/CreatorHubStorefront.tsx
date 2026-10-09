'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowLeft,
  Check,
  Package,
  LockKeyhole,
  MapPin,
  Video,
  Clock,
  Heart,
  BookOpen,
  Phone,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SetyLogo } from '@/components/sety/brand';
import AppointmentBookingModal from '@/components/store/AppointmentBookingModal';
import { SmartSocialLinks } from '@/components/store/SmartSocialLinks';

interface CreatorHubStorefrontProps {
  store: any;
}

export function CreatorHubStorefront({ store }: CreatorHubStorefrontProps) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const sessions = [
    {
      id: 'gizem-in-person',
      title: 'Yüz yüze danışmanlık',
      desc: 'Kendine ayırdığın güvenli bir alan. Kliniğimizde birebir psikolojik danışmanlık.',
      icon: Heart,
      type: 'KLİNİKTE GÖRÜŞME',
      duration: '50 dakika',
      color: 'peach',
      mode: 'in_person' as const,
      area_options: [
        { id: 'adult', title: 'Yetişkin Bireysel Danışmanlık', description: 'Depresyon, kaygı, panik atak, stres ve travma odaklı seans', duration: '50 Dk' },
        { id: 'child', title: 'Çocuk & Ergen Danışmanlığı', description: 'Sınav kaygısı, uyum ve davranışsal danışmanlık', duration: '50 Dk' },
        { id: 'couple', title: 'Çift & Evlilik Terapisi', description: 'İlişki iletişimi ve problem çözme odaklı seans', duration: '75 Dk' }
      ]
    },
    {
      id: 'gizem-online',
      title: 'Online psikolojik danışmanlık',
      desc: 'Nerede olursan ol, kendin için bir adım at. Online birebir görüşme.',
      icon: Video,
      type: 'ONLINE GÖRÜŞME',
      duration: '50 dakika',
      color: 'lilac',
      mode: 'online' as const,
      area_options: [
        { id: 'online-pre', title: 'Online Danışmanlık & Ön Değerlendirme', description: 'Görüntülü seans öncesi kısa tanışma ve ihtiyaç analizi', duration: '50 Dk' },
        { id: 'online-adult', title: 'Yetişkin Bireysel (Online)', description: 'Dünyanın her yerinden güvenli online seans', duration: '50 Dk' },
        { id: 'online-couple', title: 'Online Çift Danışmanlığı', description: 'Uzaktan görüntülü çift görüşmesi', duration: '75 Dk' }
      ]
    },
    {
      id: 'gizem-couple',
      title: 'Çift & evlilik terapisi',
      desc: 'Birbirinizi yeniden duymak, anlamak ve birlikte ilerlemek için.',
      icon: Heart,
      type: 'BİRLİKTE BİR ADIM',
      duration: '60 dakika',
      color: 'lime',
      mode: 'in_person' as const,
      area_options: [
        { id: 'couple-main', title: 'Çift & Evlilik Seansı', description: 'İlişki dinamiği ve iletişim çalışmaları', duration: '75 Dk' },
        { id: 'pre-marital', title: 'Evlilik Öncesi Danışmanlık', description: 'Evlilik kararı ve uyum süreci seansı', duration: '60 Dk' }
      ]
    },
  ];

  return (
    <div className="storefront">
      {/* Top Banner */}
      <div className="store-banner">
        KENDİN İÇİN BİR ADIM · YÜZ YÜZE & ONLINE GÖRÜŞMELER
      </div>

      {/* Top Navigation */}
      <div className="store-nav">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft size={14} className="mr-1" /> Sety’ye dön
          </Link>
        </Button>
        <span className="store-demo-label">Örnek vitrin</span>
      </div>

      {/* Main Store Area */}
      <main className="store-main">
        {/* Profile Card */}
        <div className="store-profile">
          <img
            src="/creator.png"
            alt="Gizem Tepebaş"
            width={1024}
            height={1024}
            loading="eager"
          />
          <span className="eyebrow">UZM. KLİNİK PSİKOLOG</span>
          <h1>
            Gizem Tepebaş{' '}
            <span className="verified">
              <Check size={14} />
            </span>
          </h1>
          <div className="font-semibold text-xs sm:text-sm text-slate-800 tracking-tight mt-0.5">
            Yetişkin & Çift Terapisti · Psikolojik Danışmanlık
          </div>
          <p className="mt-1">
            Kendini anlamaya, iyi hissetmeye ve değişime alan aç.
          </p>

          <span className="profile-location">
            <MapPin size={13} /> Kahramanmaraş · Online & Yüz Yüze Görüşmeler
          </span>

          <div className="store-tags">
            <span>Yetişkin</span>
            <span>Çift Terapisi</span>
            <span>Evlilik Danışmanlığı</span>
            <span>Bireysel Seans</span>
          </div>

          {/* Branded Quick Contact Bar */}
          <SmartSocialLinks
            links={[
              { url: 'https://instagram.com/psikologgizemtepebas', type: 'instagram', title: 'Instagram' },
              { url: 'https://wa.me/905069863046', type: 'whatsapp', title: 'WhatsApp' },
              { url: 'https://doktortakvimi.com', type: 'doktortakvimi', title: 'DoktorTakvimi' },
              { url: 'tel:+905069863046', type: 'phone', title: 'Telefon' },
              { url: 'https://maps.google.com/?q=Açıkgöz+Plaza+Kahramanmaraş', type: 'location', title: 'Açıkgöz Plaza Konumu' },
            ]}
          />
        </div>

        {/* Section Label */}
        <div className="store-section-label">
          KENDİNE BİR ZAMAN AYIR <span>03 SEANS</span>
        </div>

        {/* Products List */}
        <div className="store-products">
          {sessions.map((s) => (
            <article className="store-product" key={s.title}>
              <div className={`store-product-art ${s.color}`}>
                <s.icon />
              </div>
              <div className="store-product-info">
                <span className="eyebrow">{s.type}</span>
                <h2>{s.title}</h2>
                <p>{s.desc}</p>
                <span className="store-duration">
                  <Clock size={12} />
                  {s.duration} · Seans
                </span>
                <Button
                  onClick={() => setSelectedProduct(s)}
                  className="bg-[#5500FF] hover:bg-[#4400cc] text-white flex items-center justify-between"
                >
                  <span>Randevu talep et</span>
                  <ArrowUpRight size={14} />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Clinic Location Card */}
        <div className="store-extra">
          <MapPin />
          <div>
            <strong>Kliniğimizde buluşalım.</strong>
            <p>Kahramanmaraş (Açıkgöz Plaza) · Randevu ile görüşme</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Klinik konumu"
            asChild
          >
            <a
              href="https://maps.google.com/?q=Açıkgöz+Plaza+Kahramanmaraş"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArrowUpRight size={16} />
            </a>
          </Button>
        </div>

        {/* Inspirational Note */}
        <div className="store-note">
          <BookOpen size={16} />
          <p>
            Her yolculuk bir konuşmayla başlar.
            <br />
            Sen hazır olduğunda, buradayım.
          </p>
        </div>

        {/* Store Footer */}
        <div className="store-powered">
          <span>
            <LockKeyhole size={12} /> Güvenli bir mağaza deneyimi
          </span>
          <span>
            Powered by <SetyLogo compact />
          </span>
        </div>
      </main>

      {/* Appointment Booking Modal (Stan Store Style Aylık Takvim & 1 Saatlik Slotlar & WhatsApp Teyit) */}
      {selectedProduct && (
        <AppointmentBookingModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={{
            id: selectedProduct.id,
            title: selectedProduct.title,
            description: selectedProduct.desc,
            price: 0,
            currency: 'TRY',
            mode: selectedProduct.mode,
            area_options: selectedProduct.area_options,
          }}
          store={{
            username: store.username || 'psikologgizemtepebas',
            name: 'Gizem Tepebaş',
            social_links: {
              whatsapp: '905069863046',
            },
          }}
        />
      )}
    </div>
  );
}
