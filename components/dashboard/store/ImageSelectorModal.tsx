'use client';

import React, { useState } from 'react';
import { X, Search, Upload, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';

interface ImageSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

const STOCK_IMAGES = [
    // --- 🌸 Çiçekler ---
    { id: 'f01', url: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?auto=format&fit=crop&q=80&w=800', name: 'Pembe Laleler' },
    { id: 'f02', url: 'https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?auto=format&fit=crop&q=80&w=800', name: 'Beyaz Şakayık' },
    { id: 'f03', url: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&q=80&w=800', name: 'Pembe Çiçekler' },
    { id: 'f04', url: 'https://images.unsplash.com/photo-1550159930-40066082a4fc?auto=format&fit=crop&q=80&w=800', name: 'Kırmızı Güller' },
    { id: 'f05', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=800', name: 'Çiçek Buketi' },
    { id: 'f06', url: 'https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?auto=format&fit=crop&q=80&w=800', name: 'Zarif Orkide' },
    { id: 'f07', url: 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?auto=format&fit=crop&q=80&w=800', name: 'Sarı Papatyalar' },
    { id: 'f08', url: 'https://images.unsplash.com/photo-1498579687545-d5a4fffb0a9e?auto=format&fit=crop&q=80&w=800', name: 'Kır Çiçekleri' },
    { id: 'f09', url: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&q=80&w=800', name: 'Kiraz Çiçekleri' },
    { id: 'f10', url: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&q=80&w=800', name: 'Mor Çiçekler' },
    { id: 'f11', url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&q=80&w=800', name: 'Ayçiçeği Tarlası' },
    { id: 'f12', url: 'https://images.unsplash.com/photo-1497262693247-aa258f96c4f5?auto=format&fit=crop&q=80&w=800', name: 'Lavanta Bahçesi' },
    { id: 'f13', url: 'https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?auto=format&fit=crop&q=80&w=800', name: 'Yabani Çiçekler' },
    { id: 'f14', url: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&q=80&w=800', name: 'Mavi Çiçekler' },

    // --- 🎨 Aesthetic & Soyut ---
    { id: 'p01', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800', name: 'Pastel Gradient' },
    { id: 'p02', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800', name: 'Mor Gradient' },
    { id: 'p03', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800', name: 'Pembe Dalgalar' },
    { id: 'p04', url: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800', name: 'Aesthetic Masa' },
    { id: 'p05', url: 'https://images.unsplash.com/photo-1545033131-485ea67fd7c3?auto=format&fit=crop&q=80&w=800', name: 'Renkli Balonlar' },
    { id: 'p06', url: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&q=80&w=800', name: 'Suluboya Sanat' },

    // --- ☕ Keyif & Huzur ---
    { id: 'c01', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800', name: 'Sabah Kahvesi' },
    { id: 'c02', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800', name: 'Latte Art' },
    { id: 'c03', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800', name: 'Kitap Keyfi' },
    { id: 'c04', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', name: 'Huzurlu Yurt' },
    { id: 'c05', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800', name: 'Tropik Sahil' },
    { id: 'c06', url: 'https://images.unsplash.com/photo-1519995451813-39e29e054914?auto=format&fit=crop&q=80&w=800', name: 'Macaronlar' },

    // --- 🌅 Gökyüzü & Işık ---
    { id: 'sk1', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800', name: 'Gün Doğumu' },
    { id: 'sk0', url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=800', name: 'Altın Saat' },
    { id: 'sk6', url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800', name: 'Turuncu Gün Batımı' },
    { id: 'sk2', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=800', name: 'Kuzey Işıkları' },
    { id: 'sk3', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', name: 'Yıldızlı Gece' },
    { id: 'sk4', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800', name: 'Dağ & Yıldızlar' },
    { id: 'sk5', url: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?auto=format&fit=crop&q=80&w=800', name: 'Pembe Gün Batımı' },

    // --- 🌿 Doğa & Manzara ---
    { id: 'n01', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800', name: 'Sonbahar Ormanı' },
    { id: 'n02', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800', name: 'Yosemite Vadisi' },
    { id: 'n03', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800', name: 'Göl Manzarası' },
    { id: 'n04', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800', name: 'Lavanta Tarlası' },
    { id: 'n05', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800', name: 'Sisli Orman' },
    { id: 'n06', url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=800', name: 'Şelale' },
    { id: 'n07', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800', name: 'Alp Manzarası' },
    { id: 'n08', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800', name: 'Dağ Yansıması' },
    { id: 'n09', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800', name: 'Tropik Orman' },

    // --- 🐾 Hayvanlar ---
    { id: 'a01', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800', name: 'Sevimli Kedi' },
    { id: 'a02', url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800', name: 'Yavru Köpek' },
    { id: 'a03', url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800', name: 'Beyaz Atlar' },
    { id: 'a04', url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=800', name: 'Tatsız Kedi' },
    { id: 'a05', url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=800', name: 'Güzel Baykış' },

    // --- 🌆 Şehir & Seyahat ---
    { id: 'tr1', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800', name: 'Paris' },
    { id: 'tr2', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800', name: 'Avrupa Sokakları' },
    { id: 'tr3', url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=800', name: 'İtalya Manzarası' },
    { id: 'tr4', url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=800', name: 'Cinque Terre' },
];

export default function ImageSelectorModal({ isOpen, onClose, onSelect }: ImageSelectorModalProps) {
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const filteredImages = STOCK_IMAGES.filter(img =>
        img.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı');

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/product-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            onSelect(publicUrl);
            onClose();
        } catch (err: any) {
            console.error('Upload error:', err);
            showToast(`Yükleme hatası: ${err.message}`, 'error');
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-[800px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
                    <h2 className="text-[24px] font-black text-slate-800 tracking-tight mx-auto">Görselinizi Seçin</h2>
                    <button onClick={onClose} className="absolute right-8 p-3 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-8 py-6 border-b border-slate-50 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Anahtar kelime ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-[#5500ff]/10 focus:border-[#5500ff] transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {/* Upload Card */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-[4/3] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-100 transition-colors group relative"
                        >
                            {isUploading ? (
                                <Loader2 className="w-10 h-10 text-[#5500ff] animate-spin" />
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5500ff] group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[14px] font-black text-slate-800">Görsel Yükle</p>
                                        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">Bilgisayarınızdan Seçin</p>
                                    </div>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        {/* Stock Images */}
                        {filteredImages.map((img) => (
                            <div
                                key={img.id}
                                onClick={() => {
                                    setSelectedId(img.id);
                                    onSelect(img.url);
                                    setTimeout(onClose, 200);
                                }}
                                className={cn(
                                    "aspect-[4/3] rounded-3xl overflow-hidden relative cursor-pointer transition-all hover:scale-[1.02] shadow-sm hover:shadow-md",
                                    selectedId === img.id ? "ring-4 ring-[#5500ff]" : "ring-1 ring-slate-100"
                                )}
                            >
                                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-[13px] font-black tracking-tight">{img.name}</p>
                                </div>
                                {selectedId === img.id && (
                                    <div className="absolute inset-0 bg-[#5500ff]/20 flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-[#5500ff] text-white flex items-center justify-center shadow-lg">
                                            <Check className="w-6 h-6" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="h-14 px-8 rounded-2xl font-black text-slate-400 hover:text-slate-900 transition-colors">Vazgeç</button>
                    <button onClick={onClose} className="h-14 px-10 rounded-2xl bg-[#5500ff] text-white font-black hover:bg-[#4400cc] transition-all shadow-xl shadow-blue-500/10">Tamam</button>
                </div>
            </motion.div>
        </div>
    );
}
