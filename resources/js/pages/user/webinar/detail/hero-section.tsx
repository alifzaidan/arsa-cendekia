import { Button } from '@/components/ui/button';

interface Webinar {
    title: string;
    thumbnail?: string | null;
    description?: string | null;
    start_time: string;
    end_time: string;
    created_at: string | Date;
}

export default function HeroSection({ webinar }: { webinar: Webinar }) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-12 text-center">
            <div>
                <h1 className="mx-auto mb-4 max-w-2xl text-4xl leading-tight font-bold sm:text-5xl">{webinar.title}</h1>

                <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">{webinar.description}</p>

                <p className="mx-auto mb-6 w-fit rounded-full border px-3 py-1 text-sm font-medium text-gray-500">
                    Dipublikasikan pada{' '}
                    {new Date(webinar.created_at).toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </p>

                <img
                    src={webinar.thumbnail ? `/storage/${webinar.thumbnail}` : '/assets/images/placeholder.png'}
                    alt={webinar.title}
                    className="mb-6 w-full max-w-2xl rounded-lg border border-gray-200 shadow-md"
                />

                <a href="#register">
                    <Button className="w-full">Daftar Sekarang</Button>
                </a>
            </div>
        </section>
    );
}
