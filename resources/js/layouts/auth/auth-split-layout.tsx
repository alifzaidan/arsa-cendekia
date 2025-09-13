import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="bg-muted relative hidden h-full flex-col overflow-hidden p-0 text-white lg:flex dark:border-r">
                <img
                    src="/assets/images/login-img.webp"
                    alt="Arsa Cendekia"
                    className="absolute inset-0 z-0 h-full w-full object-cover object-center"
                />
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center">
                        <img src="/assets/images/logo-primary-2.png" alt="Arsa Cendekia" className="block w-20 fill-current dark:hidden" />
                        <img src="/assets/images/logo-secondary-2.png" alt="Arsa Cendekia" className="hidden w-20 fill-current dark:block" />
                    </Link>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold italic">{title}</h1>
                        <p className="text-muted-foreground text-sm text-balance">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
