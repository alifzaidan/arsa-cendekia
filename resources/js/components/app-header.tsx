import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookText, Home, Menu, MonitorPlay, Phone, User } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: '/',
    },
    {
        title: 'Kelas Online',
        href: '/course',
    },
    {
        title: 'Webinar',
        href: '/webinar',
    },
    {
        title: 'Kontak',
        href: '/contact',
    },
];

const mobileNavItems = [
    {
        title: 'Beranda',
        href: '/',
        icon: Home,
    },
    {
        title: 'Kelas',
        href: '/course',
        icon: BookText,
    },
    {
        title: 'Webinar',
        href: '/webinar',
        icon: MonitorPlay,
    },
    {
        title: 'Kontak',
        href: '/contact',
        icon: Phone,
    },
];

const activeItemStyles = 'text-primary dark:text-white';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    // const [searchOpen, setSearchOpen] = useState(false);

    // useEffect(() => {
    //     const down = (e: KeyboardEvent) => {
    //         if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
    //             e.preventDefault();
    //             setSearchOpen((open) => !open);
    //         }
    //     };
    //     document.addEventListener('keydown', down);
    //     return () => document.removeEventListener('keydown', down);
    // }, []);

    return (
        <>
            <div className="border-sidebar-border/80 bg-background fixed top-0 right-0 left-0 z-40">
                <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                    {/* Mobile Menu : Sementara tidak digunakan karena diganti dengan dock */}
                    <div className="hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between">
                                <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    {/* Logo untuk light mode */}
                                    <img src="/assets/images/logo-primary.png" alt="Arsa Cendekia" className="block w-32 fill-current dark:hidden" />
                                    {/* Logo untuk dark mode */}
                                    <img
                                        src="/assets/images/logo-secondary.png"
                                        alt="Arsa Cendekia"
                                        className="hidden w-32 fill-current dark:block"
                                    />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link key={item.title} href={item.href} className="flex items-center space-x-2 font-medium">
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/" prefetch className="flex items-center space-x-2">
                        {/* Logo untuk light mode */}
                        <img src="/assets/images/logo-primary.png" alt="Arsa Cendekia" className="block w-12 fill-current dark:hidden" />
                        {/* Logo untuk dark mode */}
                        <img src="/assets/images/logo-secondary.png" alt="Arsa Cendekia" className="hidden w-12 fill-current dark:block" />
                        <div className="leading-tight">
                            <p className="font-bold">Arsa</p>
                            <p className="font-bold">Cendekia</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="mx-auto hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => {
                                    const isActive = item.href === '/' ? page.url === '/' : page.url.startsWith(item.href) && item.href !== '/';
                                    return (
                                        <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                            <Link
                                                href={item.href}
                                                className={cn(navigationMenuTriggerStyle(), isActive && activeItemStyles, 'h-9 cursor-pointer px-3')}
                                            >
                                                {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                {item.title}
                                            </Link>
                                            {isActive && (
                                                <div className="bg-primary absolute bottom-4 left-1/2 h-0.5 w-[75%] -translate-x-1/2 translate-y-px dark:bg-white"></div>
                                            )}
                                        </NavigationMenuItem>
                                    );
                                })}
                                {auth.user && (
                                    <NavigationMenuItem className="relative flex h-full items-center">
                                        <Link
                                            href="/profile"
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                page.url.startsWith('/profile') && activeItemStyles,
                                                'hover:bg-primary/5 dark:hover:bg-primary/40 h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            Profil Saya
                                        </Link>
                                    </NavigationMenuItem>
                                )}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* <div className="relative flex items-center space-x-1">
                            <Button variant="outline" onClick={() => setSearchOpen(true)}>
                                <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                                <p className="mr-4 hidden lg:block">Cari Produk...</p>
                                <div className="hidden lg:block">
                                    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                                        <span className="text-xs">⌘</span>K
                                    </kbd>{' '}
                                    /{' '}
                                    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                                        <span className="text-xs">Ctrl</span>K
                                    </kbd>
                                </div>
                            </Button>
                        </div> */}
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-10 rounded-full p-1">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="bg-primary text-primary-foreground rounded-lg dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button variant="secondary" asChild>
                                    <Link href={route('login')}>Masuk</Link>
                                </Button>
                                <Button variant="default" asChild className="hidden lg:inline-flex">
                                    <Link href={route('register')}>Daftar</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dock */}
            <div className="fixed right-0 bottom-0 left-0 z-50 lg:hidden">
                <div className="bg-background/95 border-border border-t pb-2 shadow-lg backdrop-blur-md">
                    <div className={`grid gap-1 px-2 py-2 ${auth.user ? 'grid-cols-5' : 'grid-cols-4'}`}>
                        {mobileNavItems.map((item) => {
                            const isActive = item.href === '/' ? page.url === '/' : page.url.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex flex-col items-center justify-center rounded-lg px-2 py-3 transition-colors duration-200',
                                        isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                                    )}
                                >
                                    <Icon iconNode={item.icon ?? Home} className="mb-1 h-5 w-6" />
                                    <span className="text-center text-xs leading-none font-medium">{item.title}</span>
                                </Link>
                            );
                        })}

                        {auth.user &&
                            (() => {
                                const isActive = page.url.startsWith('/profile');
                                return (
                                    <Link
                                        key="/profile"
                                        href="/profile"
                                        className={cn(
                                            'flex flex-col items-center justify-center rounded-lg px-2 py-3 transition-colors duration-200',
                                            isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                                        )}
                                    >
                                        <User className="mb-1 h-5 w-6" />
                                        <span className="text-center text-xs leading-none font-medium">Profil</span>
                                    </Link>
                                );
                            })()}
                    </div>
                </div>
            </div>

            {/* <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} /> */}

            {breadcrumbs.length > 1 && (
                <div className="border-sidebar-border/70 flex w-full border-b">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
