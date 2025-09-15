import { CircleCheck } from 'lucide-react';
import ModulesSection from './modules-section';

interface Course {
    title: string;
    description?: string | null;
    key_points?: string | null;
    user?: { name: string; bio: string | null };
    images?: { image_url: string }[];
    tools?: { name: string; description?: string | null; icon: string | null }[];
    modules?: {
        title: string;
        description?: string | null;
        lessons?: {
            title: string;
            description?: string | null;
            type: 'text' | 'video' | 'file' | 'quiz';
            is_free?: boolean;
        }[];
    }[];
}

function parseList(items?: string | null): string[] {
    if (!items) return [];
    const matches = items.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [];
    return matches.map((li) => li.replace(/<\/?li>/g, '').trim());
}

export default function AboutSection({ course }: { course: Course }) {
    const keyPoints = parseList(course.key_points);

    return (
        <section className="mx-auto mt-8 grid w-full max-w-7xl grid-cols-1 gap-8 px-4 lg:grid-cols-2">
            <ModulesSection course={course} />
            <div className="order-first lg:order-last">
                <div>
                    <h3 className="text-lg font-semibold">Tentang Kelas</h3>
                    <p className="text-primary mt-2">{course.description}</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Poin Utama</h3>
                    <ul className="mt-2 flex flex-col gap-2">
                        {keyPoints.map((req, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                <CircleCheck className="text-primary mt-1 h-5 min-w-5" />
                                <p>{req}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Tools</h3>
                    <div className="mt-2 flex flex-col gap-2">
                        {course.tools?.map((tool) => (
                            <div key={tool.name} className="flex w-full items-center gap-2">
                                <img src={tool.icon ? `/storage/${tool.icon}` : '/assets/images/placeholder.png'} alt={tool.name} className="w-12" />
                                <h3 className="text-lg font-semibold">{tool.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
