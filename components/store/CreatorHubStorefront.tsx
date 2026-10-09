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
          <p>
            Kendini anlamaya, iyi hissetmeye ve değişime alan aç.
          </p>

          <span className="profile-location">
            <MapPin size={13} /> Kahramanmaraş · Online & yüz yüze
          </span>

          <div className="store-tags">
            <span>Yetişkin</span>
            <span>Çift terapisi</span>
            <span>Psikolojik danışmanlık</span>
          </div>

          {/* Branded Quick Contact Bar */}
          <div className="flex items-center gap-2 mt-4">
            <a
              href="https://instagram.com/psikologgizemtepebas"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full border border-slate-200/90 bg-white flex items-center justify-center text-slate-700 hover:text-[#5500FF] hover:border-[#5500FF]/40 shadow-xs transition-all"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://wa.me/905069863046"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-8 h-8 rounded-full border border-slate-200/90 bg-white flex items-center justify-center text-emerald-600 hover:border-emerald-500/40 shadow-xs transition-all"
            >
              <MessageCircle size={15} />
            </a>
            <a
              href="tel:+905069863046"
              aria-label="Telefon"
              className="w-8 h-8 rounded-full border border-slate-200/90 bg-white flex items-center justify-center text-slate-700 hover:text-emerald-600 shadow-xs transition-all"
            >
              <Phone size={14} />
            </a>
            <a
              href="https://maps.google.com/?q=Açıkgöz+Plaza+Kahramanmaraş"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Konum"
              className="w-8 h-8 rounded-full border border-slate-200/90 bg-white flex items-center justify-center text-red-500 hover:border-red-400/40 shadow-xs transition-all"
            >
              <MapPin size={15} />
            </a>
          </div>
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
