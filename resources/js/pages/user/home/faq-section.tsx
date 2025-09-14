import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function FaqSection() {
    const [expanded, setExpanded] = useState<React.Key | null>('getting-started');

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-12">
            <div className="mb-8 text-left md:mb-2 md:text-center">
                <h2 className="mx-auto mb-4 text-3xl font-bold md:text-4xl">Apa Yang Mereka Tanyakan</h2>
                <p className="mx-auto max-w-4xl text-sm text-gray-500 md:text-base">Beberapa pertanyaan yang sering diajukan oleh pengguna.</p>
            </div>
            <div className="flex items-center justify-center gap-8">
                <img src="/assets/images/faq-illustration.webp" alt="Ilustrasi FAQ" className="hidden h-[350px] w-auto md:block" />
                <Accordion
                    className="flex w-full flex-col gap-2 divide-y divide-zinc-200 dark:divide-zinc-700"
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    expandedValue={expanded}
                    onValueChange={setExpanded}
                >
                    <AccordionItem value="beginner-allowed" className="rounded-lg border-2 border-zinc-400 px-4 py-2">
                        <AccordionTrigger className="w-full text-left text-zinc-950 hover:cursor-pointer dark:text-zinc-50">
                            <div className="flex items-center justify-between">
                                <p className="md:text-lg">Apakah seorang pemula bisa ikut belajar?</p>
                                <Plus className="text-primary h-4 w-4 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-sm text-zinc-500 md:text-base dark:text-zinc-400">
                                Tentu saja! Semua kelas dan webinar di Arsa Cendekia dirancang agar mudah diikuti oleh pemula. Materi disusun dari
                                dasar hingga tingkat lanjut, sehingga siapa pun dapat belajar tanpa pengalaman sebelumnya.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="free-class" className="rounded-lg border-2 border-zinc-400 px-4 py-2">
                        <AccordionTrigger className="w-full text-left text-zinc-950 hover:cursor-pointer dark:text-zinc-50">
                            <div className="flex items-center justify-between">
                                <p className="md:text-lg">Apakah ada kelas gratis?</p>
                                <Plus className="text-primary h-4 w-4 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-sm text-zinc-500 md:text-base dark:text-zinc-400">
                                Ya, kami menyediakan beberapa kelas gratis yang dapat diakses oleh semua pengguna. Silakan cek halaman kelas untuk
                                melihat daftar kelas gratis yang tersedia.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="interactive-group" className="rounded-lg border-2 border-zinc-400 px-4 py-2">
                        <AccordionTrigger className="w-full text-left text-zinc-950 hover:cursor-pointer dark:text-zinc-50">
                            <div className="flex items-center justify-between">
                                <p className="md:text-lg">Apakah grup yang didapat interaktif?</p>
                                <Plus className="text-primary h-4 w-4 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-sm text-zinc-500 md:text-base dark:text-zinc-400">
                                Setiap peserta akan bergabung dalam grup diskusi yang interaktif, didampingi mentor dan sesama peserta. Anda dapat
                                bertanya, berdiskusi, dan berbagi pengalaman secara langsung di grup tersebut.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="payment-method" className="rounded-lg border-2 border-zinc-400 px-4 py-2">
                        <AccordionTrigger className="w-full text-left text-zinc-950 hover:cursor-pointer dark:text-zinc-50">
                            <div className="flex items-center justify-between">
                                <p className="md:text-lg">Bagaimana cara pembayarannya?</p>
                                <Plus className="text-primary h-4 w-4 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-sm text-zinc-500 md:text-base dark:text-zinc-400">
                                Pembayaran dapat dilakukan melalui transfer bank, e-wallet, atau metode pembayaran lain yang tersedia di platform
                                kami. Detail pembayaran akan muncul saat Anda melakukan pendaftaran kelas atau webinar.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
}
