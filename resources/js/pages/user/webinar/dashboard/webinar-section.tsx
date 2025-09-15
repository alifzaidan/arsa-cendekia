import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Magnetic } from '@/components/ui/magnetic';
import { Link } from '@inertiajs/react';
import { Calendar, GalleryVerticalEnd } from 'lucide-react';
import { useRef, useState } from 'react';

type Category = {
    id: string;
    name: string;
};

interface Webinar {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    slug: string;
    strikethrough_price: number;
    price: number;
    start_time: string;
    category: Category;
}

interface WebinarProps {
    categories: Category[];
    webinars: Webinar[];
    myWebinarIds: string[];
}

export default function WebinarSection({ categories, webinars, myWebinarIds }: WebinarProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(6);
    const categoryRef = useRef<HTMLDivElement | null>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        startX.current = e.pageX - (categoryRef.current?.offsetLeft ?? 0);
        scrollLeft.current = categoryRef.current?.scrollLeft ?? 0;
    };

    const handleMouseLeave = () => {
        isDragging.current = false;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !categoryRef.current) return;
        e.preventDefault();
        const x = e.pageX - categoryRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5; // scroll speed
        categoryRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const filteredWebinar = webinars.filter((webinar) => {
        const matchSearch = webinar.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory = selectedCategory === null ? true : webinar.category.id === selectedCategory;
        return matchSearch && matchCategory;
    });

    const visibleWebinars = filteredWebinar.slice(0, visibleCount);

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-20" id="webinar">
            <h2 className="mx-auto mb-4 max-w-3xl text-center text-3xl font-bold text-gray-900 md:text-4xl">Webinar Terbaik Kami</h2>
            <p className="mx-auto mb-8 text-center text-gray-600 dark:text-gray-400">
                Ikuti berbagai webinar interaktif yang dipandu oleh para ahli di bidangnya untuk memperdalam pengetahuan Anda.
            </p>
            <div className="mb-4 flex">
                <Input type="search" placeholder="Cari webinar..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div
                className="mb-4 overflow-x-auto"
                ref={categoryRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ scrollbarWidth: 'none', cursor: isDragging.current ? 'grabbing' : 'grab' }}
            >
                <div className="flex w-max flex-nowrap gap-2 select-none">
                    <button
                        type="button"
                        onClick={() => setSelectedCategory(null)}
                        className={`rounded-full border px-4 py-2 text-sm transition hover:cursor-pointer ${
                            selectedCategory === null
                                ? 'to-primary text-primary-foreground border-primary bg-gradient-to-br from-black'
                                : 'hover:bg-accent dark:hover:bg-primary/10 bg-background border-gray-300 text-gray-800 dark:border-zinc-100/20 dark:bg-zinc-800 dark:text-zinc-100'
                        } `}
                    >
                        Semua Kategori
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => setSelectedCategory(category.id)}
                            className={`rounded-full border px-4 py-2 text-sm transition hover:cursor-pointer ${
                                selectedCategory === category.id
                                    ? 'to-primary text-primary-foreground border-primary bg-gradient-to-br from-black'
                                    : 'hover:bg-accent dark:hover:bg-primary/10 bg-background border-gray-300 text-gray-800 dark:border-zinc-100/20 dark:bg-zinc-800 dark:text-zinc-100'
                            } `}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleWebinars.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                        <img src="/assets/images/not-found.webp" alt="Webinar Belum Tersedia" className="w-48" />
                        <div className="text-center text-gray-500">Belum ada webinar yang tersedia saat ini.</div>
                    </div>
                ) : (
                    visibleWebinars.map((webinar) => {
                        const hasAccess = myWebinarIds.includes(webinar.id);

                        return (
                            <Link
                                key={webinar.id}
                                href={hasAccess ? `profile/my-webinars/${webinar.slug}` : `/webinar/${webinar.slug}`}
                                className="relative overflow-hidden rounded-xl bg-zinc-300/30 shadow-md transition hover:shadow-lg dark:bg-zinc-700/30"
                            >
                                <div className="bg-sidebar relative flex h-full w-full flex-col items-center justify-between rounded-lg p-4 dark:bg-zinc-800">
                                    <div className="w-full overflow-hidden rounded-lg">
                                        <div className="relative">
                                            <img
                                                src={webinar.thumbnail ? `/storage/${webinar.thumbnail}` : '/assets/images/placeholder.png'}
                                                alt={webinar.title}
                                                className="h-48 w-full rounded-lg object-cover"
                                            />
                                            <span className="absolute top-2 left-2 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                                {webinar.category.name}
                                            </span>
                                        </div>
                                        <h2 className="my-2 text-left text-lg font-bold">{webinar.title}</h2>

                                        {hasAccess ? (
                                            <p className="text-primary text-left text-lg font-semibold">Anda sudah memiliki akses</p>
                                        ) : webinar.price === 0 ? (
                                            <p className="text-left text-lg font-semibold text-green-600 dark:text-green-400">Gratis</p>
                                        ) : (
                                            <div className="text-left font-semibold">
                                                {webinar.strikethrough_price > 0 && (
                                                    <p className="text-sm text-red-500 line-through">
                                                        Rp {webinar.strikethrough_price.toLocaleString('id-ID')}
                                                    </p>
                                                )}
                                                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                    Rp {webinar.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-2 flex items-center gap-2">
                                            <Calendar size="18" />
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(webinar.start_time).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
            {visibleCount < filteredWebinar.length && (
                <div className="mb-8 flex justify-center">
                    <Magnetic>
                        <Button type="button" className="mt-8 hover:cursor-pointer" onClick={() => setVisibleCount((prev) => prev + 6)}>
                            Lihat Lebih Banyak <GalleryVerticalEnd />
                        </Button>
                    </Magnetic>
                </div>
            )}
        </section>
    );
}
