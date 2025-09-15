import { CircleCheck } from 'lucide-react';

interface Webinar {
    description?: string | null;
    tools?: { name: string; description?: string | null; icon: string | null }[];
    benefits?: string | null;
}

function parseList(items?: string | null): string[] {
    if (!items) return [];
    const matches = items.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [];
    return matches.map((li) => li.replace(/<\/?li>/g, '').trim());
}

export default function AboutSection({ webinar }: { webinar: Webinar }) {
    const benefitList = parseList(webinar.benefits);

    return (
        <section className="mx-auto mt-8 grid w-full max-w-5xl grid-cols-1 gap-8 px-4 lg:grid-cols-2">
            <div>
                <h3 className="text-lg font-semibold">Tools</h3>
                <div className="mt-2 flex flex-col gap-2">
                    {webinar.tools?.map((tool) => (
                        <div key={tool.name} className="flex w-full items-center gap-2">
                            <img src={tool.icon ? `/storage/${tool.icon}` : '/assets/images/placeholder.png'} alt={tool.name} className="w-16" />
                            <h3 className="text-xl font-semibold">{tool.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
            <div className="order-first lg:order-last">
                <div>
                    <h3 className="text-lg font-semibold">Tentang Kelas</h3>
                    <p className="text-primary mt-2">{webinar.description}</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Poin Utama</h3>
                    <ul className="mt-2 flex flex-col gap-2">
                        {benefitList.map((req, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                <CircleCheck className="text-primary mt-1 h-5 min-w-5" />
                                <p>{req}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
