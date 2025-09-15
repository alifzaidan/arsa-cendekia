import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ProfileLayout from '@/layouts/profile/layout';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { BookTextIcon, ExternalLink, GraduationCap, MessageCircle, MonitorPlay, Play } from 'lucide-react';

interface Product {
    id: string;
    title: string;
    slug: string;
    type: 'course' | 'webinar';
    progress?: number;
    completed_at?: string;
    start_date?: string;
    end_date?: string;
    start_time?: string;
    end_time?: string;
    group_url?: string;
    enrolled_at: string;
}

interface ProfileProps {
    stats: {
        courses: number;
        webinars: number;
        total: number;
    };
    recentProducts: Product[];
}

export default function Profile({ stats, recentProducts }: ProfileProps) {
    const getProductTypeLabel = (type: string): string => {
        switch (type) {
            case 'course':
                return 'Kelas Online';
            case 'webinar':
                return 'Webinar';
            default:
                return 'Produk';
        }
    };

    const getProductTypeIcon = (type: string) => {
        switch (type) {
            case 'course':
                return <BookTextIcon className="h-4 w-4" />;
            case 'webinar':
                return <MonitorPlay className="h-4 w-4" />;
            default:
                return <GraduationCap className="h-4 w-4" />;
        }
    };

    const getProgressBadge = (progress: number) => {
        if (progress === 100) {
            return <Badge className="border-green-300 bg-green-100 text-green-700">Selesai</Badge>;
        } else if (progress > 0) {
            return <Badge className="border-blue-300 bg-blue-100 text-blue-700">Berlangsung</Badge>;
        } else {
            return <Badge className="border-gray-300 bg-gray-100 text-gray-700">Belum Dimulai</Badge>;
        }
    };

    const formatSchedule = (product: Product): string => {
        if (product.type === 'webinar') {
            const startTime = format(new Date(product.start_time!), 'dd MMM yyyy, HH:mm', { locale: id });
            const endTime = product.end_time ? format(new Date(product.end_time), 'HH:mm', { locale: id }) : '';
            return endTime ? `${startTime} - ${endTime}` : startTime;
        }

        return '-';
    };

    return (
        <UserLayout>
            <Head title="Profil" />
            <ProfileLayout>
                <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 dark:from-indigo-950/40 dark:via-background dark:to-sky-900/10">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-indigo-400/10 blur-2xl dark:bg-indigo-500/10" />
                        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-sky-400/10 blur-2xl dark:bg-sky-500/10" />
                    </div>
                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Dashboard Belajar</h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Pantau progres dan aktivitas pembelajaran Anda.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 rounded-lg border bg-white/60 px-4 py-2 text-sm shadow-sm backdrop-blur dark:bg-white/5">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                <span className="font-medium">{stats.total} Total</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border bg-white/60 px-4 py-2 text-sm shadow-sm backdrop-blur dark:bg-white/5">
                                <BookTextIcon className="h-4 w-4 text-indigo-500" />
                                <span>{stats.courses} Kelas</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border bg-white/60 px-4 py-2 text-sm shadow-sm backdrop-blur dark:bg-white/5">
                                <MonitorPlay className="h-4 w-4 text-emerald-500" />
                                <span>{stats.webinars} Webinar</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <Heading title="Produk Saya" description="Daftar produk yang telah Anda beli dan ikuti." />
                    <Card className="relative overflow-hidden border bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-4 dark:from-indigo-950/40 dark:via-background dark:to-sky-900/10">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produk</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Jadwal</TableHead>
                                    <TableHead>Status/Progress</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentProducts.length > 0 ? (
                                    recentProducts.map((product) => (
                                        <TableRow key={`${product.type}-${product.id}`}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    {getProductTypeIcon(product.type)}
                                                    <Link
                                                        href={route(`profile.${product.type}.detail`, { [product.type]: product.slug })}
                                                        className="hover:text-primary"
                                                    >
                                                        {product.title}
                                                    </Link>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getProductTypeLabel(product.type)}</TableCell>
                                            <TableCell>
                                                {product.type === 'course' ? (
                                                    <span className="text-gray-500">Belajar Mandiri</span>
                                                ) : (
                                                    formatSchedule(product)
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {product.type === 'course' ? (
                                                    <div className="space-y-2">
                                                        {getProgressBadge(product.progress || 0)}
                                                        <div className="flex items-center gap-2">
                                                            <Progress value={product.progress || 0} className="w-20" />
                                                            <span className="text-xs text-gray-500">{product.progress || 0}%</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                                        Terdaftar
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {product.type === 'course' ? (
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={route('profile.course.detail', { course: product.slug })}>
                                                                <Play className="mr-1 h-4 w-4" />
                                                                Belajar
                                                            </Link>
                                                        </Button>
                                                    ) : (
                                                        <>
                                                            <Button asChild size="sm" variant="outline">
                                                                <Link
                                                                    href={route(`profile.${product.type}.detail`, { [product.type]: product.slug })}
                                                                >
                                                                    <ExternalLink className="mr-1 h-4 w-4" />
                                                                    Detail
                                                                </Link>
                                                            </Button>
                                                            {product.group_url && (
                                                                <Button asChild size="sm" variant="default">
                                                                    <a href={product.group_url} target="_blank" rel="noopener noreferrer">
                                                                        <MessageCircle className="mr-1 h-4 w-4" />
                                                                        Grup WA
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-8 text-center">
                                            <div className="text-gray-500">
                                                <GraduationCap className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                                <p>Belum ada produk yang dibeli.</p>
                                                <Button asChild className="mt-4" variant="outline">
                                                    <Link href={route('course.index')}>Jelajahi Kelas</Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </ProfileLayout>
        </UserLayout>
    );
}
