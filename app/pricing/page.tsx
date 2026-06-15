import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

export const metadata = {
    title: 'Pricing | Sety',
    description: 'Simple, transparent pricing for creators.',
};

export default function PricingPage() {
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

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Everything you need to sell your digital products, with 0% transaction fees from us.
                    </p>
                </div>

                <div className="max-w-md mx-auto bg-card border border-primary/20 rounded-3xl p-8 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50"></div>
                    
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Sety Pro</h2>
                        <div className="flex justify-center items-baseline gap-1">
                            <span className="text-5xl font-black tracking-tight">$19</span>
                            <span className="text-muted-foreground font-medium">/month</span>
                        </div>
                        <p className="text-muted-foreground mt-4 text-sm">
                            Billed monthly. Cancel anytime.
                        </p>
                    </div>

                    <div className="space-y-4 mb-8">
                        {[
                            '0% transaction fees from Sety',
                            'Unlimited digital products',
                            'Connect your own payment gateway (Stripe, PayPal, etc.)',
                            'Custom domain support',
                            'Analytics and customer insights',
                            'Email support'
                        ].map((feature, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="mt-1 bg-primary/10 rounded-full p-1">
                                    <Check className="w-3 h-3 text-primary" />
                                </div>
                                <span className="text-foreground text-sm font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/auth?mode=register"
                        className="block w-full py-3 px-4 bg-primary text-primary-foreground text-center font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Start Your Free Trial
                    </Link>
                </div>
                
                <div className="mt-16 text-center max-w-2xl mx-auto text-sm text-muted-foreground">
                    <p>
                        Note: While Sety charges 0% transaction fees, your chosen payment gateway (e.g., Stripe, PayPal) will still charge their standard processing fees.
                    </p>
                </div>
            </div>
        </div>
    );
}
