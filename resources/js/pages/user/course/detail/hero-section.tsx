import { Button } from '@/components/ui/button';

interface Course {
    title: string;
    short_description?: string | null;
    level: 'beginner' | 'intermediate' | 'advanced';
    thumbnail?: string | null;
    created_at: string;
    updated_at: string;
}

export default function HeroSection({ course }: { course: Course }) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-12 text-center">
            <div>
                <h1 className="mx-auto mb-4 max-w-2xl text-4xl leading-tight font-bold sm:text-5xl">{course.title}</h1>

                <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">{course.short_description}</p>

                <p className="mx-auto mb-6 w-fit rounded-full border px-3 py-1 text-sm font-medium text-gray-500">
                    Terakhir diperbarui{' '}
                    {new Date(course.updated_at).toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </p>

                <img
                    src={course.thumbnail ? `/storage/${course.thumbnail}` : '/assets/images/placeholder.png'}
                    alt={course.title}
                    className="mb-6 w-full max-w-2xl rounded-lg border border-gray-200 shadow-md"
                />

                <a href="#register">
                    <Button className="w-full">Gabung Sekarang</Button>
                </a>
            </div>
        </section>
    );
}
