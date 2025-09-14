import { OtherItem, ProductItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Instagram, Linkedin } from 'lucide-react';

const productItems: ProductItem[] = [
    {
        title: 'Kelas Online',
        href: '/course',
    },
    {
        title: 'Webinar',
        href: '/webinar',
    },
];

const otherItems: OtherItem[] = [
    {
        title: 'Pusat Bantuan',
        href: 'https://wa.me/+6282241477053',
    },
    {
        title: 'Syarat & Ketentuan',
        href: '/terms-and-conditions',
    },
    {
        title: 'Kebijakan Privasi',
        href: '/privacy-policy',
    },
];

export default function AppFooter() {
    return (
        <footer className="from-primary/80 to-background bg-gradient-to-t py-8 sm:py-16">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 text-sm sm:grid-cols-2 sm:gap-12 lg:grid-cols-3">
                <div>
                    {/* Logo untuk light mode */}
                    <img src="/assets/images/logo-primary.png" alt="Logo Arsa Cendekia" className="block w-24 fill-current dark:hidden" />
                    {/* Logo untuk dark mode */}
                    <img src="/assets/images/logo-secondary.png" alt="Logo Arsa Cendekia" className="hidden w-24 fill-current dark:block" />
                    <p className="my-4">Maju Bersama Arsa Cendekia</p>
                    <h5 className="font-semibold">CV. Arsa Cendekia</h5>
                    <p className="text-gray-800 dark:text-gray-400">
                        Karangploso, Kabupaten Malang Prov. Jawa Timur <br /> +6282241477053
                    </p>
                </div>
                <div className="flex gap-8 sm:gap-12">
                    <div>
                        <h4 className="mb-4 font-semibold">Produk</h4>
                        <ul className="space-y-2">
                            {productItems.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.href} className="hover:underline">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold">Lainnya</h4>
                        <ul className="space-y-2">
                            {otherItems.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.href} className="hover:underline">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="sm:text-right">
                    <h4 className="mb-4 font-semibold">Media Sosial</h4>
                    <div className="flex items-center gap-4 sm:justify-end">
                        <a href="https://www.instagram.com/arsacendekia/" target="_blank">
                            <Instagram />
                        </a>
                        <a href="https://www.linkedin.com/company/arsacendekia" target="_blank">
                            <Linkedin />
                        </a>
                    </div>
                    <p className="mt-4">Ikuti kami di media sosial untuk mendapatkan informasi terbaru.</p>
                </div>
            </div>
            <div className="mt-12 text-center text-xs">&copy; 2025 CV. Arsa Cendekia. All rights reserved.</div>
        </footer>
    );
}
