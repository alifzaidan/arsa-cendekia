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

interface Webinar {
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    strikethrough_price: number;
    price: number;
    thumbnail?: string | null;
    description?: string | null;
    benefits?: string | null;
    group_url?: string | null;
    requirement_1?: string | null;
    requirement_2?: string | null;
    requirement_3?: string | null;
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
    webinarId: string;
    productType: 'webinar';
    termsAccepted: boolean;
    promoCode: string;
    discountData: DiscountData | null;
    timestamp: number;
};

type InvoiceData = {
    type: 'webinar';
    id: string;
    discount_amount: number;
    nett_amount: number;
    total_amount: number;
    discount_code_id?: string;
    discount_code_amount?: number;
};

export default function RegisterWebinar({
    webinar,
    hasAccess,
    pendingInvoiceUrl,
    referralInfo,
}: {
    webinar: Webinar;
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

    const [showFreeForm, setShowFreeForm] = useState(false);
    const [freeFormData, setFreeFormData] = useState<Record<string, File | null>>({
        requirement_1_proof: null,
        requirement_2_proof: null,
        requirement_3_proof: null,
    });
    const [fileErrors, setFileErrors] = useState<Record<string, boolean>>({
        requirement_1_proof: false,
        requirement_2_proof: false,
        requirement_3_proof: false,
    });

    const submitInFlightRef = useRef(false);
    const pendingProcessedRef = useRef(false);
    const pendingTimerRef = useRef<number | null>(null);

    const isFree = webinar.price === 0;

    const transactionFee = 5000;
    const basePrice = webinar.price;
    const discountAmount = discountData?.discount_amount || 0;
    const finalWebinarPrice = basePrice - discountAmount;
    const totalPrice = isFree ? 0 : finalWebinarPrice + transactionFee;

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
                product_type: 'webinar';
                product_id: string;
                email?: string;
            } = {
                code: promoCode,
                amount: webinar.price,
                product_type: 'webinar',
                product_id: webinar.id,
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
    }, [promoCode, isFree, webinar.price, webinar.id, isLoggedIn, emailExists, guestEmail]);

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
            const originalDiscountAmount = webinar.strikethrough_price > 0 ? webinar.strikethrough_price - webinar.price : 0;
            const promoDiscountAmount = activeDiscount?.discount_amount || 0;

            const payload: InvoiceData = {
                type: 'webinar',
                id: webinar.id,
                discount_amount: originalDiscountAmount + promoDiscountAmount,
                nett_amount: webinar.price - promoDiscountAmount,
                total_amount: webinar.price - promoDiscountAmount + 5000,
            };

            if (activeDiscount?.valid) {
                payload.discount_code_id = activeDiscount.discount_code.id;
                payload.discount_code_amount = activeDiscount.discount_amount;
            }

            return payload;
        },
        [discountData, webinar.id, webinar.price, webinar.strikethrough_price],
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

            sessionStorage.removeItem('pendingCheckout');
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

        if (!freeFormData.requirement_1_proof || !freeFormData.requirement_2_proof || !freeFormData.requirement_3_proof) {
            toast.error('Harap upload semua bukti yang diperlukan!');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('type', 'webinar');
        formData.append('id', webinar.id);
        formData.append('requirement_1_proof', freeFormData.requirement_1_proof);
        formData.append('requirement_2_proof', freeFormData.requirement_2_proof);
        formData.append('requirement_3_proof', freeFormData.requirement_3_proof);

        router.post(route('enroll.free'), formData, {
            onError: (errors) => {
                toast.error((errors as { message?: string }).message || 'Gagal mendaftar webinar gratis.');
            },
            onFinish: () => {
                setLoading(false);
            },
        });
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
                    'pendingCheckout',
                    JSON.stringify({
                        webinarId: webinar.id,
                        productType: 'webinar',
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
            setShowFreeForm(true);
            setLoading(false);
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
        const raw = sessionStorage.getItem('pendingCheckout');
        if (!raw || !isLoggedIn || pendingProcessedRef.current) return;

        pendingProcessedRef.current = true;

        let checkoutData: PendingCheckoutData;
        try {
            checkoutData = JSON.parse(raw) as PendingCheckoutData;
        } catch {
            sessionStorage.removeItem('pendingCheckout');
            return;
        }

        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() - (checkoutData.timestamp || 0) > fiveMinutes) {
            sessionStorage.removeItem('pendingCheckout');
            toast.error('Sesi checkout telah kedaluwarsa. Silakan ulangi checkout.');
            return;
        }

        if (checkoutData.webinarId !== webinar.id) {
            sessionStorage.removeItem('pendingCheckout');
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
                sessionStorage.removeItem('pendingCheckout');
                setLoading(false);
                submitInFlightRef.current = false;
            }
        }, 1000);

        return () => {
            if (pendingTimerRef.current) {
                clearTimeout(pendingTimerRef.current);
            }
        };
    }, [isLoggedIn, webinar.id, createInvoicePayload, submitPayment]);

    const validateFileSize = (file: File, maxSizeMB: number = 2): boolean => {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        return file.size <= maxSizeBytes;
    };

    const handleFileChange = (fieldName: keyof typeof freeFormData, file: File | null) => {
        if (!file) {
            setFreeFormData((prev) => ({ ...prev, [fieldName]: null }));
            setFileErrors((prev) => ({ ...prev, [fieldName]: false }));
            return;
        }

        if (!validateFileSize(file, 2)) {
            setFileErrors((prev) => ({ ...prev, [fieldName]: true }));
            const input = document.querySelector(`input[data-field="${fieldName}"]`) as HTMLInputElement;
            if (input) input.value = '';
            toast.error('Ukuran file terlalu besar. Maksimal 2MB.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            setFileErrors((prev) => ({ ...prev, [fieldName]: true }));
            const input = document.querySelector(`input[data-field="${fieldName}"]`) as HTMLInputElement;
            if (input) input.value = '';
            toast.error('Hanya file gambar (JPG, PNG, GIF, dll) yang diperbolehkan.');
            return;
        }

        setFreeFormData((prev) => ({ ...prev, [fieldName]: file }));
        setFileErrors((prev) => ({ ...prev, [fieldName]: false }));
        toast.success('File berhasil diunggah.');
    };

    if (isLoggedIn && !isProfileComplete) {
        return (
            <UserLayout>
                <Head title="Daftar Webinar" />
                <section className="to-tertiary from-primary w-full bg-gradient-to-br px-4">
                    <div className="mx-auto my-18 w-full max-w-7xl px-4">
                        <h2 className="mx-auto mb-4 max-w-3xl text-center text-3xl font-bold text-white sm:text-4xl">
                            Daftar Webinar "{webinar.title}"
                        </h2>
                        <img
                            src={webinar.thumbnail ? `/storage/${webinar.thumbnail}` : '/assets/images/placeholder.png'}
                            alt={webinar.title}
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
                            Profil Anda belum lengkap! Harap lengkapi nomor telepon terlebih dahulu untuk mendaftar webinar.
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
            <Head title="Daftar Webinar" />
            <section className="to-tertiary from-primary w-full bg-gradient-to-br px-4">
                <div className="mx-auto my-18 w-full max-w-7xl px-4">
                    <h2 className="mx-auto mb-4 max-w-3xl text-center text-3xl font-bold text-white sm:text-4xl">Daftar Webinar "{webinar.title}"</h2>
                    <img
                        src={webinar.thumbnail ? `/storage/${webinar.thumbnail}` : '/assets/images/placeholder.png'}
                        alt={webinar.title}
                        className="mx-auto my-6 w-full max-w-xl rounded-lg border border-gray-200 shadow-md"
                    />
                    <p className="text-center text-gray-200">
                        {isFree
                            ? 'Silahkan lengkapi persyaratan berikut untuk mendaftar webinar.'
                            : 'Silakan selesaikan pembayaran untuk mendaftar webinar.'}
                    </p>
                </div>
            </section>
            <section className="mx-auto my-4 w-full max-w-7xl px-4">
                <div className="w-full space-y-4">
                    {!isLoggedIn && !showFreeForm && (
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
                            <p className="text-sm text-gray-500">Anda sudah terdaftar di webinar ini. Silakan masuk ke dalam grup.</p>
                            <Button asChild className="w-full">
                                <a href={webinar.group_url ?? ''} target="_blank" rel="noopener noreferrer">
                                    Masuk Group Webinar
                                </a>
                            </Button>
                        </div>
                    ) : pendingInvoiceUrl ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border p-6 text-center">
                            <Hourglass size={64} className="text-yellow-500" />
                            <h2 className="text-xl font-bold">Pembayaran Tertunda</h2>
                            <p className="text-sm text-gray-500">
                                Anda memiliki pembayaran yang belum selesai untuk webinar ini. Silakan lanjutkan untuk membayar.
                            </p>
                            <Button asChild className="w-full">
                                <a href={pendingInvoiceUrl}>Lanjutkan Pembayaran</a>
                            </Button>
                        </div>
                    ) : !showFreeForm ? (
                        <form onSubmit={handleCheckout}>
                            <h2 className="my-2 text-xl font-bold">Detail {isFree ? 'Pendaftaran' : 'Pembayaran'}</h2>
                            <div className="space-y-4 rounded-lg border p-4">
                                {isFree ? (
                                    <div className="space-y-2 text-center">
                                        <div className="flex items-center justify-between p-4">
                                            <span className="w-full text-2xl font-bold text-green-600">WEBINAR GRATIS</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Untuk mendapatkan akses gratis, Anda perlu:</p>
                                        <ul className="space-y-1 text-left text-sm">
                                            {webinar.requirement_1 && <li>• {webinar.requirement_1}</li>}
                                            {webinar.requirement_2 && <li>• {webinar.requirement_2}</li>}
                                            {webinar.requirement_3 && <li>• {webinar.requirement_3}</li>}
                                        </ul>
                                        <p className="text-xs text-gray-500">Upload bukti follow dan tag untuk mendapatkan akses</p>
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
                                            {webinar.strikethrough_price > 0 && (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">Harga Asli</span>
                                                        <span className="font-semibold text-gray-500 line-through">
                                                            Rp {webinar.strikethrough_price.toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">Diskon</span>
                                                        <span className="font-semibold text-red-500">
                                                            -Rp {(webinar.strikethrough_price - webinar.price).toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                    <Separator className="my-2" />
                                                </>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Harga Webinar</span>
                                                <span className="font-semibold text-gray-500">Rp {webinar.price.toLocaleString('id-ID')}</span>
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
                                              ? 'Buat Akun & Lanjut Upload Syarat'
                                              : 'Lanjutkan & Buat Akun Otomatis'
                                          : isFree
                                            ? 'Upload Syarat Pendaftaran'
                                            : 'Lanjutkan Pembayaran'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleFreeCheckout}>
                            <h2 className="my-2 text-xl font-bold italic">Upload Bukti Follow</h2>
                            <div className="space-y-4 rounded-lg border p-4">
                                {[1, 2, 3].map((index) => {
                                    const requirementKey = `requirement_${index}`;
                                    const proofKey = `${requirementKey}_proof` as const;
                                    const requirementText = webinar[requirementKey as keyof Webinar] as string | null | undefined;

                                    return (
                                        <div key={index}>
                                            <Label htmlFor={proofKey}>
                                                Bukti Persyaratan {index}: {requirementText || `Persyaratan ${index}`}
                                            </Label>
                                            <Input
                                                id={proofKey}
                                                data-field={proofKey}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(proofKey, e.target.files?.[0] || null)}
                                                className={fileErrors[proofKey] ? 'border-red-500' : ''}
                                                required
                                            />
                                            <p className="mt-1 text-xs text-gray-500">{requirementText} (Maks. 2MB)</p>
                                        </div>
                                    );
                                })}

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowFreeForm(false);
                                            setFileErrors({
                                                requirement_1_proof: false,
                                                requirement_2_proof: false,
                                                requirement_3_proof: false,
                                            });
                                            setFreeFormData({
                                                requirement_1_proof: null,
                                                requirement_2_proof: null,
                                                requirement_3_proof: null,
                                            });
                                        }}
                                        className="flex-1"
                                    >
                                        Kembali
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={
                                            loading ||
                                            !freeFormData.requirement_1_proof ||
                                            !freeFormData.requirement_2_proof ||
                                            !freeFormData.requirement_3_proof ||
                                            Object.values(fileErrors).some((error) => error)
                                        }
                                        className="flex-1"
                                    >
                                        {loading ? 'Memproses...' : 'Dapatkan Akses Gratis'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </UserLayout>
    );
}
