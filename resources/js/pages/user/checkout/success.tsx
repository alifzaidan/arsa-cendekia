import { Button } from '@/components/ui/button';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { Crown, FileText } from 'lucide-react';

interface CourseItem {
    course: { title: string; slug: string; thumbnail: string };
}
interface WebinarItem {
    webinar: { title: string; slug: string; thumbnail: string };
}

interface Invoice {
    id: string;
    amount: number;
    course_items?: CourseItem[];
    webinar_items?: WebinarItem[];
}

interface InvoiceProps {
    invoice: Invoice;
}

export default function CheckoutSuccess({ invoice }: InvoiceProps) {
    const courseItems = invoice.course_items ?? [];
    const webinarItems = invoice.webinar_items ?? [];

    let title = '';
    let link = '';
    let label = '';

    if (courseItems.length > 0) {
        title = `Checkout Kelas "${courseItems[0].course.title}" Berhasil!`;
        link = `/profile/my-courses/${courseItems[0].course.slug}`;
        label = 'Akses Kelas';
    } else if (webinarItems.length > 0) {
        title = `Checkout Webinar "${webinarItems[0].webinar.title}" Berhasil!`;
        link = `/profile/my-webinars/${webinarItems[0].webinar.slug}`;
        label = 'Akses Webinar';
    } else {
        title = 'Checkout Berhasil!';
        link = '/profile';
        label = 'Lihat Profil';
    }

    return (
        <UserLayout>
            <Head title="Checkout Berhasil" />
            <section className="to-tertiary from-primary w-full rounded-b-4xl bg-gradient-to-r">
                <div className="mx-auto my-16 flex w-full max-w-7xl flex-col items-center px-4">
                    <h2 className="mb-4 max-w-3xl bg-white bg-clip-text text-center text-3xl font-bold text-transparent sm:text-4xl">{title}</h2>
                    <img src="/assets/images/payment-success.png" alt="Pembayaran Berhasil" className="mb-6 w-[300px]" />
                    <p className="mb-6 max-w-xl text-center text-white">
                        Terima kasih telah menyelesaikan pembayaran. Anda sekarang dapat mengakses detail produk dengan klik tombol di bawah ini.
                        Invoice sudah dikirimkan ke nomor WA anda.
                    </p>
                    <Button variant="secondary" className="mx-auto mb-4 w-fit" asChild>
                        <Link href={link}>
                            <Crown />
                            {label}
                        </Link>
                    </Button>
                    <Button variant="outline" className="bg-white" asChild>
                        <a href={route('invoice.pdf', { id: invoice.id })} target="_blank" rel="noopener noreferrer">
                            <FileText className="size-4" />
                            Unduh Invoice
                        </a>
                    </Button>
                </div>
            </section>
        </UserLayout>
    );
}
