import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col items-center justify-end overflow-hidden bg-white p-8 lg:flex dark:border-r">
                <div className="to-primary absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent"></div>

                <Link href={route('home')} className="absolute top-4 left-4 z-20 flex items-center justify-center">
                    <img src="/assets/images/logo-primary.png" alt="Arsa Cendekia" className="w-14 fill-current" />
                    <div className="leading-tight">
                        <p className="font-bold">Arsa</p>
                        <p className="font-bold">Cendekia</p>
                    </div>
                </Link>

                <div className="absolute bottom-12 z-20 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-white">Selamat Datang di Arsa Cendekia</h2>
                    <p className="max-w-md text-lg text-gray-300">Platform pembelajaran terpercaya untuk akuntansi, keuangan, dan perpajakan</p>
                </div>

                <img
                    src="/assets/images/login-illustration.webp"
                    alt="Arsa Cendekia"
                    className="absolute bottom-0 z-0 w-3/4 max-w-md object-contain"
                />

                <img src="/assets/images/chat-bubble.webp" alt="Arsa Cendekia" className="absolute top-1/3 left-1/6 z-0 w-20" />
                <img src="/assets/images/chat-bubble.webp" alt="Arsa Cendekia" className="absolute top-1/4 right-1/6 z-0 w-20 scale-x-[-1]" />
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center">
                        <img src="/assets/images/logo-primary.png" alt="Arsa Cendekia" className="block w-20 fill-current lg:hidden" />
                    </Link>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-muted-foreground text-sm text-balance">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
