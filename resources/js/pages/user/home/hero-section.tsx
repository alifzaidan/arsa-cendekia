import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { MoveRight, Phone } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="bg-background py-8 text-gray-900 sm:py-16 lg:py-32 dark:text-white">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-3">
                <div className="col-span-2">
                    <span className="text-secondary mb-4 inline-block font-medium sm:text-lg">
                        <span className="bg-secondary px-1 text-black">50% Off</span> Belajar Mulai Sekarang
                    </span>

                    <h1 className="mb-6 text-4xl leading-tight font-bold sm:text-5xl">
                        Pilihan Terbaik Belajar Akuntansi, Keuangan, dan Perpajakan.
                    </h1>

                    <p className="mb-6 max-w-xl font-medium text-gray-600 sm:text-lg dark:text-gray-400">
                        Tingkatkan keterampilan Anda dengan kursus online berkualitas dari instruktur berpengalaman.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Button asChild>
                            <Link href="/courses">
                                Jelajahi Kelas <MoveRight />
                            </Link>
                        </Button>
                        <a href="https://wa.me/+6282241477053" target="_blank" rel="noopener noreferrer">
                            <Button variant="secondary">
                                <Phone />
                                Hubungi Kami
                            </Button>
                        </a>
                    </div>
                </div>
                <div className="relative col-span-1 hidden lg:block">
                    <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 animate-spin duration-[15s]">
                        <div className="bg-primary mx-auto h-52 w-52 rounded-full blur-[70px]" />
                        <div className="flex gap-2">
                            <div className="bg-secondary h-48 w-48 rounded-full blur-[70px]" />
                            <div className="bg-tertiary h-48 w-48 rounded-full blur-[70px]" />
                        </div>
                    </div>

                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <img src="assets/images/hero-illustration.webp" alt="Ilustrasi Hero" />
                    </div>
                </div>
            </div>
        </section>
    );
}
