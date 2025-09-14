export default function FeatureSection() {
    return (
        <section className="to-tertiary from-primary my-8 w-full bg-gradient-to-r">
            <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-8 lg:space-y-16 lg:py-16">
                <div className="text-left md:text-center">
                    <h2 className="mx-auto mb-4 text-3xl font-bold text-white md:text-4xl">Mengapa Memilih Kami</h2>
                    <p className="mx-auto max-w-4xl text-sm text-zinc-200 md:text-base">
                        CV Arsa Cendekia merupakan perusahaan yang terfokus pada pelatihan dan sertifikasi di bidang perpajakan dan akuntansi. Kami
                        juga menyediakan bimbingan belajar dan riset pendidikan untuk siswa SMA hingga mahasiswa.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
                    <div className="relative flex w-full flex-col items-center rounded-xl bg-white px-6 pt-10 pb-8 shadow-lg">
                        <div className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-yellow-400 shadow-md">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#fff" />
                            </svg>
                        </div>
                        <h3 className="text-primary mt-2 text-center text-lg font-bold">Mentor yang Expert</h3>
                        <p className="mt-1 text-center text-sm text-zinc-700">Pembelajaran lebih nyaman dengan mentor terpercaya</p>
                    </div>

                    <div className="relative flex w-full flex-col items-center rounded-xl bg-white px-6 pt-10 pb-8 shadow-lg">
                        <div className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-yellow-400 shadow-md">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#fff" />
                            </svg>
                        </div>
                        <h3 className="text-primary mt-2 text-center text-lg font-bold">Materi Terupdate</h3>
                        <p className="mt-1 text-center text-sm text-zinc-700">Kurikulum selalu diperbarui sesuai kebutuhan industri</p>
                    </div>

                    <div className="relative flex w-full flex-col items-center rounded-xl bg-white px-6 pt-10 pb-8 shadow-lg">
                        <div className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-yellow-400 shadow-md">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#fff" />
                            </svg>
                        </div>
                        <h3 className="text-primary mt-2 text-center text-lg font-bold">Akses Fleksibel</h3>
                        <p className="mt-1 text-center text-sm text-zinc-700">Belajar kapan saja dan di mana saja tanpa batasan waktu</p>
                    </div>

                    <div className="relative flex w-full flex-col items-center rounded-xl bg-white px-6 pt-10 pb-8 shadow-lg">
                        <div className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-yellow-400 shadow-md">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#fff" />
                            </svg>
                        </div>
                        <h3 className="text-primary mt-2 text-center text-lg font-bold">Sertifikat Resmi</h3>
                        <p className="mt-1 text-center text-sm text-zinc-700">Dapatkan sertifikat setelah menyelesaikan pelatihan</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
