export interface MenuItem {
    label: string;
    icon?: string;
    link?: string;
    children?: MenuItem[];
}

export interface MenuSection {
    legend?: string;
    children: MenuItem[];
}

export const menu: MenuSection[] = [
    {
        children: [
            {
                label: 'Dashboard',
                icon: 'fal fa-home',
                link: '/dashboard',
            },
            {
                label: 'Jogos',
                icon: 'fal fa-dice',
                link: '/games',
            },
        ],
    },
];
