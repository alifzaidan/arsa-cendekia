import { Card, CardContent } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
    return (
        <UserLayout>
            <Head title="Kontak Kami" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <section className="from-primary to-tertiary bg-gradient-to-r py-16 text-white">
                    <div className="mx-auto max-w-7xl px-4 text-center">
                        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Hubungi Kami</h1>
                        <p className="mx-auto max-w-2xl text-lg opacity-90">
                            Kami siap membantu Anda dengan segala pertanyaan seputar pelatihan dan layanan kami
                        </p>
                    </div>
                </section>

                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div>
                            <div className="mb-8">
                                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Informasi Kontak</h2>
                                <p className="text-gray-600 dark:text-gray-400">Jangan ragu untuk menghubungi kami melalui berbagai cara berikut</p>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardContent className="flex items-start gap-4 p-6">
                                        <div className="bg-primary/10 rounded-lg p-3">
                                            <MapPin className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Alamat Kantor</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Perumahan Bumi Bandara Blok C7, No.6
                                                <br />
                                                Kec. Singosari, Kab. Malang
                                                <br />
                                                Indonesia 10110
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="flex items-start gap-4 p-6">
                                        <div className="bg-primary/10 rounded-lg p-3">
                                            <Phone className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Telepon</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">+6282241477053</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="flex items-start gap-4 p-6">
                                        <div className="bg-primary/10 rounded-lg p-3">
                                            <Mail className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                arsacendekia@gmail.com
                                                <br />
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="flex items-start gap-4 p-6">
                                        <div className="bg-primary/10 rounded-lg p-3">
                                            <Clock className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Jam Operasional</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Senin - Jumat: 08:00 - 17:00
                                                <br />
                                                Sabtu & Minggu: Tutup
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div>
                            <div className="mb-8">
                                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Lokasi Kantor</h2>
                                <p className="text-gray-600 dark:text-gray-400">Temukan lokasi kantor kami di peta</p>
                            </div>

                            <div className="aspect-[4/3] overflow-hidden rounded-lg">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.751558976585!2d112.68889814699988!3d-7.915499675725882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62b002ece0c6d%3A0x2d6a49bb617334ff!2sPerumahan%20Bumi%20Bandara!5e0!3m2!1sid!2sid!4v1758022107664!5m2!1sid!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Lokasi Arsa Cendekia"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
