import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import UserLayout from '@/layouts/user-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { BadgeCheck, Check, Hourglass, Loader2, User, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    slug: string;
    strikethrough_price: number;
    price: number;
    key_points?: string | null;
    level: 'beginner' | 'intermediate' | 'advanced';
    modules?: {
        title: string;
        description?: string | null;
        lessons?: {
            title: string;
            description?: string | null;
            type: 'text' | 'video' | 'file' | 'quiz' | 'assignment';
            attachment?: string | null;
            video_url?: string | null;
            is_free?: boolean;
        }[];
    }[];
}

interface DiscountData {
    valid: boolean;
    discount_amount: number;
    final_amount: number;
    discount_code: {
        id: string;
        code: string;
        name: string;
        type: string;
        formatted_value: string;
    };
    message?: string;
}

interface ReferralInfo {
    code?: string;
    hasActive: boolean;
}

type PendingCheckoutData = {
    courseId: string;
    productType: 'course';
    termsAccepted: boolean;
    promoCode: string;
    discountData: DiscountData | null;
    timestamp: number;
};

type InvoiceData = {
    type: 'course';
    id: string;
    discount_amount: number;
    nett_amount: number;
    total_amount: number;
    discount_code_id?: string;
    discount_code_amount?: number;
};

export default function CheckoutCourse({
    course,
    hasAccess,
    pendingInvoiceUrl,
    referralInfo,
}: {
    course: Course;
    hasAccess: boolean;
    pendingInvoiceUrl?: string | null;
    referralInfo: ReferralInfo;
}) {
    const { auth } = usePage<SharedData>().props;
    const isLoggedIn = !!auth.user;
    const isProfileComplete = isLoggedIn && !!auth.user?.phone_number;

    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [emailExists, setEmailExists] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [discountData, setDiscountData] = useState<DiscountData | null>(null);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState('');

    const submitInFlightRef = useRef(false);
    const pendingProcessedRef = useRef(false);
    const pendingTimerRef = useRef<number | null>(null);

    const isFree = course.price === 0;

    const transactionFee = 5000;
    const basePrice = course.price;
    const discountAmount = discountData?.discount_amount || 0;
    const finalCoursePrice = basePrice - discountAmount;
    const totalPrice = isFree ? 0 : finalCoursePrice + transactionFee;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const refFromUrl = urlParams.get('ref');

        if (refFromUrl) {
            sessionStorage.setItem('referral_code', refFromUrl);
        } else if (referralInfo.code) {
            sessionStorage.setItem('referral_code', referralInfo.code);
        }
    }, [referralInfo]);

    useEffect(() => {
        if (isLoggedIn || !guestEmail || !guestEmail.includes('@')) {
            setEmailExists(false);
            return;
        }

        const timer = setTimeout(async () => {
            setCheckingEmail(true);
            try {
                const response = await axios.post(route('checkout.check-email'), { email: guestEmail });
                if (response.data.exists) {
                    setEmailExists(true);
                    setGuestName(response.data.name || '');
                    setGuestPhone(response.data.phone_number || '');
                } else {
                    setEmailExists(false);
                }
            } catch {
                setEmailExists(false);
            } finally {
                setCheckingEmail(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [guestEmail, isLoggedIn]);

    const validatePromoCode = useCallback(async () => {
        if (!promoCode.trim() || isFree) return;

        setPromoLoading(true);
        setPromoError('');

        try {
            const payload: {
                code: string;
                amount: number;
                product_type: 'course';
                product_id: string;
                email?: string;
            } = {
                code: promoCode,
                amount: course.price,
                product_type: 'course',
                product_id: course.id,
            };

            if (!isLoggedIn && emailExists && guestEmail) {
                payload.email = guestEmail;
            }

            const response = await axios.post('/api/discount-codes/validate', payload);

            if (response.data.valid) {
                setDiscountData(response.data);
                setPromoError('');
            } else {
                setDiscountData(null);
                setPromoError(response.data.message || 'Kode promo tidak valid');
            }
        } catch (error) {
            const message = axios.isAxiosError(error) ? (error.response?.data as { message?: string })?.message : undefined;
            setDiscountData(null);
            setPromoError(message || 'Terjadi kesalahan saat memvalidasi kode promo');
        } finally {
            setPromoLoading(false);
        }
    }, [promoCode, isFree, course.price, course.id, isLoggedIn, emailExists, guestEmail]);

    useEffect(() => {
        if (!promoCode.trim() || isFree) {
            setDiscountData(null);
            setPromoError('');
            return;
        }

        const timer = setTimeout(() => {
            void validatePromoCode();
        }, 500);

        return () => clearTimeout(timer);
    }, [promoCode, isFree, validatePromoCode]);

    const refreshCSRFToken = useCallback(async (): Promise<string> => {
        const response = await fetch('/csrf-token', {
            method: 'GET',
            credentials: 'same-origin',
        });
        const dataRes = await response.json();

        const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        if (metaTag) metaTag.content = dataRes.token;

        return dataRes.token;
    }, []);

    const createInvoicePayload = useCallback(
        (overrideDiscount?: DiscountData | null): InvoiceData => {
            const activeDiscount = overrideDiscount ?? discountData;
            const originalDiscountAmount = course.strikethrough_price > 0 ? course.strikethrough_price - course.price : 0;
            const promoDiscountAmount = activeDiscount?.discount_amount || 0;

            const payload: InvoiceData = {
                type: 'course',
                id: course.id,
                discount_amount: originalDiscountAmount + promoDiscountAmount,
                nett_amount: course.price - promoDiscountAmount,
                total_amount: course.price - promoDiscountAmount + 5000,
            };

            if (activeDiscount?.valid) {
                payload.discount_code_id = activeDiscount.discount_code.id;
                payload.discount_code_amount = activeDiscount.discount_amount;
            }

            return payload;
        },
        [discountData, course.id, course.price, course.strikethrough_price],
    );

    const submitPayment = useCallback(
        async (payload: InvoiceData, retryCount = 0): Promise<void> => {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

            const res = await fetch(route('invoice.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify(payload),
            });

            if (res.status === 419 && retryCount < 2) {
                await refreshCSRFToken();
                return submitPayment(payload, retryCount + 1);
            }

            if (res.status === 401 && retryCount < 2) {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                return submitPayment(payload, retryCount + 1);
            }

            const dataRes = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string; payment_url?: string };

            if (!res.ok || !dataRes.success) {
                throw new Error(dataRes.message || 'Gagal membuat invoice.');
            }

            if (!dataRes.payment_url) {
                throw new Error('Payment URL not received');
            }

            sessionStorage.removeItem('pendingCheckoutCourse');
            window.location.href = dataRes.payment_url;
        },
        [refreshCSRFToken],
    );

    const handleFreeCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isProfileComplete) {
            toast.error('Profil Anda belum lengkap! Harap lengkapi nomor telepon terlebih dahulu.');
            setTimeout(() => {
                window.location.href = route('profile.edit');
            }, 1200);
            return;
        }

        setLoading(true);

        router.post(
            route('enroll.free'),
            {
                type: 'course',
                id: course.id,
            },
            {
                onError: (errors) => {
                    toast.error((errors as { message?: string }).message || 'Gagal mendaftar kelas gratis.');
                },
                onFinish: () => {
                    setLoading(false);
                },
            },
        );
    };

    const handleGuestAuthentication = async () => {
        if (!guestEmail || !guestName || !guestPhone) {
            toast.error('Lengkapi nama, email, dan nomor telepon terlebih dahulu.');
            return false;
        }

        try {
            if (emailExists) {
                const response = await axios.post(route('checkout.auto-login'), {
                    email: guestEmail,
                    phone_number: guestPhone,
                });

                if (!response.data.success) {
                    throw new Error(response.data.message || 'Login gagal. Pastikan nomor telepon sesuai.');
                }

                toast.success('Login berhasil, menyiapkan checkout...');
            } else {
                await axios.post(route('checkout.quick-register'), {
                    name: guestName,
                    email: guestEmail,
                    phone_number: guestPhone,
                });

                toast.success('Akun berhasil dibuat, menyiapkan checkout...');
            }

            if (!isFree) {
                sessionStorage.setItem(
                    'pendingCheckoutCourse',
                    JSON.stringify({
                        courseId: course.id,
                        productType: 'course',
                        termsAccepted,
                        promoCode,
                        discountData,
                        timestamp: Date.now(),
                    } satisfies PendingCheckoutData),
                );
            }

            setTimeout(() => {
                window.location.reload();
            }, 900);

            return true;
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? (error.response?.data as { message?: string })?.message
                : error instanceof Error
                  ? error.message
                  : 'Gagal login/registrasi otomatis.';
            toast.error(message || 'Gagal login/registrasi otomatis.');
            return false;
        }
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoggedIn) {
            setLoading(true);
            const success = await handleGuestAuthentication();
            if (!success) {
                setLoading(false);
            }
            return;
        }

        if (!isProfileComplete) {
            toast.error('Profil Anda belum lengkap! Harap lengkapi nomor telepon terlebih dahulu.');
            setTimeout(() => {
                window.location.href = route('profile.edit');
            }, 1200);
            return;
        }

        if (!termsAccepted && !isFree) {
            toast.error('Anda harus menyetujui syarat dan ketentuan!');
            return;
        }

        if (submitInFlightRef.current) return;
        submitInFlightRef.current = true;
        setLoading(true);

        if (isFree) {
            handleFreeCheckout(e);
            submitInFlightRef.current = false;
            return;
        }

        try {
            await submitPayment(createInvoicePayload());
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat proses pembayaran.';
            toast.error(message);
            setLoading(false);
            submitInFlightRef.current = false;
        }
    };

    useEffect(() => {
        const raw = sessionStorage.getItem('pendingCheckoutCourse');
        if (!raw || !isLoggedIn || pendingProcessedRef.current) return;

        pendingProcessedRef.current = true;

        let checkoutData: PendingCheckoutData;
        try {
            checkoutData = JSON.parse(raw) as PendingCheckoutData;
        } catch {
            sessionStorage.removeItem('pendingCheckoutCourse');
            return;
        }

        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() - (checkoutData.timestamp || 0) > fiveMinutes) {
            sessionStorage.removeItem('pendingCheckoutCourse');
            toast.error('Sesi checkout telah kedaluwarsa. Silakan ulangi checkout.');
            return;
        }

        if (checkoutData.courseId !== course.id) {
            sessionStorage.removeItem('pendingCheckoutCourse');
            return;
        }

        if (checkoutData.promoCode) setPromoCode(checkoutData.promoCode);
        if (checkoutData.discountData) setDiscountData(checkoutData.discountData);
        setTermsAccepted(!!checkoutData.termsAccepted);

        pendingTimerRef.current = window.setTimeout(async () => {
            if (submitInFlightRef.current) return;
            submitInFlightRef.current = true;
            setLoading(true);

            try {
                await submitPayment(createInvoicePayload(checkoutData.discountData ?? null));
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat proses pembayaran.';
                toast.error(message);
                sessionStorage.removeItem('pendingCheckoutCourse');
                setLoading(false);
                submitInFlightRef.current = false;
            }
        }, 1000);

        return () => {
            if (pendingTimerRef.current) {
                clearTimeout(pendingTimerRef.current);
            }
        };
    }, [isLoggedIn, course.id, createInvoicePayload, submitPayment]);

    if (isLoggedIn && !isProfileComplete) {
        return (
            <UserLayout>
                <Head title="Checkout Kelas" />
                <section className="to-tertiary from-primary w-full bg-gradient-to-br px-4">
                    <div className="mx-auto my-12 w-full max-w-7xl px-4">
                        <h2 className="mx-auto mb-4 max-w-3xl text-center text-3xl font-bold text-white sm:text-4xl">
                            Checkout Kelas "{course.title}"
                        </h2>
                        <img
                            src={course.thumbnail ? `/storage/${course.thumbnail}` : '/assets/images/placeholder.png'}
                            alt={course.title}
                            className="mx-auto my-6 w-full max-w-xl rounded-lg border border-gray-200 shadow-md"
                        />
                        <p className="text-center text-gray-200">Silakan lengkapi profil Anda terlebih dahulu.</p>
                    </div>
                </section>
                <section className="mx-auto my-4 w-full max-w-7xl px-4">
                    <div className="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border p-6 text-center">
                        <User size={64} className="text-orange-500" />
                        <h2 className="text-xl font-bold">Profil Belum Lengkap</h2>
                        <p className="text-sm text-gray-500">
                            Profil Anda belum lengkap! Harap lengkapi nomor telepon terlebih dahulu untuk mendaftar kelas.
                        </p>
                        <Button asChild className="w-full max-w-md">
                            <Link href={route('profile.edit', { redirect: window.location.href })}>Lengkapi Profil</Link>
                        </Button>
                    </div>
                </section>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <Head title="Checkout Kelas" />
            <section className="to-tertiary from-primary w-full bg-gradient-to-br px-4">
                <div className="mx-auto my-12 w-full max-w-7xl px-4">
                    <h2 className="mx-auto mb-4 max-w-3xl text-center text-3xl font-bold text-white sm:text-4xl">Checkout Kelas "{course.title}"</h2>
                    <img
                        src={course.thumbnail ? `/storage/${course.thumbnail}` : '/assets/images/placeholder.png'}
                        alt={course.title}
                        className="mx-auto my-6 w-full max-w-xl rounded-lg border border-gray-200 shadow-md"
                    />
                    <p className="text-center text-gray-200">
                        {isFree ? 'Lanjutkan untuk mendapatkan akses gratis ke kelas ini.' : 'Silakan selesaikan pembayaran untuk mendaftar kelas.'}
                    </p>
                </div>
            </section>
            <section className="mx-auto my-4 w-full max-w-7xl px-4">
                <div className="w-full space-y-4">
                    {!isLoggedIn && (
                        <div className="space-y-3 rounded-lg border p-4">
                            <h3 className="text-base font-semibold">Data Peserta</h3>
                            <p className="text-sm text-gray-500">Isi data berikut untuk checkout tanpa login manual.</p>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <Label htmlFor="guest-email">Email</Label>
                                    <div className="relative">
                                        <Input
                                            id="guest-email"
                                            type="email"
                                            value={guestEmail}
                                            onChange={(e) => setGuestEmail(e.target.value)}
                                            placeholder="nama@email.com"
                                            className="pr-10"
                                        />
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                            {checkingEmail ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                            ) : emailExists ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : null}
                                        </div>
                                    </div>
                                    {emailExists && <p className="mt-1 text-xs text-blue-600">Email ditemukan, data akan disesuaikan otomatis.</p>}
                                </div>

                                <div>
                                    <Label htmlFor="guest-name">Nama</Label>
                                    <Input
                                        id="guest-name"
                                        type="text"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        placeholder="Nama lengkap"
                                        disabled={emailExists}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="guest-phone">No. Telepon</Label>
                                    <Input
                                        id="guest-phone"
                                        type="tel"
                                        value={guestPhone}
                                        onChange={(e) => setGuestPhone(e.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                        disabled={emailExists}
                                    />
                                    {emailExists ? (
                                        <p className="mt-1 text-xs text-blue-600">No. telepon mengikuti data akun yang sudah terdaftar.</p>
                                    ) : (
                                        <p className="mt-1 text-xs text-gray-500">No. telepon akan digunakan sebagai password akun Anda.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {hasAccess ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border p-6 text-center">
                            <BadgeCheck size={64} className="text-green-500" />
                            <h2 className="text-xl font-bold">Anda Sudah Memiliki Akses</h2>
                            <p className="text-sm text-gray-500">Anda sudah terdaftar di kelas ini. Silakan lanjutkan belajar.</p>
                            <Button asChild className="w-full">
                                <a href={`/profile/my-courses/${course.slug}`}>Masuk ke Kelas</a>
                            </Button>
                        </div>
                    ) : pendingInvoiceUrl ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border p-6 text-center">
                            <Hourglass size={64} className="text-yellow-500" />
                            <h2 className="text-xl font-bold">Pembayaran Tertunda</h2>
                            <p className="text-sm text-gray-500">
                                Anda memiliki pembayaran yang belum selesai untuk kelas ini. Silakan lanjutkan untuk membayar.
                            </p>
                            <Button asChild className="w-full">
                                <a href={pendingInvoiceUrl}>Lanjutkan Pembayaran</a>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleCheckout}>
                            <h2 className="my-2 text-xl font-bold">Detail {isFree ? 'Pendaftaran' : 'Pembayaran'}</h2>
                            <div className="space-y-4 rounded-lg border p-4">
                                {isFree ? (
                                    <div className="flex items-center justify-between p-4 text-center">
                                        <span className="w-full text-2xl font-bold text-green-600">KELAS GRATIS</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="promo-code">Kode Promo (Opsional)</Label>
                                            <div className="relative">
                                                <Input
                                                    id="promo-code"
                                                    type="text"
                                                    placeholder="Masukkan kode promo"
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                    className="pr-10"
                                                />
                                                {promoLoading && (
                                                    <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                                                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                                    </div>
                                                )}
                                                {!promoLoading && promoCode && (
                                                    <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                                                        {discountData?.valid ? (
                                                            <Check className="h-4 w-4 text-green-600" />
                                                        ) : promoError ? (
                                                            <X className="h-4 w-4 text-red-600" />
                                                        ) : null}
                                                    </div>
                                                )}
                                            </div>
                                            {promoError && <p className="text-sm text-red-600">{promoError}</p>}
                                            {discountData?.valid && (
                                                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Check className="h-4 w-4 text-green-600" />
                                                        <p className="text-sm font-medium text-green-800">
                                                            Kode promo "{discountData.discount_code.code}" berhasil diterapkan!
                                                        </p>
                                                    </div>
                                                    <p className="mt-1 text-xs text-green-600">
                                                        {discountData.discount_code.name} - Diskon {discountData.discount_code.formatted_value}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 rounded-lg border p-4">
                                            {course.strikethrough_price > 0 && (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">Harga Asli</span>
                                                        <span className="font-semibold text-gray-500 line-through">
                                                            Rp {course.strikethrough_price.toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">Diskon</span>
                                                        <span className="font-semibold text-red-500">
                                                            -Rp {(course.strikethrough_price - course.price).toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                    <Separator className="my-2" />
                                                </>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Harga Kelas</span>
                                                <span className="font-semibold text-gray-500">Rp {course.price.toLocaleString('id-ID')}</span>
                                            </div>

                                            {discountData?.valid && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Diskon Promo ({discountData.discount_code.code})</span>
                                                    <span className="font-semibold text-green-600">
                                                        -Rp {discountData.discount_amount.toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Biaya Transaksi</span>
                                                <span className="font-semibold text-gray-500">Rp {transactionFee.toLocaleString('id-ID')}</span>
                                            </div>
                                            <Separator className="my-2" />
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-900">Total Pembayaran</span>
                                                <span className="text-primary text-xl font-bold">Rp {totalPrice.toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {!isFree && (
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="terms"
                                            checked={termsAccepted}
                                            onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                                        />
                                        <Label htmlFor="terms">
                                            Saya menyetujui{' '}
                                            <a
                                                href="/terms-and-conditions"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-700 hover:underline"
                                            >
                                                syarat dan ketentuan
                                            </a>
                                        </Label>
                                    </div>
                                )}
                                <Button className="w-full" type="submit" disabled={(isFree ? false : !termsAccepted) || loading}>
                                    {loading
                                        ? 'Memproses...'
                                        : !isLoggedIn
                                          ? isFree
                                              ? 'Buat Akun & Dapatkan Akses Gratis'
                                              : 'Lanjutkan & Buat Akun Otomatis'
                                          : isFree
                                            ? 'Dapatkan Akses Gratis Sekarang'
                                            : 'Lanjutkan Pembayaran'}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </UserLayout>
    );
}
