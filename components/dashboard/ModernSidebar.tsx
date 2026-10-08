'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';
import { User, LogOut, ExternalLink } from 'lucide-react';

export default function ModernSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, store } = useDashboard();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const navItems = [
    {
      id: 'overview',
      label: 'Genel Bakış',
      href: '/dashboard',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 16 16">
          <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      id: 'store',
      label: 'Mağazam',
      href: '/dashboard/store',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 16 16">
          <path d="M2 2h12l-1.5 5h-9L2 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M3.5 7v7h9V7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M6.5 10.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: 'orders',
      label: 'Siparişler',
      href: '/dashboard/orders',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 16 16">
          <path d="M2 2h12l-1 8H3L2 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M3 10l1 4h8l1-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'customers',
      label: 'Müşteriler',
      href: '/dashboard/customers',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 16 16">
          <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: 'analytics',
      label: 'Analitik',
      href: '/dashboard/analytics',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 16 16">
          <path d="M2 11.5L5.5 7.5L8.5 9.5L11 5.5L14 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Ayarlar',
      href: '/dashboard/settings',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.4 3.4L4.5 4.5M11.5 11.5L12.6 12.6M12.6 3.4L11.5 4.5M4.5 11.5L3.4 12.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  const username = store?.username || user?.user_metadata?.username || 'emirhan';
  const storeUrl = `sety.store/${username}`;

  const copyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://${storeUrl}`);
    setCopied(true);
    showToast('Mağaza linki kopyalandı! 🚀', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <aside className="w-[240px] shrink-0 h-screen bg-white border-r border-[#E8ECF4] hidden lg:flex flex-col z-30 select-none sticky top-0">
      {/* ── Logo ── */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5500FF] to-[#7B2FFF] flex items-center justify-center shadow-lg shadow-[#5500FF]/25 shrink-0">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M9.5 1.5L5 8.5H8.5L6.5 14.5L12 7H8.5L9.5 1.5Z" fill="#C4FF00"/>
            </svg>
          </div>
          <span className="font-extrabold text-[20px] text-[#0F172A] tracking-tight font-sans">
            sety
          </span>
          <span className="ml-auto text-[10px] font-bold bg-[#C4FF00]/15 text-[#4D6600] px-2 py-0.5 rounded-full border border-[#C4FF00]/40 tracking-wider">
            BETA
          </span>
        </div>
      </div>

      {/* ── Store Link Chip ── */}
      <div className="px-4 py-2">
        <div 
          onClick={copyLink}
          className="bg-[#F8F9FE] hover:bg-[#F2F4FD] border border-[#E8ECF4] rounded-xl px-3 py-2 flex items-center gap-2 cursor-pointer transition-all duration-150 group"
          title="Tıklayarak kopyala"
        >
          <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_0_3px_rgba(16,185,129,0.2)] shrink-0 animate-pulse" />
          <span className="text-[12px] font-semibold text-[#5500FF] truncate flex-1 font-mono">
            {copied ? 'Kopyalandı! ✨' : storeUrl}
          </span>
          <button 
            type="button" 
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://${storeUrl}`, '_blank');
            }}
            className="text-slate-400 hover:text-[#5500FF] p-0.5 transition-colors"
            title="Mağazayı yeni sekmede aç"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 px-3 space-y-1 mt-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#F4F0FF] text-[#5500FF] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F8F9FE]'
              }`}
            >
              <span className={`shrink-0 ${isActive ? 'text-[#5500FF]' : 'text-slate-400'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Trial / Plan Card ── */}
      <div className="p-3.5">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#F8F9FE] to-[#F1F3FE] border border-[#E8ECF4] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              {profile?.plan_type === 'pro' ? 'Pro Plan' : 'Founder Plan'}
            </span>
            <span className="text-[10px] font-bold text-[#5500FF] bg-[#5500FF]/10 px-2 py-0.5 rounded-full">
              Aktif
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
            <div className="h-full bg-[#5500FF] rounded-full w-[85%]" />
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            30 günlük denemeniz aktif. Satışlardan komisyon yok.
          </p>
        </div>
      </div>

      {/* ── Profile Footer ── */}
      <div className="p-3 border-t border-[#E8ECF4] flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
          {profile?.profile_image_url ? (
            <img src={profile.profile_image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-slate-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-slate-900 truncate leading-tight">
            {profile?.full_name || store?.display_name || username}
          </p>
          <p className="text-[11px] font-medium text-slate-400 truncate">
            {user?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          title="Çıkış Yap"
          className="w-8 h-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
