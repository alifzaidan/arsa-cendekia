import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Banknote, BookText, Dock, DollarSign, LayoutGrid, List, MonitorPlay, SquareMousePointer, User, UserCheck } from 'lucide-react';

const allNavItems: (NavItem & { roles: string[] })[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
        roles: ['admin', 'mentor', 'affiliate'],
    },
    {
        title: 'Pengguna',
        href: '/admin/users',
        icon: User,
        roles: ['admin'],
    },
    {
        title: 'Afiliasi',
        href: '/admin/affiliates',
        icon: UserCheck,
        roles: ['admin'],
    },
    // {
    //     title: 'Mentor',
    //     href: '/admin/mentors',
    //     icon: Users,
    //     roles: ['admin'],
    // },
    {
        title: 'Kategori',
        href: '/admin/categories',
        icon: List,
        roles: ['admin', 'mentor'],
    },
    {
        title: 'Tools',
        href: '/admin/tools',
        icon: SquareMousePointer,
        roles: ['admin', 'mentor'],
    },
    {
        title: 'Kelas Online',
        href: '/admin/courses',
        icon: BookText,
        roles: ['admin', 'mentor', 'affiliate'],
    },
    {
        title: 'Webinar',
        href: '/admin/webinars',
        icon: MonitorPlay,
        roles: ['admin', 'affiliate'],
    },
    {
        title: 'Sertifikat',
        href: '/admin/certificates',
        icon: Dock,
        roles: ['admin'],
    },
    {
        title: 'Kode Diskon',
        href: '/admin/discount-codes',
        icon: Banknote,
        roles: ['admin'],
    },
    // {
    //     title: 'Flyer Promosi',
    //     href: '/admin/promotions',
    //     icon: Proportions,
    //     roles: ['admin'],
    // },
    {
        title: 'Transaksi',
        href: '/admin/transactions',
        icon: DollarSign,
        roles: ['admin'],
    },
    {
        title: 'Pendapatan',
        href: '/admin/affiliate-earnings',
        icon: DollarSign,
        roles: ['affiliate', 'mentor'],
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const role = auth.role[0];

    const mainNavItems = allNavItems.filter((item) => item.roles.includes(role));

    return (
        <Sidebar collapsible="icon" variant="inset" >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href="/admin/dashboard"
                                prefetch
                                className="flex items-center gap-3"
                            >
                                <div className="relative">
                                    <img
                                        src="/assets/images/logo-primary.png"
                                        alt="Arsa Cendekia"
                                        className="block w-12 dark:hidden"
                                    />
                                    <img
                                        src="/assets/images/logo-secondary.png"
                                        alt="Arsa Cendekia"
                                        className="hidden w-12 dark:block"
                                    />
                                </div>
                                <span className="font-semibold leading-tight text-sm">
                                    Arsa
                                    <span className="block">Cendekia</span>
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
