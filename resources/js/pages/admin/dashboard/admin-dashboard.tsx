import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, ChartNoAxesGantt, ChevronDownIcon, DollarSign, Euro, Filter, Sparkles, TrendingDown, TrendingUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ParticipantChart } from './charts/participant-chart';
import { RevenueChart } from './charts/revenue-chart';

interface RecentSale {
    id: number | string;
    user: { name: string };
    nett_amount: number;
    course_items?: { course: { title: string } }[];
    webinar_items?: { webinar: { title: string } }[];
}
interface PopularProduct {
    id: number | string;
    title: string;
    type: 'course' | 'webinar';
    enrollment_count: number;
    thumbnail?: string;
    price: number;
}
interface MonthlyRevenueData {
    month: string;
    year: number;
    month_year: string;
    total_amount: number;
    transaction_count: number;
}
interface ParticipantData {
    date: string;
    count: number;
    type: 'course' | 'webinar';
}
interface StatsProps {
    stats: {
        total_revenue: number;
        revenue_this_month: number;
        revenue_today: number;
        revenue_yesterday: number;
        revenue_last_month: number;
        daily_revenue_change: number;
        monthly_revenue_change: number;
        total_participants: number;
        participants_this_month: number;
        total_users: number;
        new_users_last_week: number;
        total_mentors: number;
        new_mentors_last_week: number;
        total_affiliates: number;
        new_affiliates_last_week: number;
        total_courses: number;
        total_webinars: number;
        recent_sales: RecentSale[];
        monthly_revenue_data: MonthlyRevenueData[];
        participant_data: ParticipantData[];
        popular_products: PopularProduct[];
        filtered_date_range?: { start: string; end: string } | null;
    };
    filters?: { start_date?: string; end_date?: string };
}

const formatPercentage = (p: number) => `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`;
const getPercentageColor = (p: number) => (p > 0 ? 'text-green-600' : p < 0 ? 'text-red-600' : 'text-gray-600');
const getPercentageIcon = (p: number) =>
    p > 0 ? <TrendingUp className="h-3 w-3" /> : p < 0 ? <TrendingDown className="h-3 w-3" /> : <ChartNoAxesGantt className="h-3 w-3" />;

const formatCurrency = (amount: number | string) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
        typeof amount === 'string' ? parseFloat(amount) : amount,
    );

const getInvoiceItemName = (sale: RecentSale) => {
    if (sale.course_items?.length) return `Kelas: ${sale.course_items[0].course.title}`;
    if (sale.webinar_items?.length) return `Webinar: ${sale.webinar_items[0].webinar.title}`;
    return 'Produk tidak diketahui';
};

const getProductTypeBadge = (type: string) => {
    const styles = {
        course: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
        webinar: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
    };
    const labels = { course: 'Kelas', webinar: 'Webinar' };
    return (
        <Badge variant="secondary" className={styles[type as keyof typeof styles]}>
            {labels[type as keyof typeof labels]}
        </Badge>
    );
};

