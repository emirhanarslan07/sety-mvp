'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Bot, Bell, MessageSquare, Info, Link as LinkIcon, Loader2, CheckCircle2, Trash2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface TelegramSettingsClientProps {
    initialSettings: any;
    store: any;
}

export default function TelegramSettingsClient({ initialSettings, store }: TelegramSettingsClientProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [connecting, setConnecting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [token, setToken] = useState('');
    const [settings, setSettings] = useState(initialSettings);

    const handleConnect = async () => {
        if (!token) {
            showToast('Lütfen bir bot token girin.', 'error');
            return;
        }

        setConnecting(true);
        try {
            const res = await fetch('/api/telegram/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (data.success) {
                showToast('Bot başarıyla bağlandı!', 'success');
                setToken('');
                router.refresh();
            } else {
                showToast(data.error || 'Bağlantı başarısız.', 'error');
            }
        } catch (error) {
            showToast('Bağlantı sırasında bir hata oluştu.', 'error');
        } finally {
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm('Bot bağlantısını kesmek istediğinize emin misiniz?')) return;

        setConnecting(true);
        try {
            const res = await fetch('/api/telegram/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: false, store_id: store.id }),
            });

            if (res.ok) {
                showToast('Bağlantı kesildi.', 'success');
                router.refresh();
            }
        } catch (error) {
            showToast('İşlem başarısız.', 'error');
        } finally {
            setConnecting(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/telegram/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    store_id: store.id,
                    welcome_message: settings.welcome_message,
                    seller_notifications: settings.seller_notifications,
                    customer_notifications: settings.customer_notifications,
                }),
            });

            if (res.ok) {
                showToast('Ayarlar kaydedildi.', 'success');
            } else {
                throw new Error();
            }
        } catch (error) {
            showToast('Kaydedilirken bir hata oluştu.', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Section 1: Bot Connection */}
            <Card className="rounded-[32px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Bot Bağlantısı</CardTitle>
                        {settings.is_active ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-4 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider">
                                🟢 Bağlı
                            </Badge>
                        ) : (
                            <Badge className="bg-slate-50 text-slate-400 border-slate-100 px-4 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider">
                                🔴 Bağlı Değil
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                    {!settings.is_active ? (
                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-3">
                                <Input
                                    type="password"
                                    placeholder="Bot token'ınızı girin (Örn: 8573483437:AAE...)"
                                    className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold focus:ring-2 focus:ring-[#5500ff]/10 transition-all"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                />
                                <Button 
                                    onClick={handleConnect}
                                    disabled={connecting || !token}
                                    className="h-14 px-8 rounded-2xl bg-[#5500ff] hover:bg-[#4400cc] text-white font-black shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {connecting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Bağla"}
                                </Button>
                            </div>
                            <p className="text-[13px] font-bold text-slate-400">
                                BotFather'dan aldığınız API Token'ı buraya yapıştırın.
                            </p>
                        </div>
                    ) : (
                        <div className="p-6 rounded-[24px] bg-slate-50/50 border border-slate-100 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#5500ff] shadow-sm">
                                        <Bot className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-[17px] font-black text-slate-900 leading-tight">{settings.bot_name || 'Bot'}</h4>
                                        <p className="text-[14px] font-bold text-slate-400">@{settings.bot_username}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">Token</p>
                                    <p className="text-[14px] font-mono font-bold text-slate-600">{settings.bot_token_masked}</p>
                                </div>
                            </div>
                            
                            <Separator className="bg-slate-200/50" />
                            
                            <div className="flex justify-end">
                                <Button 
                                    variant="ghost" 
                                    onClick={handleDisconnect}
                                    disabled={connecting}
                                    className="h-12 px-6 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-black flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Bağlantıyı Kes
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Section 2: Notification Settings */}
            <Card className="rounded-[32px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Bildirim Ayarları</CardTitle>
                    <CardDescription className="text-[15px] font-bold text-slate-400">Botunuzun hangi durumlarda mesaj göndereceğini seçin.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                    <div className="space-y-4">
                        {[
                            { 
                                id: 'welcome_message', 
                                label: 'Otomatik karşılama mesajı', 
                                desc: 'Botu başlatan kullanıcılara hoş geldiniz mesajı gönderir.', 
                                icon: MessageSquare,
                                color: 'text-indigo-500',
                                bg: 'bg-indigo-50'
                            },
                            { 
                                id: 'seller_notifications', 
                                label: 'Satış bildirimleri (Sizlere)', 
                                desc: 'Yeni bir satış olduğunda size anlık bildirim gelir.', 
                                icon: Bell,
                                color: 'text-amber-500',
                                bg: 'bg-amber-50'
                            },
                            { 
                                id: 'customer_notifications', 
                                label: 'Müşteri onay mesajı', 
                                desc: 'Satın alma sonrası müşteriye otomatik onay mesajı iletir.', 
                                icon: CheckCircle2,
                                color: 'text-emerald-500',
                                bg: 'bg-emerald-50'
                            }
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <Label htmlFor={item.id} className="text-[15px] font-black text-slate-900 cursor-pointer">{item.label}</Label>
                                        <p className="text-[13px] font-bold text-slate-400">{item.desc}</p>
                                    </div>
                                </div>
                                <Switch 
                                    id={item.id}
                                    checked={settings[item.id]}
                                    onCheckedChange={(checked) => setSettings({ ...settings, [item.id]: checked })}
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                    <Button 
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-xl shadow-slate-200 transition-all active:scale-95"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ayarları Kaydet"}
                    </Button>
                </CardFooter>
            </Card>

            {/* Section 3: Instructions */}
            <Card className="rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50/30 overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Info className="w-5 h-5 text-indigo-500" />
                        Nasıl Bağlanır?
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        {[
                            "Telegram'da @BotFather'a gidin",
                            "/newbot yazarak yeni bot oluşturun",
                            "Size verilen API Token'ı kopyalayın",
                            "Yukarıdaki alana yapıştırıp Bağla'ya tıklayın"
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[12px] font-black text-slate-400 shrink-0 shadow-sm">
                                    {i + 1}
                                </div>
                                <p className="text-[14px] font-bold text-slate-600">{step}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-6 rounded-2xl bg-white border border-slate-100 space-y-3 shadow-sm self-start">
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Mağaza Bot Linkin</p>
                        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 overflow-hidden">
                            <LinkIcon className="w-4 h-4 text-[#5500ff] shrink-0" />
                            <span className="text-[14px] font-bold text-slate-900 truncate italic">
                                t.me/SetyBot?start=store_{store?.username || store?.id?.slice(0,8)}
                            </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 leading-tight">
                            Müşterileriniz bu özel link üzerinden botunuzu başlatabilir.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
