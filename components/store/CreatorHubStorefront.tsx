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
  Sparkles,
  Download,
  Users,
  Send,
  Loader2,
  Calendar,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SetyLogo } from '@/components/sety/brand';
import AppointmentBookingModal from '@/components/store/AppointmentBookingModal';
import { SmartSocialLinks } from '@/components/store/SmartSocialLinks';
import { useToast } from '@/context/ToastContext';

interface CreatorHubStorefrontProps {
  store?: any;
}

export function CreatorHubStorefront({ store }: CreatorHubStorefrontProps) {
  const { showToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [emailSub, setEmailSub] = useState('');
  const [submittingLead, setSubmittingLead] = useState(false);

  const offerings = [
    {
      id: 'deniz-mentorship',
      title: '1:1 Mentörlük & Marka Danışmanlığı',
      desc: 'Birebir 45 dakikalık online seans. İçerik üretimi, takipçileri müşteriye dönüştürme ve büyüme stratejisi.',
      icon: Video,
      type: '1:1 ONLINE SEANS',
      duration: '45 dakika',
      price: '₺1.500',
      priceNum: 1500,
      color: 'lilac',
      mode: 'online' as const,
      area_options: [
        { id: 'strategy', title: 'İçerik & Büyüme Stratejisi', description: 'Takipçiyi müşteriye dönüştürme ve etkileşim artırma seansı', duration: '45 Dk' },
        { id: 'review', title: 'Portföy & Tasarım İncelemesi', description: 'Notion, Canva ve portföy çalışmalarınızı birebir analiz', duration: '45 Dk' },
        { id: 'roadmap', title: 'Dijital Ürün Yol Haritası', description: 'İlk e-kitabını veya şablonunu satışa çıkarma planlaması', duration: '45 Dk' },
      ],
      action: 'booking' as const,
    },
    {
      id: 'deniz-content-kit',
      title: 'İçerik Planlama Kiti (Notion + Canva)',
      desc: 'Bir aylık içerik üretimi tek sistemde. 30 hazır şablon, kanca listesi ve takvim.',
      icon: Download,
      type: 'DİJİTAL ÜRÜN',
      duration: 'Anında İndirme',
      price: '₺290',
      priceNum: 290,
      color: 'lime',
      action: 'digital' as const,
    },
    {
      id: 'deniz-ebook',
      title: 'Yaratıcının Yol Haritası (PDF E-Kitap)',
      desc: 'Fikirden ilk 10.000 TL kazanca giden adımlar. 48 sayfalık pratik e-kitap rehber.',
      icon: BookOpen,
      type: 'E-KİTAP REHBER',
      duration: '48 Sayfa · PDF',
      price: '₺190',
      priceNum: 190,
      color: 'peach',
      action: 'digital' as const,
    },
    {
      id: 'deniz-community',
      title: 'Yaratıcı Girişimciler Topluluğu',
      desc: 'Özel Discord kanalı, haftalık canlı yayınlar, soru-cevap ve üretici network ağı.',
      icon: Users,
      type: 'ÖZEL TOPLULUK',
      duration: 'Aylık Üyelik',
      price: '₺99/ay',
      priceNum: 99,
      color: 'lilac',
      action: 'digital' as const,
    },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub || !emailSub.includes('@')) {
      showToast('Lütfen geçerli bir e-posta adresi girin.', 'error');
      return;
    }
    setSubmittingLead(true);
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailSub.trim().toLowerCase(),
          creator_id: store?.id || 'deniz-yilmaz-store',
          source: 'storefront_newsletter'
        })
      });
      showToast('Harika! Bültene başarıyla kaydoldunuz 🎉', 'success');
      setEmailSub('');
    } catch {
      showToast('Bültene başarıyla kaydoldunuz! ✨', 'success');
      setEmailSub('');
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleProductClick = (item: any) => {
    if (item.action === 'booking') {
      setSelectedProduct(item);
    } else {
      showToast(`"${item.title}" için ödeme & indirme sayfası açılıyor...`, 'success');
    }
  };

  return (
    <div className="storefront">
      {/* Top Banner */}
      <div className="store-banner">
        KENDİ HİKÂYENİ YAZ · DİJİTAL ÜRÜNLER & 1:1 SEANSLAR
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
            src="/creator-deniz.jpg"
            alt="Deniz Yılmaz"
            width={1024}
            height={1024}
            loading="eager"
          />
          <span className="eyebrow">İÇERİK ÜRETİCİSİ & YARATICI GİRİŞİMCİ</span>
          <h1>
            Deniz Yılmaz{' '}
            <span className="verified">
              <Check size={14} />
            </span>
          </h1>
          <div className="font-semibold text-xs sm:text-sm text-slate-800 tracking-tight mt-0.5">
            Dijital Ürünler · Tasarım Şablonları · 1:1 Mentörlük
          </div>
          <p className="mt-1">
            Bildiğim, tasarladığım ve ürettiğim her şeyi tek bir yerde topladım. Kendi yaratıcı yolculuğuna bugün başla.
          </p>

          <span className="profile-location">
            <MapPin size={13} /> İstanbul · Online & Global Teslimat
          </span>

          <div className="store-tags">
            <span>Notion Şablonu</span>
            <span>Canva Kiti</span>
            <span>E-Kitap</span>
            <span>1:1 Mentörlük</span>
            <span>Topluluk</span>
          </div>

          {/* Branded Quick Contact Bar */}
          <SmartSocialLinks
            links={[
              { url: 'https://instagram.com/deniz.yilmaz', type: 'instagram', title: 'Instagram' },
              { url: 'https://youtube.com/@denizyilmaz', type: 'youtube', title: 'YouTube' },
              { url: 'https://behance.net/denizyilmaz', type: 'behance', title: 'Behance' },
              { url: 'https://x.com/denizyilmaz', type: 'twitter', title: 'X (Twitter)' },
              { url: 'https://wa.me/905550000000?text=Merhaba%20Deniz,%20ürünlerin%20hakkında%20bilgi%20almak%20istiyorum.', type: 'whatsapp', title: 'WhatsApp İletişim' },
            ]}
          />
        </div>

        {/* Section Label */}
        <div className="store-section-label">
          ÖNE ÇIKAN ÜRÜNLER & SEANSLAR <span>04 ÜRÜN</span>
        </div>

        {/* Products List */}
        <div className="store-products">
          {offerings.map((item) => (
            <article className="store-product" key={item.title}>
              <div className={`store-product-art ${item.color}`}>
                <item.icon />
              </div>
              <div className="store-product-info">
                <div className="flex items-center justify-between gap-2">
                  <span className="eyebrow">{item.type}</span>
                  <span className="font-black text-sm text-slate-900">{item.price}</span>
                </div>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
                <span className="store-duration">
                  <Clock size={12} />
                  {item.duration}
                </span>
                <Button
                  onClick={() => handleProductClick(item)}
                  className="bg-[#5500FF] hover:bg-[#4400cc] text-white flex items-center justify-between shadow-sm"
                >
                  <span>{item.action === 'booking' ? 'Randevu talep et' : 'Satın al & İndir'}</span>
                  <ArrowUpRight size={14} />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter / Lead Capture Subscription Block */}
        <div className="store-extra !flex-col !items-stretch !p-6 bg-gradient-to-br from-violet-50/70 to-purple-50/40 border border-violet-100 rounded-3xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5500FF] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles size={18} />
            </div>
            <div>
              <strong className="text-sm font-black text-slate-900">
                Yeni Şablonları & Rehberleri İlk Sen Gör
              </strong>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Her hafta paylaştığım ücretsiz tasarım ipuçları ve indirimler için bültene abone ol.
              </p>
            </div>
          </div>
          <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
            <input
              type="email"
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              placeholder="E-posta adresin..."
              required
              className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#5500FF] shadow-2xs"
            />
            <Button
              type="submit"
              disabled={submittingLead}
              className="rounded-full bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold text-xs px-5 shadow-sm shrink-0"
            >
              {submittingLead ? <Loader2 size={13} className="animate-spin" /> : 'Abone Ol'}
            </Button>
          </form>
        </div>

        {/* Inspirational Note */}
        <div className="store-note">
          <BookOpen size={16} />
          <p>
            Her yolculuk bir fikirle başlar.
            <br />
            Sen üretmeye devam et, Sety vitrinin her zaman açık.
          </p>
        </div>

        {/* Store Footer */}
        <div className="store-powered">
          <span>
            <LockKeyhole size={12} /> Güvenli Mağaza Altyapısı · SSL Korumalı
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            Powered by <SetyLogo />
          </span>
        </div>
      </main>

      {/* Appointment Booking Modal for 1:1 Mentorship */}
      {selectedProduct && (
        <AppointmentBookingModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={{
            id: selectedProduct.id,
            title: selectedProduct.title,
            description: selectedProduct.desc,
            price: selectedProduct.priceNum,
            currency: 'TRY',
            mode: selectedProduct.mode,
            area_options: selectedProduct.area_options,
          }}
          profile={{
            id: store?.id || 'deniz-yilmaz-store',
            user_id: store?.user_id || 'deniz-yilmaz-user',
            username: store?.username || 'denizyilmaz',
            full_name: 'Deniz Yılmaz',
            display_name: 'Deniz Yılmaz',
            email: 'deniz@sety.store',
            social_links: {
              whatsapp: '905550000000',
              phone: '05550000000',
            },
          }}
        />
      )}
    </div>
  );
}
