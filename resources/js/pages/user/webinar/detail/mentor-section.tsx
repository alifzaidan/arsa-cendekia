import { User } from 'lucide-react';

interface Webinar {
    host_name?: string | null;
    host_description?: string | null;
}

export default function MentorSection({ webinar }: { webinar: Webinar }) {
    return (
        <section className="mx-auto mt-8 w-full max-w-5xl px-4">
            <h1 className="mb-4 text-center text-2xl font-bold sm:text-3xl">Pemateri</h1>

            <div className="mx-auto flex w-fit items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-md dark:border-zinc-700 dark:bg-zinc-800">
                <div className="rounded-full bg-gray-200 p-2">
                    <User className="h-10 w-10 text-gray-500" />
                </div>
                <div className="w-full">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{webinar.host_name}</h3>
                    </div>
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{webinar.host_description}</p>
                </div>
            </div>
        </section>
    );
}
