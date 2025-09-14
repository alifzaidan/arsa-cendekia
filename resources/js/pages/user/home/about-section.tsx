import { Separator } from '@/components/ui/separator';
import { FileText, GraduationCap, Lightbulb } from 'lucide-react';

export default function AboutSection() {
    return (
        <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-12 lg:space-y-8 lg:py-16">
            <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2">
                <div>
                    <span className="text-sm font-medium tracking-wide text-gray-600 uppercase">Tentang</span>
                    <h2 className="mt-2 text-4xl font-bold text-black">Sekilas Tentang Kami</h2>
                </div>
                <div>
                    <p className="text-base leading-relaxed font-medium text-gray-700">
                        Arsa Cendekia merupakan perusahaan yang terfokus pada pelatihan dan sertifikasi di bidang perpajakan dan akuntansi. Arsa
                        Cendekia menyediakan bimbingan belajar dan riset pendidikan.
                    </p>
                </div>
            </div>

            <Separator className="" />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="group hover:from-primary hover:to-tertiary rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:bg-gradient-to-br hover:text-white">
                    <div className="mb-4 flex items-center">
                        <div className="bg-primary mr-3 rounded-full p-2 transition-colors duration-300 group-hover:bg-white">
                            <FileText className="group-hover:text-primary h-5 w-5 text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-lg font-bold text-black transition-colors duration-300 group-hover:text-white">
                            Bank Soal dan Bimbingan
                        </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-200">
                        Pelatihan online untuk siswa SMA/SMK dalam persiapan ujian nasional maupun PTN. Kami juga menyediakan bank soal dan latihan
                        khusus untuk mempersiapkan siswa menghadapi Tes Kemampuan Akademik (TKA).
                    </p>
                </div>

                <div className="group hover:from-primary hover:to-tertiary rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:bg-gradient-to-br hover:text-white">
                    <div className="mb-4 flex items-center">
                        <div className="bg-primary mr-3 rounded-full p-2 transition-colors duration-300 group-hover:bg-white">
                            <Lightbulb className="group-hover:text-primary h-5 w-5 text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-lg font-bold text-black transition-colors duration-300 group-hover:text-white">Bimbingan Riset</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-200">
                        Bimbingan online untuk Mahasiswa dalam Mengerjakan Riset/Skripsi dengan memberikan bimbingan komprehensif dan tips efisien
                        dalam menyelesaikan tugas akhir mereka.
                    </p>
                </div>

                <div className="group hover:from-primary hover:to-tertiary rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:bg-gradient-to-br hover:text-white">
                    <div className="mb-4 flex items-center">
                        <div className="bg-primary mr-3 rounded-full p-2 transition-colors duration-300 group-hover:bg-white">
                            <GraduationCap className="group-hover:text-primary h-5 w-5 text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-lg font-bold text-black transition-colors duration-300 group-hover:text-white">
                            Pelatihan dan Sertifikasi
                        </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-200">
                        Pelatihan online yang mendalam tentang peraturan perpajakan, termasuk pemahaman tentang berbagai jenis Ter (A, B, dan C) serta
                        studi kasus yang relevan dalam pelatihan Coretax. Selain itu kami menyediakan pelatihan Zahir Accounting.
                    </p>
                </div>
            </div>
        </section>
    );
}
