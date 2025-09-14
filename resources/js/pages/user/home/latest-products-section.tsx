import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Calendar, MoveRight, Star } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    title: string;
    thumbnail: string;
    slug: string;
    strikethrough_price: number;
    price: number;
    level?: 'beginner' | 'intermediate' | 'advanced';
    start_date?: string;
    end_date?: string;
    start_time?: string;
    category: Category;
    type: 'course' | 'webinar';
    created_at: string;
}

interface MyProductIds {
    courses: string[];
    webinars: string[];
}

interface LatestProductsProps {
    latestProducts: Product[];
    myProductIds: MyProductIds;
}

export default function LatestProductsSection({ latestProducts, myProductIds }: LatestProductsProps) {
    const safeMyProductIds = {
        courses: myProductIds?.courses || [],
        webinars: myProductIds?.webinars || [],
    };

    const getProductBadge = (type: string) => {
        switch (type) {
            case 'course':
                return (
                    <span className="absolute top-2 right-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        Kelas
                    </span>
                );
            case 'webinar':
                return (
                    <span className="absolute top-2 right-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                        Webinar
                    </span>
                );
            default:
                return null;
        }
    };

    const getCategoryBadge = (category: Category) => {
        if (!category?.name) return null;
        return (
            <span className="absolute top-2 left-2 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                {category.name}
            </span>
        );
    };

    const hasAccess = (product: Product) => {
        switch (product.type) {
            case 'course':
                return safeMyProductIds.courses.includes(product.id);
            case 'webinar':
                return safeMyProductIds.webinars.includes(product.id);
            default:
                return false;
        }
    };

    const getProductUrl = (product: Product) => {
        const hasProductAccess = hasAccess(product);
        switch (product.type) {
            case 'course':
                return hasProductAccess ? `profile/my-courses/${product.slug}` : `/course/${product.slug}`;
            case 'webinar':
                return hasProductAccess ? `profile/my-webinars/${product.slug}` : `/webinar/${product.slug}`;
            default:
                return '#';
        }
    };

    const getDateDisplay = (product: Product) => {
        if (product.type === 'webinar') {
            return (
                <div className="mt-2 flex items-center gap-2">
                    <Calendar size="18" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(product.start_time!).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </div>
            );
        }

        return null;
    };

    const safeLatestProducts = Array.isArray(latestProducts) ? latestProducts : [];
    const availableProducts = safeLatestProducts.filter((product) => !hasAccess(product));

    return (
        <section className="mx-auto w-full max-w-7xl px-4">
            <div className="mx-auto text-center">
                <p className="mx-auto mb-2 font-medium text-gray-500">Produk Kami</p>
                <h2 className="mx-auto mb-8 max-w-2xl text-3xl font-bold md:text-4xl">Jelajahi Produk Terbaru Kami</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(() => {
                        if (safeLatestProducts.length === 0) {
                            return (
                                <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                                    <img src="/assets/images/not-found.webp" alt="Produk Belum Tersedia" className="w-52" />
                                    <div className="text-center text-gray-500">Belum ada produk yang tersedia saat ini.</div>
                                </div>
                            );
                        }

                        if (availableProducts.length === 0) {
                            return (
                                <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                                    <div className="text-center text-lg font-semibold">Anda sudah memiliki akses semua produk terbaru kami.</div>
                                </div>
                            );
                        }

                        return availableProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={getProductUrl(product)}
                                className="relative overflow-hidden rounded-xl bg-zinc-300/30 shadow-md transition hover:shadow-lg dark:bg-zinc-700/30"
                            >
                                <div className="bg-sidebar relative flex h-full w-full flex-col items-center justify-between rounded-lg p-4 dark:bg-zinc-800">
                                    <div className="w-full overflow-hidden rounded-lg">
                                        <div className="relative">
                                            <img
                                                src={product.thumbnail ? `/storage/${product.thumbnail}` : '/assets/images/placeholder.png'}
                                                alt={product.title}
                                                className="h-48 w-full rounded-lg object-cover"
                                            />
                                            {getProductBadge(product.type)}
                                            {getCategoryBadge(product.category)}
                                        </div>
                                        <h2 className="mt-2 text-left text-lg font-bold">{product.title}</h2>
                                        <div className="my-2 flex justify-between">
                                            {product.type === 'course' && (
                                                <div className="flex items-center gap-1.5">
                                                    <Star size={16} className="text-yellow-500" fill="currentColor" />
                                                    <span className="font-semibold text-yellow-500">5.0</span>
                                                </div>
                                            )}
                                        </div>

                                        {product.price === 0 ? (
                                            <p className="text-left text-lg font-semibold text-green-600 dark:text-green-400">Gratis</p>
                                        ) : (
                                            <div className="text-left font-semibold">
                                                {product.strikethrough_price > 0 && (
                                                    <p className="text-sm text-red-500 line-through">
                                                        Rp {product.strikethrough_price.toLocaleString('id-ID')}
                                                    </p>
                                                )}
                                                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        )}

                                        {getDateDisplay(product)}
                                    </div>
                                </div>
                            </Link>
                        ));
                    })()}
                </div>
                {availableProducts.length > 0 && (
                    <Button className="my-8" variant="outline" asChild>
                        <Link href="/course">
                            Lihat Semua Produk <MoveRight />
                        </Link>
                    </Button>
                )}
            </div>
        </section>
    );
}
