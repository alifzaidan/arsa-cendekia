import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, ChartNoAxesGantt, ChevronDownIcon, Copy, DollarSign, Euro, Filter, TrendingDown, TrendingUp, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AffiliateStatsProps {
    user: SharedData['auth']['user'];
    stats: {
        total_commission: number;
        commission_this_month: number;
        commission_today: number;
        commission_yesterday: number;
        commission_last_month: number;
        daily_commission_change: number;
        monthly_commission_change: number;
        total_referrals: number;
        total_clicks: number;
        conversion_rate: number;
        recent_referrals: {
            id: number | string;
            amount: number;
            invoice: {
                user: { name: string };
                course_items?: { course: { title: string } }[];
                webinar_items?: { webinar: { title: string } }[];
            };
        }[];
        filtered_date_range?: { start: string; end: string } | null;
    };
    filters?: { start_date?: string; end_date?: string };
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const formatPercentage = (p: number) => `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`;
const getPercentageColor = (p: number) => (p > 0 ? 'text-green-600' : p < 0 ? 'text-red-600' : 'text-gray-600');
const getPercentageIcon = (p: number) =>
    p > 0 ? <TrendingUp className="h-3 w-3" /> : p < 0 ? <TrendingDown className="h-3 w-3" /> : <ChartNoAxesGantt className="h-3 w-3" />;

type InvoiceItem = {
    course_items?: { course: { title: string } }[];
    webinar_items?: { webinar: { title: string } }[];
    user: { name: string };
};
const getInvoiceItemName = (invoice: InvoiceItem) => {
    if (invoice.course_items?.length) return `Kelas: ${invoice.course_items[0].course.title}`;
    if (invoice.webinar_items?.length) return `Webinar: ${invoice.webinar_items[0].webinar.title}`;
    return 'Produk tidak diketahui';
};

export default function AffiliateDashboard({ user, stats, filters }: AffiliateStatsProps) {
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

    const handleCopyAffiliateLink = async () => {
        try {
            const link = `https://arsacendekia.com/register?ref=${user.affiliate_code}`;
            await navigator.clipboard.writeText(link);
            toast.success('Link afiliasi berhasil disalin!');
        } catch {
            toast.error('Gagal menyalin link afiliasi');
        }
    };

    const topStatsCards = [
        {
            title: 'Total Komisi',
            value: formatCurrency(stats.total_commission),
            icon: <DollarSign className="size-5 text-indigo-600 dark:text-indigo-300" />,
            gradient: 'from-indigo-500/15 via-indigo-400/10 to-sky-400/10',
            subtitle:
                hasActiveFilter && stats.filtered_date_range
                    ? `${stats.filtered_date_range.start} - ${stats.filtered_date_range.end}`
                    : 'Semua periode',
        },
        {
            title: 'Komisi Bulan Ini',
            value: formatCurrency(stats.commission_this_month),
            icon: <Euro className="size-5 text-emerald-600 dark:text-emerald-300" />,
            gradient: 'from-emerald-500/15 via-emerald-400/10 to-teal-400/10',
            percentage: stats.monthly_commission_change,
            comparison: ` bulan lalu (${formatCurrency(stats.commission_last_month)})`,
        },
        {
            title: 'Komisi Hari Ini',
            value: formatCurrency(stats.commission_today),
            icon: <TrendingUp className="size-5 text-amber-600 dark:text-amber-300" />,
            gradient: 'from-amber-500/20 via-amber-400/10 to-orange-400/10',
            percentage: stats.daily_commission_change,
            comparison: ` kemarin (${formatCurrency(stats.commission_yesterday)})`,
        },
        {
            title: 'Total Pendaftaran',
            value: stats.total_referrals.toLocaleString('id-ID'),
            icon: <Users className="size-5 text-purple-600 dark:text-purple-300" />,
            gradient: 'from-purple-500/20 via-fuchsia-400/10 to-pink-400/10',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Filter */}
            <div className="dark:via-background relative overflow-hidden rounded-xl border bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/60 p-5 dark:from-indigo-950/40 dark:to-sky-900/20">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-4 -left-6 h-24 w-24 rounded-full bg-indigo-400/10 blur-xl dark:bg-indigo-500/15" />
                    <div className="absolute right-4 bottom-2 h-28 w-28 rounded-full bg-sky-400/10 blur-xl dark:bg-sky-500/15" />
                </div>
                <div className="relative flex flex-col gap-4 2xl:flex-row 2xl:items-end">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Filter Total Komisi</label>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn('w-full justify-between sm:w-[200px]', !startDate && 'text-muted-foreground')}
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
                                        className={cn('w-full justify-between sm:w-[200px]', !endDate && 'text-muted-foreground')}
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

            {/* Stats Cards */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {topStatsCards.map((card, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-xl border bg-white/60 p-5 backdrop-blur dark:bg-white/5">
                        <div
                            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90 transition-opacity group-hover:opacity-100`}
                        />
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

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent Referrals */}
                <div className="dark:via-background relative overflow-hidden rounded-xl border bg-white p-6 lg:col-span-2 dark:from-indigo-950/40 dark:to-sky-900/20">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-6 -left-8 h-36 w-36 rounded-full bg-indigo-400/15 blur-2xl dark:bg-indigo-500/25" />
                        <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-sky-400/15 blur-2xl dark:bg-sky-600/25" />
                    </div>
                    <div className="relative mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Referral Terbaru</h3>
                            <p className="text-muted-foreground text-sm">Pendaftaran terbaru melalui link Anda.</p>
                        </div>
                        {stats.recent_referrals.length > 0 && (
                            <div className="text-right">
                                <p className="text-muted-foreground text-xs">Total Komisi</p>
                                <p className="font-semibold text-green-600">
                                    {formatCurrency(stats.recent_referrals.reduce((s, r) => s + r.amount, 0))}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="relative space-y-4">
                        {stats.recent_referrals.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-white/60 py-14 backdrop-blur dark:bg-white/5">
                                <img src="/assets/images/not-found.webp" alt="Referral kosong" className="w-40 opacity-80" />
                                <p className="text-muted-foreground text-sm">Belum ada referral baru.</p>
                            </div>
                        ) : (
                            stats.recent_referrals.map((ref) => (
                                <div
                                    key={ref.id}
                                    className="relative flex items-center gap-4 rounded-lg border bg-white/70 p-4 backdrop-blur transition hover:shadow-sm dark:bg-white/10"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/15 to-sky-500/15 text-sm font-medium">
                                        {ref.invoice.user.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="leading-tight font-medium">{ref.invoice.user.name}</p>
                                        <p className="text-muted-foreground text-xs">{getInvoiceItemName(ref.invoice)}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-green-600">{formatCurrency(ref.amount)}</div>
                                        <div className="text-muted-foreground text-[11px]">Komisi {user.commission}%</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar panels */}
                <div className="space-y-6">
                    <div className="dark:via-background relative overflow-hidden rounded-xl border bg-white p-6 dark:from-indigo-950/40 dark:to-sky-900/20">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute -top-4 -left-6 h-24 w-24 rounded-full bg-indigo-400/15 blur-2xl dark:bg-indigo-500/25" />
                            <div className="absolute right-0 bottom-0 h-32 w-32 rounded-full bg-sky-400/15 blur-2xl dark:bg-sky-600/25" />
                        </div>
                        <div className="relative">
                            <h3 className="mb-2 text-lg font-semibold">Link Afiliasi</h3>
                            <p className="text-muted-foreground mb-4 text-sm">Bagikan untuk mendapatkan komisi.</p>
                            <div className="flex items-center gap-2 rounded-lg border bg-white/70 p-3 backdrop-blur dark:bg-white/10">
                                <p className="text-muted-foreground flex-1 overflow-hidden text-xs text-ellipsis whitespace-nowrap">
                                    {`arsacendekia.com/register?ref=${user.affiliate_code}`}
                                </p>
                                <button
                                    onClick={handleCopyAffiliateLink}
                                    className="rounded-md p-2 hover:bg-white/60 dark:hover:bg-white/20"
                                    title="Salin"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="dark:via-background relative overflow-hidden rounded-xl border bg-white p-6 dark:from-indigo-950/40 dark:to-sky-900/20">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute top-4 left-4 h-20 w-20 rounded-full bg-indigo-400/15 blur-xl dark:bg-indigo-500/25" />
                        </div>
                        <div className="relative">
                            <h3 className="mb-4 text-lg font-semibold">Profil Afiliasi</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Kode:</span>
                                    <span className="font-mono">{user.affiliate_code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                            user.affiliate_status === 'Active'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300'
                                                : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300'
                                        }`}
                                    >
                                        {user.affiliate_status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Rate Komisi:</span>
                                    <span className="font-semibold text-green-600">{user.commission}%</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Earning:</span>
                                        <span className="text-base font-bold">{formatCurrency(stats.total_commission)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
