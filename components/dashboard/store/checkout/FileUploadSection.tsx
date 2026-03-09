'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Link, ExternalLink, File } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';

interface FileUploadSectionProps {
    uploadedFileUrl: string;
    redirectUrl: string;
    onFileUploaded: (url: string, name: string) => void;
    onRedirectUrlChange: (url: string) => void;
}

export function FileUploadSection({ uploadedFileUrl, redirectUrl, onFileUploaded, onRedirectUrlChange }: FileUploadSectionProps) {
    const { showToast } = useToast();
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [useRedirect, setUseRedirect] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file) return;
        setIsUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı');

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
            const filePath = `${user.id}/digital-products/${fileName}`;

            const { error } = await supabase.storage
                .from('products')
                .upload(filePath, file, { upsert: true });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            onFileUploaded(publicUrl, file.name);
            setUploadedFileName(file.name);
            showToast('Dosya başarıyla yüklendi! ✅', 'success');
        } catch (err: any) {
            showToast(`Yükleme hatası: ${err.message}`, 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    return (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100/60 shadow-xl shadow-slate-200/20 space-y-8 transition-all hover:shadow-2xl hover:shadow-slate-200/30">
            <div className="space-y-2">
                <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest">
                    💡 Satın alan müşterilere otomatik olarak gönderilecek
                </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-3">
                <button
                    onClick={() => setUseRedirect(false)}
                    className={`flex-1 h-11 rounded-2xl text-[13px] font-black transition-all border ${!useRedirect ? 'bg-[#5500ff] text-white border-[#5500ff] shadow-lg shadow-[#5500ff]/20' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'}`}
                >
                    📁 Dosya Yükle
                </button>
                <button
                    onClick={() => setUseRedirect(true)}
                    className={`flex-1 h-11 rounded-2xl text-[13px] font-black transition-all border ${useRedirect ? 'bg-[#5500ff] text-white border-[#5500ff] shadow-lg shadow-[#5500ff]/20' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'}`}
                >
                    🔗 URL&apos;ye Yönlendir
                </button>
            </div>

            {!useRedirect ? (
                /* File Upload */
                uploadedFileUrl ? (
                    <div className="flex items-center gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-black text-emerald-800 truncate">{uploadedFileName || 'Dosya yüklendi'}</p>
                            <p className="text-[12px] text-emerald-600 font-medium">Müşteriye otomatik gönderilecek ✅</p>
                        </div>
                        <button
                            onClick={() => { onFileUploaded('', ''); setUploadedFileName(''); }}
                            className="w-8 h-8 rounded-xl bg-white text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors border border-emerald-100"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${isDragging ? 'border-[#5500ff] bg-[#5500ff]/5 scale-[1.01]' : 'border-slate-200 hover:border-[#5500ff]/40 hover:bg-slate-50/50'}`}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                            {isUploading ? (
                                <div className="w-6 h-6 border-2 border-[#5500ff] border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Upload className="w-7 h-7 text-slate-300" />
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-[15px] font-black text-slate-700">
                                {isUploading ? 'Yükleniyor...' : 'Dosyanı buraya sürükle'}
                            </p>
                            <p className="text-[13px] text-slate-400 font-medium mt-1">
                                veya <span className="text-[#5500ff] font-black">tıkla ve seç</span>
                            </p>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium">
                            PDF, ZIP, MP4, MP3, PNG, DOCX — Maks. 500MB
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.zip,.mp4,.mp3,.png,.jpg,.jpeg,.docx,.xlsx,.pptx,.mov,.wav"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                        />
                    </div>
                )
            ) : (
                /* URL Redirect */
                <div className="space-y-3">
                    <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2">
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                        </div>
                        <input
                            type="url"
                            value={redirectUrl}
                            onChange={(e) => onRedirectUrlChange(e.target.value)}
                            placeholder="https://drive.google.com/..."
                            className="w-full h-14 pl-12 pr-5 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-medium text-slate-700 focus:ring-4 focus:ring-[#5500ff]/5 focus:border-[#5500ff] outline-none transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <p className="text-[12px] text-slate-400 font-medium ml-1">
                        Google Drive, Dropbox, Notion, YouTube gibi linkler kullanabilirsiniz.
                    </p>
                </div>
            )}
        </div>
    );
}
