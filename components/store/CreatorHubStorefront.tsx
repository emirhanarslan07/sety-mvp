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
      id: 'emma-mentorship',
      title: '1:1 Mentorship & Brand Strategy',
      desc: 'Direct 45-minute online video call. Turn your audience into loyal paying clients.',
      icon: Video,
      type: '1:1 VIDEO SESSION',
      duration: '45 mins',
      price: '$75',
      priceNum: 75,
      color: 'lilac',
      mode: 'online' as const,
      area_options: [
        { id: 'strategy', title: 'Content & Growth Strategy', description: 'Monetize your audience and scale engagement', duration: '45 Mins' },
        { id: 'review', title: 'Portfolio & Product Review', description: 'Deep dive into your Notion systems, guides, or digital offerings', duration: '45 Mins' },
        { id: 'roadmap', title: 'Digital Product Roadmap', description: 'Step-by-step launch plan for your first e-book or template', duration: '45 Mins' },
      ],
      action: 'booking' as const,
    },
    {
      id: 'emma-content-kit',
      title: 'Content Planning OS (Notion + Canva)',
      desc: 'One month of content in one simple system. 30 ready-to-use templates, hook vault & calendar.',
      icon: Download,
      type: 'DIGITAL PRODUCT',
      duration: 'Instant Download',
      price: '$19',
      priceNum: 19,
      color: 'lime',
      action: 'digital' as const,
    },
    {
      id: 'emma-ebook',
      title: 'The Creator\'s Roadmap (PDF Guide)',
      desc: 'From zero to your first $1,000 online. A 48-page actionable handbook.',
      icon: BookOpen,
      type: 'E-BOOK GUIDE',
      duration: '48 Pages · PDF',
      price: '$12',
      priceNum: 12,
      color: 'peach',
      action: 'digital' as const,
    },
    {
      id: 'emma-community',
      title: 'Creative Founders Circle',
      desc: 'Private Discord community, weekly live coaching sessions, and peer creator network.',
      icon: Users,
      type: 'EXCLUSIVE COMMUNITY',
      duration: 'Monthly Access',
      price: '$9/mo',
      priceNum: 9,
      color: 'lilac',
      action: 'digital' as const,
    },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub || !emailSub.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubmittingLead(true);
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailSub.trim().toLowerCase(),
          creator_id: store?.id || 'emma-carter-store',
          source: 'storefront_newsletter'
        })
      });
      showToast('You are on the list! Welcome aboard 🎉', 'success');
      setEmailSub('');
    } catch {
      showToast('Subscribed successfully! ✨', 'success');
      setEmailSub('');
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleProductClick = (item: any) => {
    if (item.action === 'booking') {
      setSelectedProduct(item);
    } else {
      showToast(`Redirecting to secure checkout for "${item.title}"...`, 'success');
    }
  };

  const creatorName = store?.display_name || store?.full_name || 'Emma Carter';

  return (
    <div className="storefront">
      {/* Top Banner */}
      <div className="store-banner">
        BUILD YOUR STORE · DIGITAL PRODUCTS & 1:1 COACHING
      </div>

      {/* Top Navigation */}
      <div className="store-nav">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft size={14} className="mr-1" /> Back to Sety
          </Link>
        </Button>
        <span className="store-demo-label">Demo Storefront</span>
      </div>

      {/* Main Store Area */}
      <main className="store-main">
        {/* Profile Card */}
        <div className="store-profile">
          <img
            src="/creator-deniz.jpg"
            alt={creatorName}
            width={1024}
            height={1024}
            loading="eager"
          />
          <span className="eyebrow">DIGITAL CREATOR & ENTREPRENEUR</span>
          <h1>
            {creatorName}{' '}
            <span className="verified">
              <Check size={14} />
            </span>
          </h1>
          <div className="font-semibold text-xs sm:text-sm text-slate-800 tracking-tight mt-0.5">
            Digital Products · Notion Templates · 1:1 Coaching
          </div>
          <p className="mt-1">
            Everything I design, build, and teach in one simple place. Start monetizing your creative journey today.
          </p>

          <span className="profile-location">
            <MapPin size={13} /> Worldwide · Instant & Global Delivery
          </span>

          <div className="store-tags">
            <span>Notion Template</span>
            <span>Canva Kit</span>
            <span>E-Book</span>
            <span>1:1 Coaching</span>
            <span>Community</span>
          </div>

          {/* Quick Contact Bar */}
          <SmartSocialLinks
            links={[
              { url: 'https://instagram.com/emmacarter', type: 'instagram', title: 'Instagram' },
              { url: 'https://youtube.com/@emmacarter', type: 'youtube', title: 'YouTube' },
              { url: 'https://behance.net/emmacarter', type: 'behance', title: 'Behance' },
              { url: 'https://x.com/emmacarter', type: 'twitter', title: 'X (Twitter)' },
              { url: 'https://wa.me/15550192834?text=Hi%20Emma,%20I%20would%20like%20to%20learn%20more%20about%20your%20offerings.', type: 'whatsapp', title: 'WhatsApp' },
            ]}
          />
        </div>

        {/* Section Label */}
        <div className="store-section-label">
          FEATURED PRODUCTS & SESSIONS <span>04 ITEMS</span>
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
                  <span>{item.action === 'booking' ? 'Book session' : 'Buy & Download'}</span>
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
                Be the first to get new templates & guides
              </strong>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Join our newsletter for weekly free frameworks, design tips, and early-bird discounts.
              </p>
            </div>
          </div>
          <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
            <input
              type="email"
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              placeholder="Your email address..."
              required
              className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#5500FF] shadow-2xs"
            />
            <Button
              type="submit"
              disabled={submittingLead}
              className="rounded-full bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold text-xs px-5 shadow-sm shrink-0"
            >
              {submittingLead ? <Loader2 size={13} className="animate-spin" /> : 'Subscribe'}
            </Button>
          </form>
        </div>

        {/* Inspirational Note */}
        <div className="store-note">
          <BookOpen size={16} />
          <p>
            Every journey starts with a single idea.
            <br />
            You focus on creating — Sety handles the rest.
          </p>
        </div>

        {/* Store Footer */}
        <div className="store-powered">
          <span>
            <LockKeyhole size={12} /> Secure Creator Storefront · 256-Bit SSL Encrypted
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
            currency: 'USD',
            mode: selectedProduct.mode,
            area_options: selectedProduct.area_options,
          }}
          profile={{
            id: store?.id || 'emma-carter-store',
            user_id: store?.user_id || 'emma-carter-user',
            username: store?.username || 'emma',
            full_name: 'Emma Carter',
            display_name: 'Emma Carter',
            email: 'emma@sety.store',
            social_links: {
              whatsapp: '15550192834',
              phone: '15550192834',
            },
          }}
        />
      )}
    </div>
  );
}
