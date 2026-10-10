import Link from 'next/link';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { SetyLogo } from '@/components/sety/brand';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full flex flex-col items-center">
        <Link href="/" className="mb-8 inline-block hover:opacity-80 transition-opacity">
          <SetyLogo />
        </Link>

        <div className="w-20 h-20 rounded-3xl bg-violet-50 text-[#5500FF] flex items-center justify-center mb-6 shadow-sm border border-violet-100">
          <Sparkles className="w-10 h-10" />
        </div>

        <span className="text-[12px] font-extrabold uppercase tracking-widest text-[#5500FF] mb-2">
          404 · SAYFA BULUNAMADI
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          Aradığınız sayfa mevcut değil
        </h1>

        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 max-w-sm">
          Bu bağlantı taşınmış, silinmiş veya henüz oluşturulmamış bir mağazaya ait olabilir.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/denizyilmaz"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 shadow-xs transition-all"
          >
            Örnek Vitrini Gör
          </Link>
        </div>
      </div>
    </div>
  );
}
