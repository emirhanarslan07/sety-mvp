import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: 'Refund Policy | Sety',
    description: 'Refund policy for Sety Pro subscriptions.',
};

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="bg-card border border-border/40 rounded-3xl p-8 md:p-12 shadow-sm">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-4">
                        REFUND POLICY
                    </h1>
                    <p className="text-slate-400 text-sm mb-10">
                        Son Güncelleme Tarihi: 15.06.2026
                    </p>

                    <div className="prose prose-slate max-w-none space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">1. Sety Pro Subscriptions</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Sety provides a 14-day money-back guarantee for your first subscription payment of Sety Pro ($19/month). If you are not satisfied with our service, you can request a full refund within 14 days of your initial purchase by contacting us at hello@sety.store.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                After the initial 14-day period, subscription payments are non-refundable. You may cancel your subscription at any time, and you will continue to have access to Sety Pro features until the end of your current billing cycle.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">2. Purchases from Creators (Digital Products, Services)</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Sety is a SaaS platform providing storefront infrastructure for independent creators. We do not act as the merchant of record for the products or services sold by creators on their individual Sety storefronts.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                All purchases made from a creator's store are processed through the creator's own connected payment gateway (e.g., Stripe, PayPal, Iyzico). Therefore, Sety cannot issue refunds for these transactions. If you need a refund for a product purchased from a creator, please contact the creator directly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">3. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about this Refund Policy or need to request a refund for your Sety Pro subscription, please contact us at:
                                <br />
                                <br />
                                <strong>Email:</strong> hello@sety.store
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
