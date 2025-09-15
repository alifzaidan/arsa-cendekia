import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Magnetic } from '@/components/ui/magnetic';
import { Link } from '@inertiajs/react';
import { GalleryVerticalEnd, Star } from 'lucide-react';
import { useRef, useState } from 'react';

type Category = {
    id: string;
    name: string;
};

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    slug: string;
    strikethrough_price: number;
    price: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: Category;
}

interface CourseProps {
    categories: Category[];
    courses: Course[];
    myCourseIds: string[];
}

export default function CoursesSection({ categories, courses, myCourseIds }: CourseProps) {
    const [level, setLevel] = useState('all');
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

    const filteredCourses = courses.filter((course) => {
        const matchSearch = course.title.toLowerCase().includes(search.toLowerCase());
        const matchLevel = level === 'all' ? true : course.level === level;
        const matchCategory = selectedCategory === null ? true : course.category.id === selectedCategory;
        return matchSearch && matchLevel && matchCategory;
    });

    const visibleCourses = filteredCourses.slice(0, visibleCount);

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-20" id="course">
            <h2 className="mx-auto mb-4 max-w-3xl text-center text-3xl font-bold text-gray-900 md:text-4xl">Kelas Terbaik Kami</h2>
            <p className="mx-auto mb-8 text-center text-gray-600 dark:text-gray-400">
                Jelajahi berbagai materi kelas berupa video lerning dan try out yang dapat Anda akses lifetime.
            </p>
            <div className="mb-4 flex justify-between gap-2">
                <Input type="search" placeholder="Cari kelas..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Filter Tingkat Kesulitan</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Pilih Tingkat Kesulitan</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={level} onValueChange={setLevel}>
                            <DropdownMenuRadioItem value="all">Semua</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="beginner">Beginner</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="intermediate">Intermediate</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="advanced">Advanced</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                {visibleCourses.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                        <img src="/assets/images/not-found.webp" alt="Kelas Belum Tersedia" className="w-48" />
                        <div className="text-center text-gray-500">Belum ada kelas yang tersedia saat ini.</div>
                    </div>
                ) : (
                    visibleCourses.map((course) => {
                        const hasAccess = myCourseIds.includes(course.id);

                        return (
                            <Link
                                key={course.id}
                                href={hasAccess ? `profile/my-courses/${course.slug}` : `/course/${course.slug}`}
                                className="relative overflow-hidden rounded-xl bg-zinc-300/30 shadow-md transition hover:shadow-lg dark:bg-zinc-700/30"
                            >
                                <div className="bg-sidebar relative flex h-full w-full flex-col items-center justify-between rounded-lg p-4 dark:bg-zinc-800">
                                    <div className="w-full overflow-hidden rounded-lg">
                                        <div className="relative">
                                            <img
                                                src={course.thumbnail ? `/storage/${course.thumbnail}` : '/assets/images/placeholder.png'}
                                                alt={course.title}
                                                className="h-48 w-full rounded-lg object-cover"
                                            />
                                            <span className="absolute top-2 left-2 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                                {course.category.name}
                                            </span>
                                        </div>
                                        <h2 className="mt-2 text-left text-lg font-bold">{course.title}</h2>
                                        <div className="my-2 flex justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <Star size={16} className="text-yellow-500" fill="currentColor" />
                                                <span className="font-semibold text-yellow-500">5.0</span>
                                            </div>
                                        </div>

                                        {hasAccess ? (
                                            <p className="text-primary text-left text-lg font-semibold">Anda sudah memiliki akses</p>
                                        ) : course.price === 0 ? (
                                            <p className="text-left text-lg font-semibold text-green-600 dark:text-green-400">Gratis</p>
                                        ) : (
                                            <div className="text-left font-semibold">
                                                {course.strikethrough_price > 0 && (
                                                    <p className="text-sm text-red-500 line-through">
                                                        Rp {course.strikethrough_price.toLocaleString('id-ID')}
                                                    </p>
                                                )}
                                                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                    Rp {course.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
            {visibleCount < filteredCourses.length && (
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
