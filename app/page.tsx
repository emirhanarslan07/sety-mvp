import { Navbar } from '@/components/landing/Navbar';
import TurkishCreatorHero from '@/components/landing/TurkishCreatorHero';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { CommissionBand } from '@/components/landing/CommissionBand';
import { Features } from '@/components/landing/Features';
import { SocialProof } from '@/components/landing/SocialProof';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import { StickyCTA } from '@/components/landing/StickyCTA';
import { Comparison } from '@/components/landing/Comparison';


export default function Home() {
    return (
        <main className="min-h-screen relative bg-background transition-colors duration-500">
            <Navbar />

            <TurkishCreatorHero />

            <ProductShowcase />

            <div id="how-it-works">
                <HowItWorks />
            </div>

            <CommissionBand />

            <div id="features">
                <Features />
            </div>

            <Comparison />

            <div id="testimonials">
                <SocialProof />
            </div>

            <div id="faq">
                <FAQ />
            </div>



            <Footer />
            <StickyCTA />
        </main>
    );
}
