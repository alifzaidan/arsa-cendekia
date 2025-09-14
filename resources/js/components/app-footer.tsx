import { OtherItem, ProductItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Instagram, Mail, Phone } from 'lucide-react';

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
        <footer className="from-primary to-tertiary rounded-t-4xl bg-gradient-to-r pt-8 pb-28 text-white lg:pb-8">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 text-sm sm:grid-cols-2 sm:gap-12 lg:grid-cols-2">
                <div>
                    {/* Logo untuk light mode */}
                    <img src="/assets/images/logo-primary.png" alt="Logo Arsa Cendekia" className="block w-24 fill-current dark:hidden" />
                    {/* Logo untuk dark mode */}
                    <img src="/assets/images/logo-secondary.png" alt="Logo Arsa Cendekia" className="hidden w-24 fill-current dark:block" />
                    <h5 className="font-semibold">CV. Arsa Cendekia</h5>
                    <p className="mt-4">Berkembang Bersama Arsa Cendekia💡</p>
                </div>
                <div className="flex gap-8 sm:gap-12 lg:justify-end">
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
                    <div>
                        <h4 className="mb-4 font-semibold">Kontak</h4>
                        <div className="space-y-4">
                            <a href="mailto:arsacendekia@gmail.com" target="_blank" className="flex items-center gap-2" rel="noopener noreferrer">
                                <Mail className="h-4 w-4" /> arsacendekia@gmail.com
                            </a>
                            <a href="https://wa.me/+6282241477053" target="_blank" className="flex items-center gap-2" rel="noopener noreferrer">
                                <Phone className="h-4 w-4" /> +6282241477053
                            </a>
                            <a
                                href="https://www.instagram.com/arsacendekia/"
                                target="_blank"
                                className="flex items-center gap-2"
                                rel="noopener noreferrer"
                            >
                                <Instagram className="h-4 w-4" /> @arsacendekia
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12 text-center text-xs">&copy; 2025 CV. Arsa Cendekia. All rights reserved.</div>
        </footer>
    );
}
