import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import UserLayout from '@/layouts/user-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BadgeCheck, Check, Hourglass, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
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
    const isProfileComplete = isLoggedIn && auth.user?.phone_number;

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [discountData, setDiscountData] = useState<DiscountData | null>(null);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState('');

    const [showFreeForm, setShowFreeForm] = useState(false);
    const [freeFormData, setFreeFormData] = useState({
        ig_follow_proof_1: null as File | null,
        ig_follow_proof_2: null as File | null,
        ig_follow_proof_3: null as File | null,
        tag_friend_proof: null as File | null,
    });
    const [fileErrors, setFileErrors] = useState({
        ig_follow_proof_1: false,
        ig_follow_proof_2: false,
        ig_follow_proof_3: false,
        tag_friend_proof: false,
    });

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

    // Debounced promo code validation
    useEffect(() => {
        if (!promoCode.trim() || isFree) {
            setDiscountData(null);
            setPromoError('');
            return;
        }

        const timer = setTimeout(() => {
            validatePromoCode();
        }, 500);

        return () => clearTimeout(timer);
    }, [promoCode]);

    const validatePromoCode = async () => {
        if (!promoCode.trim() || isFree) return;

        setPromoLoading(true);
        setPromoError('');

        try {
            const response = await fetch('/api/discount-codes/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    code: promoCode,
                    amount: webinar.price,
                    product_type: 'webinar',
                    product_id: webinar.id,
                }),
            });

            const data = await response.json();

            if (data.valid) {
                setDiscountData(data);
                setPromoError('');
            } else {
                setDiscountData(null);
                setPromoError(data.message || 'Kode promo tidak valid');
            }
        } catch {
            setDiscountData(null);
            setPromoError('Terjadi kesalahan saat memvalidasi kode promo');
        } finally {
            setPromoLoading(false);
        }
    };

    const refreshCSRFToken = async (): Promise<string> => {
        try {
            const response = await fetch('/csrf-token', {
                method: 'GET',
                credentials: 'same-origin',
            });
            const data = await response.json();

            // Update meta tag
            const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
            if (metaTag) {
                metaTag.content = data.token;
            }

            return data.token;
        } catch (error) {
            console.error('Failed to refresh CSRF token:', error);
            throw error;
        }
    };

    const handleFreeCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isProfileComplete) {
            alert('Profil Anda belum lengkap! Harap lengkapi nomor telepon terlebih dahulu.');
            window.location.href = route('profile.edit');
            return;
        }

        if (!freeFormData.ig_follow_proof_1 || !freeFormData.ig_follow_proof_2 || !freeFormData.ig_follow_proof_3 || !freeFormData.tag_friend_proof) {
            alert('Harap upload semua bukti follow dan tag yang diperlukan!');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('type', 'webinar');
        formData.append('id', webinar.id);
        formData.append('ig_follow_proof_1', freeFormData.ig_follow_proof_1);
        formData.append('ig_follow_proof_2', freeFormData.ig_follow_proof_2);
        formData.append('ig_follow_proof_3', freeFormData.ig_follow_proof_3);
        formData.append('tag_friend_proof', freeFormData.tag_friend_proof);

        router.post(route('enroll.free'), formData, {
            onError: (errors) => {
                alert(errors.message || 'Gagal mendaftar webinar gratis.');
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isProfileComplete) {
            alert('Profil Anda belum lengkap! Harap lengkapi nomor telepon terlebih dahulu.');
            window.location.href = route('profile.edit');
            return;
        }

        if (!termsAccepted && !isFree) {
            alert('Anda harus menyetujui syarat dan ketentuan!');
            return;
        }

        setLoading(true);

        if (isFree) {
            setShowFreeForm(true);
            setLoading(false);
            return;
        }

        const submitPayment = async (retryCount = 0): Promise<void> => {
            const originalDiscountAmount = webinar.strikethrough_price > 0 ? webinar.strikethrough_price - webinar.price : 0;
            const promoDiscountAmount = discountData?.discount_amount || 0;

            const invoiceData: any = {
                type: 'webinar',
                id: webinar.id,
                discount_amount: originalDiscountAmount + promoDiscountAmount,
                nett_amount: finalWebinarPrice,
                transaction_fee: transactionFee,
                total_amount: totalPrice,
            };

            if (discountData?.valid) {
                invoiceData.discount_code_id = discountData.discount_code.id;
                invoiceData.discount_code_amount = discountData.discount_amount;
            }

            try {
                // Get fresh CSRF token
                const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

                const res = await fetch(route('invoice.store'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken || '',
                        Accept: 'application/json',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(invoiceData),
                });

                // Handle 419 error with retry
                if (res.status === 419 && retryCount < 2) {
                    console.log(`CSRF token expired, refreshing... (attempt ${retryCount + 1})`);
                    await refreshCSRFToken();
                    return submitPayment(retryCount + 1);
                }

                const data = await res.json();

                if (res.ok && data.success) {
                    if (data.payment_url) {
                        window.location.href = data.payment_url;
                    } else {
                        throw new Error('Payment URL not received');
                    }
                } else {
                    throw new Error(data.message || 'Gagal membuat invoice.');
                }
            } catch (error) {
                console.error('Payment error:', error);
                throw error;
            }
        };

        try {
            await submitPayment();
        } catch (error: any) {
            alert(error.message || 'Terjadi kesalahan saat proses pembayaran.');
            setLoading(false);
        }
    };

    // Function untuk validasi ukuran file
    const validateFileSize = (file: File, maxSizeMB: number = 2): boolean => {
        const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
        return file.size <= maxSizeBytes;
    };

    // Function untuk handle file input dengan validasi
    const handleFileChange = (fieldName: keyof typeof freeFormData, file: File | null) => {
        if (!file) {
            setFreeFormData((prev) => ({ ...prev, [fieldName]: null }));
            setFileErrors((prev) => ({ ...prev, [fieldName]: false }));
            return;
        }

        // Validasi ukuran file
        if (!validateFileSize(file, 2)) {
            // Set error state
            setFileErrors((prev) => ({ ...prev, [fieldName]: true }));

            // Clear input
            const input = document.querySelector(`input[data-field="${fieldName}"]`) as HTMLInputElement;
            if (input) {
                input.value = '';
            }

            toast.error('Ukuran file terlalu besar. Maksimal 2MB.');

            return;
        }

        // Validasi tipe file (hanya image)
        if (!file.type.startsWith('image/')) {
            setFileErrors((prev) => ({ ...prev, [fieldName]: true }));

            const input = document.querySelector(`input[data-field="${fieldName}"]`) as HTMLInputElement;
            if (input) {
                input.value = '';
            }

            toast.error('Hanya file gambar (JPG, PNG, GIF, dll) yang diperbolehkan.');

            return;
        }

        // File valid
        setFreeFormData((prev) => ({ ...prev, [fieldName]: file }));
        setFileErrors((prev) => ({ ...prev, [fieldName]: false }));

        // Show success toast
        toast.success('File berhasil diunggah.');
    };

    if (!isLoggedIn) {
        const currentUrl = window.location.href;
        const loginUrl = route('login', { redirect: currentUrl });

        return (
            <UserLayout>
                <Head title="Login Required" />

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
                        <p className="text-center text-gray-200">Silakan login terlebih dahulu untuk mendaftar webinar.</p>
                    </div>
                </section>
                <section className="mx-auto my-4 w-full max-w-7xl px-4">
                    <div className="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border p-6 text-center">
                        <User size={64} className="text-blue-500" />
                        <h2 className="text-xl font-bold">Login Diperlukan</h2>
                        <p className="text-sm text-gray-500">
                            Anda perlu login terlebih dahulu untuk mendaftar webinar ini.
                            {referralInfo.hasActive && ' Kode referral Anda akan tetap tersimpan.'}
                        </p>
                        <div className="flex w-full max-w-md gap-2">
                            <Button asChild className="flex-1">
                                <a href={loginUrl}>Login</a>
                            </Button>
                            <Button asChild variant="outline" className="flex-1">
                                <Link href={route('register', referralInfo.code ? { ref: referralInfo.code } : {})}>Daftar</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </UserLayout>
        );
    }

    if (!isProfileComplete) {
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
                <div className="w-full">
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
                                            <li>
                                                • Follow Instagram{' '}
                                                <a
                                                    href="https://www.instagram.com/arsacendekia/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    @arsacendekia
                                                </a>
                                            </li>
                                            <li>
                                                • Follow Instagram{' '}
                                                <a
                                                    href="https://www.instagram.com/lulustarget.idn/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    @lulustarget.idn
                                                </a>
                                            </li>
                                            <li>
                                                • Follow Instagram{' '}
                                                <a
                                                    href="https://www.instagram.com/zona.accounting/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    @zona.accounting
                                                </a>
                                            </li>
                                            <li>• Tag 3 teman di postingan Instagram kami</li>
                                        </ul>
                                        <p className="text-xs text-gray-500">Upload bukti follow dan tag untuk mendapatkan akses</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Promo Code Input */}
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

                                            {/* Promo Discount */}
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
                                    {loading ? 'Memproses...' : isFree ? 'Upload Syarat Pendaftaran' : 'Lanjutkan Pembayaran'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleFreeCheckout}>
                            <h2 className="my-2 text-xl font-bold italic">Upload Bukti Follow</h2>
                            <div className="space-y-4 rounded-lg border p-4">
                                {/* Bukti Follow Instagram */}
                                <div>
                                    <Label htmlFor="ig_follow_proof_1">Bukti Follow Instagram @arsacendekia</Label>
                                    <Input
                                        id="ig_follow_proof_1"
                                        data-field="ig_follow_proof_1"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('ig_follow_proof_1', e.target.files?.[0] || null)}
                                        className={fileErrors.ig_follow_proof_1 ? 'border-red-500 focus:ring-red-500' : ''}
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Screenshot halaman profil Instagram kami yang menunjukkan Anda sudah follow @arsacendekia (Maks. 2MB)
                                    </p>
                                    {fileErrors.ig_follow_proof_1 && (
                                        <p className="mt-1 text-xs text-red-600">
                                            File tidak valid. Pastikan ukuran tidak melebihi 2MB dan format gambar.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="ig_follow_proof_2">Bukti Follow Instagram @lulustarget.idn</Label>
                                    <Input
                                        id="ig_follow_proof_2"
                                        data-field="ig_follow_proof_2"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('ig_follow_proof_2', e.target.files?.[0] || null)}
                                        className={fileErrors.ig_follow_proof_2 ? 'border-red-500 focus:ring-red-500' : ''}
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Screenshot halaman profil Instagram kami yang menunjukkan Anda sudah follow @lulustarget.idn (Maks. 2MB)
                                    </p>
                                    {fileErrors.ig_follow_proof_2 && (
                                        <p className="mt-1 text-xs text-red-600">
                                            File tidak valid. Pastikan ukuran tidak melebihi 2MB dan format gambar.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="ig_follow_proof_3">Bukti Follow Instagram @zona.accounting</Label>
                                    <Input
                                        id="ig_follow_proof_3"
                                        data-field="ig_follow_proof_3"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('ig_follow_proof_3', e.target.files?.[0] || null)}
                                        className={fileErrors.ig_follow_proof_3 ? 'border-red-500 focus:ring-red-500' : ''}
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Screenshot halaman profil Instagram kami yang menunjukkan Anda sudah follow @zona.accounting (Maks. 2MB)
                                    </p>
                                    {fileErrors.ig_follow_proof_3 && (
                                        <p className="mt-1 text-xs text-red-600">
                                            File tidak valid. Pastikan ukuran tidak melebihi 2MB dan format gambar.
                                        </p>
                                    )}
                                </div>

                                {/* Bukti Tag 3 Teman */}
                                <div>
                                    <Label htmlFor="tag_friend_proof">Bukti Tag 3 Teman di Instagram</Label>
                                    <Input
                                        id="tag_friend_proof"
                                        data-field="tag_friend_proof"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('tag_friend_proof', e.target.files?.[0] || null)}
                                        className={fileErrors.tag_friend_proof ? 'border-red-500 focus:ring-red-500' : ''}
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Screenshot postingan Instagram kami yang menunjukkan Anda sudah tag 3 teman di komentar (Maks. 2MB)
                                    </p>
                                    {fileErrors.tag_friend_proof && (
                                        <p className="mt-1 text-xs text-red-600">
                                            File tidak valid. Pastikan ukuran tidak melebihi 2MB dan format gambar.
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowFreeForm(false);
                                            // Reset file errors ketika kembali
                                            setFileErrors({
                                                ig_follow_proof_1: false,
                                                ig_follow_proof_2: false,
                                                ig_follow_proof_3: false,
                                                tag_friend_proof: false,
                                            });
                                            setFreeFormData({
                                                ig_follow_proof_1: null,
                                                ig_follow_proof_2: null,
                                                ig_follow_proof_3: null,
                                                tag_friend_proof: null,
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
                                            !freeFormData.ig_follow_proof_1 ||
                                            !freeFormData.ig_follow_proof_2 ||
                                            !freeFormData.ig_follow_proof_3 ||
                                            !freeFormData.tag_friend_proof ||
                                            fileErrors.ig_follow_proof_1 ||
                                            fileErrors.ig_follow_proof_2 ||
                                            fileErrors.ig_follow_proof_3 ||
                                            fileErrors.tag_friend_proof
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
