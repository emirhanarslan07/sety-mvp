import { Footer } from '@/components/landing/Footer';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
                    <Link
                        href="/auth"
                        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#6a5fff] transition-colors mb-8 group"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                        Geri Dön
                    </Link>

                    <h1 className="mb-2 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        SETY HİZMET ŞARTLARI
                    </h1>
                    <p className="text-slate-400 text-sm mb-10">
                        Son Güncelleme Tarihi: 14.02.2026
                    </p>

                    <div className="prose prose-slate max-w-none space-y-8">
                        <p className="text-slate-600 leading-relaxed italic">
                            Bu Hizmet Şartları (“Şartlar”), Türkiye merkezli Sety (“Sety”, “Platform”, “Şirket”, “biz”) tarafından sunulan tüm web sitesi, yazılım ve hizmetlerin kullanımını düzenler.
                        </p>

                        <p className="text-slate-900 font-medium">
                            Sety’ye erişerek veya kullanarak bu Şartları kabul etmiş olursunuz.
                        </p>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">1</span>
                                Hizmet Tanımı
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Sety, kullanıcıların dijital mağaza, link-in-bio sayfası ve ürün/hizmet tanıtım sayfaları oluşturmasına olanak sağlayan bulut tabanlı bir SaaS platformudur.</p>
                                <p>Sety, kullanıcıların oluşturduğu içeriklerin doğruluğundan, yasallığından, güvenilirliğinden veya ticari sonuçlarından sorumlu değildir.</p>
                                <p>Sety, ödeme işlemlerini doğrudan yürütmez (aksi açıkça belirtilmedikçe) ve kullanıcılar ile üçüncü taraflar arasındaki ticari ilişkilerden sorumlu değildir.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">2</span>
                                Üyelik ve Hesap
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Platformu kullanabilmek için:</p>
                                <ul className="list-disc space-y-2 ml-4">
                                    <li>18 yaşından büyük olmanız,</li>
                                    <li>Doğru ve güncel bilgiler sağlamanız,</li>
                                    <li>Hesap bilgilerinizi korumanız gerekmektedir.</li>
                                </ul>
                                <p>Hesabınız altında gerçekleşen tüm işlemlerden siz sorumlusunuz.</p>
                                <p>Sety, güvenlik veya kötüye kullanım şüphesi halinde hesabı askıya alma veya sonlandırma hakkını saklı tutar.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">3</span>
                                Ücretsiz Deneme Süresi
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Sety, yeni kullanıcılar için 7 (yedi) günlük ücretsiz deneme süresi sunar.</p>
                                <p>Deneme süresi, mağazanın yayınlanması veya aktif edilmesi ile başlar.</p>
                                <p>Deneme süresi sonunda abonelik iptal edilmezse otomatik olarak ücretli plana geçilir.</p>
                                <p>Deneme süresi boyunca iptal edilen hesaplardan ücret tahsil edilmez.</p>
                                <p>Aynı kişinin birden fazla deneme hesabı oluşturması yasaktır.</p>
                                <p>Sety, kötüye kullanım durumunda deneme hakkını iptal edebilir.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">4</span>
                                Abonelik, Ücretlendirme ve Otomatik Yenileme
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Sety, aylık abonelik modeli ile çalışır.</p>
                                <p>Abonelikler aylık olarak tahsil edilir.</p>
                                <p>Abonelik, kullanıcı iptal etmediği sürece otomatik olarak yenilenir.</p>
                                <p>Yenileme tarihinde ilgili ücret otomatik olarak tahsil edilir.</p>
                                <p>Kullanıcı, yenileme tarihinden önce iptal etmezse bir sonraki dönem için ücretlendirilir.</p>
                                <p>Abonelik iptali, mevcut fatura döneminin sonunda yürürlüğe girer.</p>
                                <p>Yasal zorunluluklar dışında ücret iadesi yapılmaz.</p>
                                <p>Sety, fiyatlarda değişiklik yapma hakkını saklı tutar. Fiyat değişiklikleri yürürlüğe girmeden önce kullanıcıya bildirilir.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">5</span>
                                Kullanıcı İçerikleri ve Sorumluluk
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Kullanıcı, platforma yüklediği tüm içeriklerin hukuka uygun olduğunu, üçüncü kişilerin haklarını ihlal etmediğini ve yanıltıcı veya dolandırıcılık içermediğini beyan eder.</p>
                                <p>Sety, uygunsuz içerikleri kaldırma ve hesabı sonlandırma hakkını saklı tutar.</p>
                                <p>Kullanıcı, içeriklerinin doğurabileceği her türlü hukuki sorumluluğu üstlenir.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">6</span>
                                Yasaklı Kullanımlar
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Platform aşağıdaki amaçlarla kullanılamaz:</p>
                                <ul className="list-disc space-y-2 ml-4">
                                    <li>Yasa dışı ürün veya hizmet satışı</li>
                                    <li>Dolandırıcılık faaliyetleri</li>
                                    <li>Telif hakkı ihlali</li>
                                    <li>Spam, phishing veya zararlı yazılım</li>
                                    <li>Nefret söylemi veya yasa dışı içerik</li>
                                </ul>
                                <p>Bu kurallara aykırı davranan hesaplar derhal kapatılabilir.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">7</span>
                                Fikri Mülkiyet Hakları
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Sety’ye ait yazılım, tasarım, marka, logo ve tüm platform içeriği Şirket’e aittir.</p>
                                <p>İzinsiz kopyalama, çoğaltma, tersine mühendislik veya ticari kullanım yasaktır.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">8</span>
                                Hizmetin Sürekliliği
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Sety, hizmetin kesintisiz veya hatasız olacağını garanti etmez.</p>
                                <p>Bakım, güncelleme veya teknik sorunlar nedeniyle geçici kesintiler yaşanabilir.</p>
                                <p>Sety, sistemi geliştirme ve değiştirme hakkını saklı tutar.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">9</span>
                                Gelir ve Performans Garantisi Olmaması
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Sety, kullanıcıların gelir elde edeceğine dair herhangi bir garanti vermez.</p>
                                <p>Platform, ticari başarıdan sorumlu değildir.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">10</span>
                                Sorumluluğun Sınırlandırılması
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Yürürlükteki mevzuatın izin verdiği ölçüde Sety; dolaylı zararlar, kar kaybı, veri kaybı veya iş kaybı gibi zararlardan sorumlu değildir.</p>
                                <p>Sety’nin toplam sorumluluğu, kullanıcının son 3 ayda ödediği abonelik tutarı ile sınırlıdır.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">11</span>
                                Hesap Sonlandırma
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Kullanıcı istediği zaman aboneliğini iptal edebilir.</p>
                                <p>Sety; şart ihlali, kötüye kullanım veya yasal zorunluluk durumlarında hesabı askıya alma veya sonlandırma hakkını saklı tutar.</p>
                                <p>Hesap kapatıldığında içerikler silinebilir.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 text-sm">12</span>
                                SaaS Model ve Komisyonsuz Satış Esasları
                            </h2>
                            <div className="pl-11 space-y-3 text-slate-600 leading-relaxed">
                                <p>Sety, kullanıcılara (creator'lara) yalnızca dijital mağaza altyapısı ve teknik araçlar sağlayan bulut tabanlı bir SaaS (Software as a Service) platformudur.</p>
                                <p>Sety, kullanıcıların kendi mağazaları üzerinden yaptıkları dijital ürün veya hizmet satışlarının hiçbir şekilde tarafı, aracısı veya garantörü değildir. Bu satışlardan Sety hiçbir komisyon, işlem ücreti veya pay almaz; elde edilen gelirlerin tamamı (%100) kullanıcıya aittir.</p>
                                <p>Alıcıların gerçekleştirdiği ödemeler, platformumuz üzerinden geçmez ve bizim tarafımızdan tahsil edilmez. Tüm ödeme işlemleri, doğrudan mağaza sahibinin kendi entegre ettiği ödeme kanalları (Stripe, PayPal, iyzico vb.) üzerinden doğrudan satıcı ile alıcı arasında gerçekleşir.</p>
                                <p>Sety, yalnızca mağaza sahiplerinden platformun teknik kullanımı için sabit aylık Sety Pro yazılım abonelik bedeli tahsil eder.</p>
                            </div>
                        </section>

                        <section className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">İletişim</h2>
                            <p className="text-slate-600">E-posta: <a href="mailto:hello@sety.store" className="text-[#6a5fff] font-medium hover:underline">hello@sety.store</a></p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
