import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { User } from 'lucide-react';

const testimonies = [
    {
        name: 'Rina S.',
        text: 'Pelatihannya sangat membantu saya memahami perpajakan dengan mudah. Mentor ramah dan profesional!',
        job: 'Mahasiswa Akuntansi',
    },
    {
        name: 'Budi P.',
        text: 'Materi yang diberikan sangat relevan dengan kebutuhan industri. Saya jadi lebih percaya diri.',
        job: 'Staf Keuangan',
    },
    {
        name: 'Siti L.',
        text: 'Akses fleksibel membuat saya bisa belajar di sela-sela kesibukan kerja. Sangat direkomendasikan!',
        job: 'Karyawan Swasta',
    },
    {
        name: 'Andi M.',
        text: 'Sertifikat resmi dari Arsa Cendekia sangat membantu karir saya di bidang perpajakan.',
        job: 'Konsultan Pajak',
    },
    {
        name: 'Dewi T.',
        text: 'Mentor yang expert dan materi terupdate membuat saya cepat paham dan siap menghadapi ujian.',
        job: 'Mahasiswa',
    },
];

const userBgColors = ['bg-primary/20', 'bg-yellow-200', 'bg-green-200', 'bg-pink-200', 'bg-blue-200', 'bg-purple-200'];

export default function TestimonySection() {
    return (
        <section className="mx-auto w-full space-y-6 lg:space-y-12 lg:py-8">
            <div className="px-4 text-left md:text-center">
                <h2 className="mx-auto mb-4 text-3xl font-bold md:text-4xl">Testimoni Alumni</h2>
                <p className="mx-auto max-w-4xl text-sm text-gray-500 md:text-base">
                    Berikut adalah beberapa testimoni dari alumni yang telah mengikuti pelatihan di Arsa Cendekia.
                </p>
            </div>
            <div className="mt-8">
                <InfiniteSlider gap={24} speed={0.5} className="w-full">
                    {testimonies.map((item, idx) => (
                        <div
                            key={idx}
                            className="m-2 flex max-w-xs min-w-[300px] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800"
                        >
                            <div
                                className={`${userBgColors[idx % userBgColors.length]} mb-3 flex h-12 w-12 items-center justify-center rounded-full`}
                            >
                                <User className="text-primary h-7 w-7" />
                            </div>
                            <p className="mb-2 text-center text-base text-gray-700 italic">"{item.text}"</p>
                            <div className="mt-2 text-center">
                                <span className="text-primary block font-semibold">{item.name}</span>
                                <span className="block text-xs text-gray-500">{item.job}</span>
                            </div>
                        </div>
                    ))}
                </InfiniteSlider>
            </div>
        </section>
    );
}
