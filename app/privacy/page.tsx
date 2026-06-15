import { Footer } from '@/components/landing/Footer';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
                    <Link
                        href="/auth"
                        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#7C3AED] transition-colors mb-8 group"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                        Geri Dön
                    </Link>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED]">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                            SETY GİZLİLİK POLİTİKASI
                        </h1>
                    </div>

                    <p className="text-slate-400 text-sm mb-10">
                        Son Güncelleme Tarihi: 15.06.2026
                    </p>

                    <div className="prose prose-slate max-w-none space-y-8">
                        <p className="text-slate-600 leading-relaxed">
                            Bu Gizlilik Politikası, Sety tarafından toplanan kişisel verilerin işlenme esaslarını açıklar.
                        </p>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">1</span>
                                Toplanan Veriler
                            </h2>
                            <div className="pl-11 space-y-6">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Kullanıcı Tarafından Sağlanan Veriler</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-slate-400" /> Ad soyad
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-slate-400" /> E-posta adresi
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-slate-400" /> Hesap bilgileri
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-slate-400" /> Yüklenen içerikler
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Otomatik Olarak Toplanan Veriler</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-slate-400" /> IP adresi
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-slate-400" /> Tarayıcı bilgileri
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-slate-400" /> Cihaz bilgileri
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-slate-400" /> Kullanım verileri
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-slate-400" /> Çerezler
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">2</span>
                                Veri İşleme Amaçları
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Verileriniz aşağıdaki amaçlarla işlenir:</p>
                                <ul className="list-disc space-y-2 ml-4">
                                    <li>Hizmeti sunmak ve performansı geliştirmek</li>
                                    <li>Güvenliği sağlamak ve kötüye kullanımı önlemek</li>
                                    <li>Yasal yükümlülükleri yerine getirmek</li>
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">3</span>
                                Hukuki Dayanak (KVKK ve GDPR)
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Veri işleme süreçlerimiz; sözleşmenin ifası, meşru menfaat, yasal yükümlülük ve açık rıza dayanaklarına uygun olarak yürütülür.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">4</span>
                                Veri Paylaşımı
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Kişisel verileriniz asla satılmaz. Sadece hizmetin sunulması için gerekli olan bulut sağlayıcıları, analiz araçları, ödeme sistemleri ve yasal mercilerle paylaşılabilir.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">5</span>
                                Veri Güvenliği
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Sety, verileri korumak için makul teknik ve idari önlemler alır. Ancak internet üzerindeki hiçbir sistemin %100 güvenli olamayacağı unutulmamalıdır.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">6</span>
                                Veri Saklama Süresi
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Verileriniz, hesabınız aktif olduğu sürece ve yasal yükümlülükler gerektirdiği müddetçe saklanır. Hesap kapatıldığında makul süre içinde silinir veya anonimleştirilir.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">7</span>
                                Kullanıcı Hakları
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>KVKK ve GDPR kapsamında; verilerinize erişme, düzeltme, silme talep etme ve işlemeye itiraz etme haklarına sahipsiniz.</p>
                                <p>Tüm talepleriniz için: <a href="mailto:hello@sety.store" className="text-[#7C3AED] font-medium hover:underline">hello@sety.store</a></p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">8</span>
                                Alıcı Ödemeleri ve Finansal Veriler
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Sety, mağaza sahiplerinin (creator'ların) kendi müşterilerinden (alıcılardan) aldığı ödemelere ait kredi kartı, banka bilgileri veya diğer finansal verileri kesinlikle işlemez, saklamaz veya platform sunucularından geçirmez. Bu ödemeler, mağaza sahibinin kendi hesabına bağladığı üçüncü taraf ödeme aracıları (Stripe, PayPal, iyzico vb.) tarafından doğrudan ve ilgili kuruluşların kendi gizlilik politikaları çerçevesinde güvenli bir şekilde işlenir.</p>
                                <p>Sety, yalnızca mağaza sahiplerinin platform kullanımına yönelik (Sety Pro aboneliği) gerçekleştirdiği ödemeleri yetkili ödeme ortağımız Paddle aracılığıyla yönetir.</p>
                            </div>
                        </section>

                        <section className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">İletişim</h2>
                            <p className="text-slate-600">Sorularınız için bizimle her zaman iletişime geçebilirsiniz.</p>
                            <p className="text-slate-600">E-posta: <a href="mailto:hello@sety.store" className="text-[#6a5fff] font-medium hover:underline">hello@sety.store</a></p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
