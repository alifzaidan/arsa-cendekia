import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';

export default function TermsAndConditions() {
    return (
        <UserLayout>
            <Head title="Syarat dan Ketentuan" />

            <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                        <div className="mb-8 text-center">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Syarat dan Ketentuan</h1>
                            <p className="text-gray-600 dark:text-gray-400">Terakhir diperbarui: 16 September 2025</p>
                        </div>

                        <div className="prose prose-gray dark:prose-invert max-w-none">
                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">1. Pendahuluan</h2>
                                <p className="mb-4 text-gray-700 dark:text-gray-300">
                                    Selamat datang di Arsa Cendekia. CV. Arsa Cendekia berdiri sejak tahun 2024 sebagai perusahaan yang terfokus pada
                                    pelatihan dan sertifikasi di bidang perpajakan dan akuntansi, serta menyediakan bimbingan belajar dan riset
                                    pendidikan untuk siswa SMA hingga mahasiswa.
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Dengan mengakses dan menggunakan platform Arsa Cendekia, Anda menyetujui untuk terikat dengan syarat dan ketentuan
                                    ini. Jika Anda tidak menyetujui syarat dan ketentuan ini, mohon untuk tidak menggunakan layanan kami.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">2. Definisi</h2>
                                <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>
                                        <strong>Platform:</strong> Website dan aplikasi Arsa Cendekia yang dapat diakses melalui arsacendekia.co.id
                                    </li>
                                    <li>
                                        <strong>Pengguna:</strong> Setiap individu yang mengakses atau menggunakan platform kami
                                    </li>
                                    <li>
                                        <strong>Kelas Online:</strong> Kursus pembelajaran digital dalam bidang perpajakan, akuntansi, dan mata
                                        pelajaran akademik
                                    </li>
                                    <li>
                                        <strong>Webinar:</strong> Seminar online interaktif dengan waktu terjadwal
                                    </li>
                                    <li>
                                        <strong>Tryout:</strong> Simulasi ujian online untuk persiapan ujian nasional dan Tes Kemampuan Akademik (TKA)
                                    </li>
                                    <li>
                                        <strong>Pelatihan Coretax:</strong> Program sertifikasi perpajakan yang mencakup berbagai jenis Ter (A, B, dan
                                        C)
                                    </li>
                                    <li>
                                        <strong>Zahir Accounting:</strong> Program pelatihan software akuntansi dengan tingkat Basic dan Intermediate
                                    </li>
                                    <li>
                                        <strong>Bimbingan Skripsi:</strong> Layanan konsultasi dan bimbingan untuk penyelesaian tugas akhir mahasiswa
                                    </li>
                                    <li>
                                        <strong>Konten:</strong> Semua materi pembelajaran termasuk video, teks, soal tryout, dan file pendukung
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">3. Pendaftaran Akun</h2>
                                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                    <p>
                                        Untuk menggunakan layanan tertentu, Anda perlu membuat akun dengan memberikan informasi yang akurat dan
                                        lengkap.
                                    </p>
                                    <p>Anda bertanggung jawab untuk:</p>
                                    <ul className="ml-4 list-inside list-disc space-y-1">
                                        <li>Menjaga kerahasiaan informasi akun Anda</li>
                                        <li>Memastikan informasi yang diberikan akurat dan terkini</li>
                                        <li>Memberi tahu kami jika terjadi penggunaan akun yang tidak sah</li>
                                        <li>Tidak membagikan akun kepada pihak lain</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">4. Layanan Kami</h2>
                                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                    <div>
                                        <h3 className="mb-2 font-semibold">4.1 Pelatihan Perpajakan dan Akuntansi</h3>
                                        <ul className="ml-4 list-inside list-disc space-y-1">
                                            <li>Pelatihan Coretax dengan studi kasus berbagai jenis Ter (A, B, dan C)</li>
                                            <li>Sertifikasi Zahir Accounting Basic dan Intermediate</li>
                                            <li>Webinar perpajakan dan akuntansi terkini</li>
                                            <li>Akses seumur hidup untuk kelas yang telah dibeli</li>
                                            <li>Update materi sesuai perubahan regulasi</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="mb-2 font-semibold">4.2 Bimbingan Akademik</h3>
                                        <ul className="ml-4 list-inside list-disc space-y-1">
                                            <li>
                                                Bimbingan belajar siswa SMA/SMK untuk mata pelajaran Bahasa Indonesia, Matematika, dan Bahasa Inggris
                                            </li>
                                            <li>Bank soal dan latihan persiapan ujian nasional</li>
                                            <li>Tryout dan simulasi Tes Kemampuan Akademik (TKA)</li>
                                            <li>Bimbingan online skripsi untuk mahasiswa</li>
                                            <li>Konsultasi riset dan metodologi penelitian</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="mb-2 font-semibold">4.3 Platform Pembelajaran</h3>
                                        <ul className="ml-4 list-inside list-disc space-y-1">
                                            <li>Kelas online dengan video pembelajaran berkualitas</li>
                                            <li>Webinar interaktif dengan pembicara ahli</li>
                                            <li>Tryout online dengan sistem penilaian otomatis</li>
                                            <li>Forum diskusi dan tanya jawab</li>
                                            <li>Sertifikat digital untuk program yang telah diselesaikan</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">5. Pembayaran dan Pengembalian Dana</h2>
                                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                    <div>
                                        <h3 className="mb-2 font-semibold">5.1 Pembayaran</h3>
                                        <ul className="ml-4 list-inside list-disc space-y-1">
                                            <li>Semua pembayaran dilakukan dalam mata uang Rupiah (IDR)</li>
                                            <li>Pembayaran dapat dilakukan melalui berbagai metode yang tersedia</li>
                                            <li>Akses ke layanan diberikan setelah pembayaran dikonfirmasi</li>
                                            <li>Biaya sertifikasi termasuk dalam paket pelatihan</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="mb-2 font-semibold">5.2 Kebijakan Pengembalian Dana</h3>
                                        <ul className="ml-4 list-inside list-disc space-y-1">
                                            <li>Pengembalian dana dapat dilakukan dalam 7 hari setelah pembelian</li>
                                            <li>Syarat: belum mengakses lebih dari 20% materi kelas atau belum mengikuti tryout</li>
                                            <li>Untuk webinar: pengembalian dana 100% jika dibatalkan sebelum acara dimulai</li>
                                            <li>Untuk bimbingan skripsi: pengembalian dana sesuai progress konsultasi yang telah dilakukan</li>
                                            <li>Proses pengembalian dana akan diproses dalam 7-14 hari kerja</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">6. Hak Kekayaan Intelektual</h2>
                                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                    <p>Semua konten yang tersedia di platform ini, termasuk namun tidak terbatas pada:</p>
                                    <ul className="ml-4 list-inside list-disc space-y-1">
                                        <li>Video pembelajaran perpajakan dan akuntansi</li>
                                        <li>Materi pelatihan Coretax dan Zahir Accounting</li>
                                        <li>Bank soal dan tryout TKA</li>
                                        <li>Slide presentasi webinar</li>
                                        <li>Template dan panduan bimbingan skripsi</li>
                                        <li>Logo dan merek dagang Arsa Cendekia</li>
                                    </ul>
                                    <p>Adalah milik Arsa Cendekia atau pembuat konten yang berlisensi kepada kami. Pengguna dilarang untuk:</p>
                                    <ul className="ml-4 list-inside list-disc space-y-1">
                                        <li>Mendistribusikan konten pembelajaran tanpa izin</li>
                                        <li>Menyalin atau membagikan soal tryout</li>
                                        <li>Menggunakan materi untuk keperluan komersial</li>
                                        <li>Memodifikasi atau mengubah konten sertifikasi</li>
                                        <li>Membagikan akses akun kepada pihak lain</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">7. Kewajiban dan Larangan Pengguna</h2>
                                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                    <p>Pengguna setuju untuk:</p>
                                    <ul className="ml-4 list-inside list-disc space-y-1">
                                        <li>Menggunakan platform sesuai dengan tujuan pembelajaran</li>
                                        <li>Menghormati hak pengguna lain</li>
                                        <li>Tidak melakukan tindakan yang dapat merusak platform</li>
                                        <li>Mematuhi semua hukum yang berlaku</li>
                                    </ul>
                                    <p>Pengguna dilarang untuk:</p>
                                    <ul className="ml-4 list-inside list-disc space-y-1">
                                        <li>Menggunakan platform untuk tujuan ilegal</li>
                                        <li>Mengunggah konten yang melanggar hukum</li>
                                        <li>Melakukan spam atau tindakan yang mengganggu</li>
                                        <li>Mencoba mengakses sistem tanpa otorisasi</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">8. Privasi dan Perlindungan Data</h2>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Penggunaan data pribadi Anda diatur dalam{' '}
                                    <Link href={route('privacy-policy')} className="text-blue-600 underline hover:text-blue-800">
                                        Kebijakan Privasi
                                    </Link>{' '}
                                    kami. Dengan menggunakan layanan ini, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan
                                    tersebut.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">9. Pembatasan Tanggung Jawab</h2>
                                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                    <p>Arsa Cendekia tidak bertanggung jawab atas:</p>
                                    <ul className="ml-4 list-inside list-disc space-y-1">
                                        <li>Gangguan teknis atau pemadaman server</li>
                                        <li>Kehilangan data akibat kesalahan pengguna</li>
                                        <li>Kerugian finansial yang timbul dari penggunaan platform</li>
                                        <li>Ketidakakuratan informasi yang disediakan oleh pihak ketiga</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">10. Perubahan Syarat dan Ketentuan</h2>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku efektif setelah dipublikasikan
                                    di halaman ini. Pengguna dianjurkan untuk memeriksa halaman ini secara berkala untuk mengetahui perubahan terbaru.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">11. Hukum yang Berlaku</h2>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia.
                                    Setiap sengketa akan diselesaikan melalui pengadilan yang berwenang di Indonesia.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">12. Hubungi Kami</h2>
                                <div className="text-gray-700 dark:text-gray-300">
                                    <p className="mb-3">
                                        Jika Anda memiliki pertanyaan mengenai syarat dan ketentuan ini, silakan hubungi kami melalui:
                                    </p>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                        <p>
                                            <strong>CV. Arsa Cendekia</strong>
                                        </p>
                                        <p>Email: arsacendekia@gmail.com</p>
                                        <p>WhatsApp: +6282241477053</p>
                                        <p>
                                            Alamat: Perumahan Bumi Bandara Blok C7, No.6 Kec. Singosari, Kab. Malang
                                            <br />
                                            Prov. Jawa Timur
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-8 text-center dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Dengan menggunakan layanan Arsa Cendekia, Anda menyetujui syarat dan ketentuan di atas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
