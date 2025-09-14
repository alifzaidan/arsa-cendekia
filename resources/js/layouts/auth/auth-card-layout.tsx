import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-blue-50 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl">
                        <CardHeader className="px-10 pt-4 pb-0 text-center">
                            <Link href={route('home')} className="mb-4 flex items-center gap-2 self-center font-medium">
                                <div className="flex w-20 items-center justify-center">
                                    <img src="/assets/images/logo-primary.png" alt="Logo Arsa Cendekia" className="fill-current" />
                                </div>
                            </Link>
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-4">{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