export default function AdminDashboard({ stats, filters }: StatsProps) {
    const [startDate, setStartDate] = useState<Date | undefined>(() =>
        filters?.start_date ? new Date(filters.start_date + 'T00:00:00') : undefined,
    );
    const [endDate, setEndDate] = useState<Date | undefined>(() => (filters?.end_date ? new Date(filters.end_date + 'T00:00:00') : undefined));
    const [isStartDateOpen, setIsStartDateOpen] = useState(false);
    const [isEndDateOpen, setIsEndDateOpen] = useState(false);

    const handleApplyFilter = () => {
        const params: Record<string, string> = {};
        if (startDate) params.start_date = format(startDate, 'yyyy-MM-dd');
        if (endDate) params.end_date = format(endDate, 'yyyy-MM-dd');
        router.get(route('dashboard'), params, { preserveState: false, preserveScroll: true });
    };
    const handleClearFilter = () => {
        setStartDate(undefined);
        setEndDate(undefined);
        router.get(route('dashboard'), {}, { preserveState: false, preserveScroll: true });
    };
    const hasActiveFilter = startDate && endDate;

    useEffect(() => {
        if (filters?.start_date) {
            const d = new Date(filters.start_date + 'T00:00:00');
            setStartDate(isNaN(d.getTime()) ? undefined : d);
        } else setStartDate(undefined);
        if (filters?.end_date) {
            const d2 = new Date(filters.end_date + 'T00:00:00');
            setEndDate(isNaN(d2.getTime()) ? undefined : d2);
        } else setEndDate(undefined);
    }, [filters?.start_date, filters?.end_date]);

    const topStatsCards = [
        {
            title: 'Total Pendapatan',
            value: formatCurrency(stats.total_revenue),
            icon: <DollarSign className="size-5 text-indigo-600 dark:text-indigo-300" />,
            gradient: 'from-indigo-500/15 via-indigo-400/10 to-sky-400/10',
            subtitle:
                hasActiveFilter && stats.filtered_date_range
                    ? `${stats.filtered_date_range.start} - ${stats.filtered_date_range.end}`
                    : 'Semua periode',
        },
        {
            title: 'Pendapatan Bulan Ini',
            value: formatCurrency(stats.revenue_this_month),
            icon: <Euro className="size-5 text-emerald-600 dark:text-emerald-300" />,
            gradient: 'from-emerald-500/15 via-emerald-400/10 to-teal-400/10',
            percentage: stats.monthly_revenue_change,
            comparison: ` bulan lalu (${formatCurrency(stats.revenue_last_month)})`,
        },
        {
            title: 'Pendapatan Hari Ini',
            value: formatCurrency(stats.revenue_today),
            icon: <TrendingUp className="size-5 text-amber-600 dark:text-amber-300" />,
            gradient: 'from-amber-500/20 via-amber-400/10 to-orange-400/10',
            percentage: stats.daily_revenue_change,
            comparison: ` kemarin (${formatCurrency(stats.revenue_yesterday)})`,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Hero */}
            <div className="dark:via-background relative overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 dark:from-indigo-950/50 dark:to-sky-900/25">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-12 -left-10 h-44 w-44 rounded-full bg-indigo-400/20 blur-2xl dark:bg-indigo-600/25" />
                    <div className="absolute right-0 bottom-0 h-60 w-60 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-700/25" />
                    <div className="absolute top-1/2 left-1/3 h-48 w-48 -translate-y-1/2 rounded-full bg-indigo-300/10 blur-3xl dark:bg-indigo-400/10" />
                </div>
                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            Dashboard Admin
                            <Sparkles className="h-5 w-5 text-indigo-500" />
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">Ringkasan performa platform dan aktivitas terbaru.</p>
                    </div>
                    <div className="flex gap-3 text-xs">
                        <div className="rounded-lg border bg-white/70 px-4 py-2 backdrop-blur dark:bg-white/5">
                            Total Produk: <span className="font-semibold">{stats.total_courses + stats.total_webinars}</span>
                        </div>
                        <div className="rounded-lg border bg-white/70 px-4 py-2 backdrop-blur dark:bg-white/5">
                            Pengguna: <span className="font-semibold">{stats.total_users.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="dark:via-background relative overflow-hidden rounded-xl border bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/60 p-5 dark:from-indigo-950/40 dark:to-sky-900/25">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-4 -left-6 h-24 w-24 rounded-full bg-indigo-400/15 blur-xl dark:bg-indigo-600/25" />
                    <div className="absolute right-4 bottom-2 h-28 w-28 rounded-full bg-sky-400/15 blur-xl dark:bg-sky-600/25" />
                </div>
                <div className="relative flex flex-col gap-4 2xl:flex-row 2xl:items-end">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Filter Pendapatan</label>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn('w-full justify-between sm:w-[180px]', !startDate && 'text-muted-foreground')}
                                    >
                                        <div className="flex items-center">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, 'dd MMM yyyy', { locale: id }) : 'Tanggal mulai'}
                                        </div>
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        captionLayout="dropdown"
                                        onSelect={(d) => {
                                            setStartDate(d);
                                            setIsStartDateOpen(false);
                                        }}
                                        disabled={(d) => d > new Date() || (endDate ? d > endDate : false)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>

                            <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn('w-full justify-between sm:w-[180px]', !endDate && 'text-muted-foreground')}
                                    >
                                        <div className="flex items-center">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, 'dd MMM yyyy', { locale: id }) : 'Tanggal selesai'}
                                        </div>
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        captionLayout="dropdown"
                                        onSelect={(d) => {
                                            setEndDate(d);
                                            setIsEndDateOpen(false);
                                        }}
                                        disabled={(d) => d > new Date() || (startDate ? d < startDate : false)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleApplyFilter} disabled={!startDate || !endDate} className="gap-2 bg-indigo-600 hover:bg-indigo-600/90">
                            <Filter className="h-4 w-4" />
                            Terapkan
                        </Button>
                        {hasActiveFilter && (
                            <Button variant="outline" onClick={handleClearFilter} className="gap-2">
                                <X className="h-4 w-4" />
                                Reset
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {topStatsCards.map((card, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-xl border bg-white/60 p-5 backdrop-blur dark:bg-white/5">
                        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90`} />
                        <div className="relative flex items-start justify-between">
                            <h3 className="text-sm font-medium">{card.title}</h3>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-sm ring-1 ring-black/5 dark:bg-white/10">
                                {card.icon}
                            </div>
                        </div>
                        <div className="relative mt-3 space-y-2">
                            <div className="text-2xl font-bold tracking-tight">{card.value}</div>
                            {card.subtitle && <p className="text-muted-foreground text-xs">{card.subtitle}</p>}
                            {card.percentage !== undefined && (
                                <div className="flex items-center gap-2">
                                    <span className={`flex items-center text-xs font-medium ${getPercentageColor(card.percentage)}`}>
                                        {getPercentageIcon(card.percentage)}
                                        <span className="ml-1">{formatPercentage(card.percentage)}</span>
                                    </span>
                                    <span className="text-muted-foreground text-xs">{card.comparison}</span>
                                </div>
                            )}
                        </div>
                        <div className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/40 blur-xl dark:bg-white/10" />
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <div className="overflow-hidden rounded-xl border bg-white/70 p-5 backdrop-blur dark:bg-white/5">
                        <RevenueChart data={stats.monthly_revenue_data} />
                    </div>
                    <div className="overflow-hidden rounded-xl border bg-white/70 p-5 backdrop-blur dark:bg-white/5">
                        <ParticipantChart data={stats.participant_data} />
                    </div>
                </div>

                {/* Sidebar Panels */}
                <div className="space-y-6">
                    <div className="dark:via-background relative overflow-hidden rounded-xl border bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 dark:from-indigo-950/40 dark:to-sky-900/25">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute -top-4 -left-6 h-28 w-28 rounded-full bg-indigo-400/15 blur-2xl dark:bg-indigo-600/25" />
                            <div className="absolute right-0 bottom-0 h-32 w-32 rounded-full bg-sky-400/15 blur-2xl dark:bg-sky-700/25" />
                        </div>
                        <div className="relative">
                            <h3 className="mb-2 text-lg font-semibold">Total Pendaftar</h3>
                            <div className="mb-1 text-2xl font-bold text-green-600">{stats.total_participants.toLocaleString('id-ID')}</div>
                            <p className="text-muted-foreground mb-4 text-xs">
                                Bulan ini: <span className="font-medium">{stats.participants_this_month.toLocaleString('id-ID')}</span>
                            </p>
                            <Separator className="mb-4" />
                            <h4 className="text-sm font-semibold">Pendaftar Terbaru</h4>
                            <div className="mt-4 space-y-5">
                                {stats.recent_sales.length === 0 ? (
                                    <div className="text-muted-foreground flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-white/70 py-10 text-sm backdrop-blur dark:bg-white/5">
                                        <img src="/assets/images/not-found.webp" alt="Kosong" className="w-36 opacity-80" />
                                        Belum ada penjualan terbaru.
                                    </div>
                                ) : (
                                    stats.recent_sales.slice(0, 6).map((sale) => (
                                        <div key={sale.id} className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/15 to-sky-500/15 text-xs font-semibold">
                                                {sale.user.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1 leading-tight">
                                                <p className="text-sm font-medium">{sale.user.name}</p>
                                                <p className="text-muted-foreground text-[11px]">{getInvoiceItemName(sale)}</p>
                                            </div>
                                            <div className="text-sm font-semibold">{formatCurrency(sale.nett_amount)}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="dark:via-background relative overflow-hidden rounded-xl border bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 dark:from-indigo-950/40 dark:to-sky-900/25">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute top-4 left-4 h-24 w-24 rounded-full bg-indigo-400/15 blur-xl dark:bg-indigo-600/25" />
                            <div className="absolute right-4 bottom-2 h-28 w-28 rounded-full bg-sky-400/15 blur-xl dark:bg-sky-600/25" />
                        </div>
                        <div className="relative">
                            <h3 className="mb-2 text-lg font-semibold">Produk Terpopuler</h3>
                            <p className="text-muted-foreground mb-4 text-xs">Berdasarkan jumlah pendaftar.</p>
                            <div className="space-y-4">
                                {stats.popular_products.length === 0 ? (
                                    <div className="text-muted-foreground py-10 text-center text-sm">Belum ada data.</div>
                                ) : (
                                    stats.popular_products.slice(0, 8).map((p) => (
                                        <div key={p.id} className="flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">{p.title}</p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    {getProductTypeBadge(p.type)}
                                                    <span className="text-muted-foreground text-[11px]">{formatCurrency(p.price)}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-semibold">{p.enrollment_count}</span>
                                                <p className="text-muted-foreground text-[10px]">pendaftar</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
