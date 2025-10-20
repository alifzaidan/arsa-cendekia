import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import AboutSection from './about-section';
import FaqSection from './faq-section';
import FeatureSection from './feature-section';
import HeroSection from './hero-section';
import LatestProductsSection from './latest-products-section';
import TestimonySection from './testimony-section';

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    title: string;
    thumbnail: string;
    slug: string;
    strikethrough_price: number;
    price: number;
    level?: 'beginner' | 'intermediate' | 'advanced';
    start_date?: string;
    end_date?: string;
    start_time?: string;
    category: Category;
    type: 'course' | 'webinar';
    created_at: string;
}

interface MyProductIds {
    courses: string[];
    webinars: string[];
}

interface ReferralInfo {
    code?: string;
    hasActive: boolean;
}

interface HomeProps {
    latestProducts: Product[];
    myProductIds: MyProductIds;
    referralInfo: ReferralInfo;
}

export default function Home({ latestProducts, myProductIds, referralInfo }: HomeProps) {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const refFromUrl = urlParams.get('ref');

        if (refFromUrl) {
            sessionStorage.setItem('referral_code', refFromUrl);
        } else if (referralInfo.code) {
            sessionStorage.setItem('referral_code', referralInfo.code);
        }
    }, [referralInfo]);

    return (
        <UserLayout>
            <Head title="Beranda" />

            <HeroSection />
            <AboutSection />
            <LatestProductsSection latestProducts={latestProducts} myProductIds={myProductIds} />
            <FeatureSection />
            <TestimonySection />
            <FaqSection />

            <a
                href="https://wa.me/+6282241477053?text=Halo%20Admin%20Arsa%20Cendekia,%20saya%20ingin%20membeli%20produk."
                target="_blank"
                rel="noopener noreferrer"
                className="fixed right-4 bottom-24 z-50 flex h-12 w-12 items-center justify-center transition-transform hover:scale-110 md:right-10 md:h-16 md:w-16 lg:bottom-6"
                aria-label="Chat WhatsApp"
            >
                <img src="/assets/images/wa-icon.webp" alt="WhatsApp" className="h-10 w-10 md:h-12 md:w-12" />
            </a>
        </UserLayout>
    );
}
