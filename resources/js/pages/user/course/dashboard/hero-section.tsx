import { Button } from '@/components/ui/button';
import { MoveRight, Phone } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="to-tertiary from-primary bg-gradient-to-br py-16 text-white md:py-24">
            <div className="mx-auto w-full max-w-7xl px-4">
                <h1 className="mb-6 max-w-3xl text-4xl leading-tight font-bold sm:text-5xl">
                    Temukan Kelas yang Sesuai dengan Minat dan Tujuan Kariermu
                </h1>

                <p className="mb-6 max-w-3xl text-lg text-gray-300">
                    Belajar jadi lebih mudah dan menyenangkan dengan kelas online kami yang dirancang untuk membantu kamu menguasai keterampilan baru
                    dan mencapai tujuan kariermu.
                </p>

                <div className="flex flex-wrap gap-4">
                    <a href="#course">
                        <Button>
                            Lihat Kelas <MoveRight />
                        </Button>
                    </a>
                    <a href="https://wa.me/+6282241477053" target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary">
                            <Phone />
                            Hubungi Kami
                        </Button>
                    </a>
                </div>
            </div>
        </section>
    );
}
