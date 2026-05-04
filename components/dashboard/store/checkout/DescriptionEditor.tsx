import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Bold, Italic, Strikethrough, Type, List, Image as ImageIcon, Video, Link as LinkIcon, X, Pencil, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/context';

interface DescriptionEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function DescriptionEditor({ value, onChange }: DescriptionEditorProps) {
    const { t } = useTranslation();
    const descriptionRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialized = useRef(false);

    // Modal States
    const [modals, setModals] = useState({
        video: false,
        link: false
    });

    const [modalData, setModalData] = useState({
        videoUrl: '',
        linkName: '',
        linkUrl: ''
    });

    useEffect(() => {
        if (descriptionRef.current && !isInitialized.current) {
            descriptionRef.current.innerHTML = value || '';
            isInitialized.current = true;
        }
    }, [value]);

    const updateContent = useCallback(() => {
        const text = descriptionRef.current?.innerHTML || '';
        onChange(text);
    }, [onChange]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            updateContent();
        }, 300);
    };

    const applyFormat = useCallback((command: string, value: string = '') => {
        descriptionRef.current?.focus();
        document.execCommand(command, false, value);
        updateContent();
    }, [updateContent]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                const imgHtml = `<img src="${url}" class="w-full rounded-2xl my-4 border-2 border-[#5500ff]/10" />`;
                descriptionRef.current?.focus();
                document.execCommand('insertHTML', false, imgHtml);
                updateContent();
            };
            reader.readAsDataURL(file);
        }
    };

    const insertVideo = () => {
        if (!modalData.videoUrl) return;
        const videoHtml = `
            <div class="relative w-full aspect-video rounded-3xl overflow-hidden my-6 group/vid border-2 border-[#5500ff]/10 bg-slate-50 flex flex-col items-center justify-center p-8 gap-4">
                <div class="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl shadow-red-600/20">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <p class="text-[12px] font-black uppercase tracking-widest text-slate-400">Video: ${modalData.videoUrl.slice(0, 30)}...</p>
            </div>
        `;
        descriptionRef.current?.focus();
        document.execCommand('insertHTML', false, videoHtml);
        updateContent();
        setModals(prev => ({ ...prev, video: false }));
        setModalData(prev => ({ ...prev, videoUrl: '' }));
    };

    const insertLink = () => {
        if (!modalData.linkName || !modalData.linkUrl) return;
        const linkHtml = `<a href="${modalData.linkUrl}" class="text-[#5500ff] font-black underline underline-offset-4 decoration-2" target="_blank">${modalData.linkName}</a>`;
        descriptionRef.current?.focus();
        document.execCommand('insertHTML', false, linkHtml);
        updateContent();
        setModals(prev => ({ ...prev, link: false }));
        setModalData(prev => ({ ...prev, linkName: '', linkUrl: '' }));
    };

    return (
        <div className="space-y-4">
            <label className="text-[14px] font-black text-slate-800 ml-1 uppercase tracking-widest opacity-80">
                {t('dashboard.store.editors.description.label')}
            </label>

            <div className="group relative border-2 border-[#5500ff]/20 focus-within:border-[#5500ff] rounded-[32px] overflow-hidden transition-all bg-white shadow-sm hover:shadow-md">
                {/* Toolbar */}
                <div className="flex items-center px-6 gap-0.5 h-16 bg-[#5500ff]/5 border-b border-[#5500ff]/10">
                    <ToolbarButton
                        onClick={() => applyFormat('formatBlock', '<h3>')}
                        icon={<Type className="w-5 h-5" />}
                        title={t('dashboard.store.editors.description.toolbar.h3')}
                    />
                    <ToolbarButton
                        onClick={() => applyFormat('bold')}
                        icon={<Bold className="w-5 h-5" />}
                        title={t('dashboard.store.editors.description.toolbar.bold')}
                    />
                    <ToolbarButton
                        onClick={() => applyFormat('strikeThrough')}
                        icon={<Strikethrough className="w-5 h-5" />}
                        title={t('dashboard.store.editors.description.toolbar.strike')}
                    />
                    <ToolbarButton
                        onClick={() => applyFormat('italic')}
                        icon={<Italic className="w-5 h-5" />}
                        title={t('dashboard.store.editors.description.toolbar.italic')}
                    />
                    <div className="w-px h-6 bg-[#5500ff]/10 mx-2" />
                    <ToolbarButton
                        onClick={() => applyFormat('insertUnorderedList')}
                        icon={<List className="w-5 h-5" />}
                        title={t('dashboard.store.editors.description.toolbar.list')}
                    />
                    <ToolbarButton
                        onClick={() => fileInputRef.current?.click()}
                        icon={<ImageIcon className="w-5 h-5" />}
                        title={t('dashboard.store.editors.description.toolbar.image')}
                    />
                    <ToolbarButton
                        onClick={() => setModals(m => ({ ...m, video: true }))}
                        icon={<Video className="w-5 h-5" />}
                        title={t('dashboard.store.editors.description.toolbar.video')}
                    />
                    <ToolbarButton
                        onClick={() => setModals(m => ({ ...m, link: true }))}
                        icon={<LinkIcon className="w-5 h-5" />}
                        title={t('dashboard.store.editors.description.toolbar.link')}
                    />
                </div>

                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />

                {/* Content Area */}
                <div
                    ref={descriptionRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    data-placeholder={t('dashboard.store.editors.description.placeholder')}
                    className="w-full min-h-[220px] px-8 py-8 font-bold text-[16px] text-slate-600 outline-none leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 rich-text-editor custom-scrollbar overflow-y-auto max-h-[500px]"
                />
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {modals.video && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setModals(m => ({ ...m, video: false }))}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[40px] shadow-2xl w-full max-w-[480px] p-10 relative z-10 space-y-8"
                        >
                            <button onClick={() => setModals(m => ({ ...m, video: false }))} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X className="w-6 h-6" /></button>
                            <h2 className="text-[22px] font-black text-slate-900 text-center">{t('dashboard.store.editors.description.modals.video_title')}</h2>
                            <div className="space-y-4">
                                <div className="relative group">
                                    <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#5500ff] transition-colors" />
                                    <input
                                        type="text"
                                        placeholder={t('dashboard.store.editors.description.modals.video_placeholder')}
                                        value={modalData.videoUrl}
                                        onChange={(e) => setModalData(d => ({ ...d, videoUrl: e.target.value }))}
                                        className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold focus:ring-4 focus:ring-[#5500ff]/5 focus:border-[#5500ff] outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <Button
                                    onClick={insertVideo}
                                    className="w-full h-14 bg-[#5500ff] text-white font-black rounded-2xl hover:bg-[#4400cc] shadow-xl shadow-[#5500ff]/20"
                                >
                                    {t('dashboard.store.editors.description.modals.embed_button')}
                                </Button>
                                <button className="w-full h-14 bg-white border-2 border-[#5500ff]/10 text-[#5500ff] font-black rounded-2xl hover:bg-[#5500ff]/5 transition-all flex items-center justify-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    {t('dashboard.store.editors.description.modals.upload_own')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Link Modal */}
            <AnimatePresence>
                {modals.link && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setModals(m => ({ ...m, link: false }))}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[40px] shadow-2xl w-full max-w-[480px] p-10 relative z-10 space-y-8"
                        >
                            <button onClick={() => setModals(m => ({ ...m, link: false }))} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X className="w-6 h-6" /></button>
                            <h2 className="text-[22px] font-black text-slate-900 text-center">{t('dashboard.store.editors.description.modals.link_title')}</h2>
                            <div className="space-y-4">
                                <div className="relative group">
                                    <Pencil className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#5500ff] transition-colors" />
                                    <input
                                        type="text"
                                        placeholder={t('dashboard.store.editors.description.modals.link_name_placeholder')}
                                        value={modalData.linkName}
                                        onChange={(e) => setModalData(d => ({ ...d, linkName: e.target.value }))}
                                        className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold focus:ring-4 focus:ring-[#5500ff]/5 focus:border-[#5500ff] outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="relative group">
                                    <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#5500ff] transition-colors" />
                                    <input
                                        type="text"
                                        placeholder={t('dashboard.store.editors.description.modals.link_url_placeholder')}
                                        value={modalData.linkUrl}
                                        onChange={(e) => setModalData(d => ({ ...d, linkUrl: e.target.value }))}
                                        className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold focus:ring-4 focus:ring-[#5500ff]/5 focus:border-[#5500ff] outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        onClick={() => setModals(m => ({ ...m, link: false }))}
                                        className="flex-1 h-14 border-2 border-[#5500ff]/10 text-[#5500ff] font-black rounded-2xl hover:bg-[#5500ff]/5 transition-all text-[13px]"
                                    >
                                        {t('dashboard.store.editors.description.modals.remove_link')}
                                    </button>
                                    <Button
                                        onClick={insertLink}
                                        className="flex-1 h-14 bg-[#5500ff] text-white font-black rounded-2xl hover:bg-[#4400cc] shadow-xl shadow-[#5500ff]/20 text-[13px]"
                                    >
                                        {t('dashboard.store.editors.description.modals.save_button')}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .rich-text-editor ul {
                    list-style-type: disc;
                    margin-left: 1.5rem;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .rich-text-editor h3 {
                    font-size: 1.25rem;
                    font-weight: 900;
                    color: #0f172a;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
                .rich-text-editor a {
                    color: #5500ff;
                    text-decoration: underline;
                    font-weight: 900;
                }
            `}</style>
        </div>
    );
}

function ToolbarButton({ onClick, icon, title }: { onClick: () => void, icon: React.ReactNode, title: string }) {
    return (
        <button
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            className="p-2.5 hover:bg-[#5500ff]/10 rounded-xl text-slate-500 hover:text-[#5500ff] transition-all active:scale-95"
            title={title}
        >
            {icon}
        </button>
    );
}
