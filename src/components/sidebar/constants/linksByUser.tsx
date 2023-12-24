import { CalendarDaysIcon, HomeIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/24/outline";

export const adminNavLinks = [
    {
        mainTitle: "Inicio",
        subItems: [
            {
                href: '/dashboard',
                iconComponent: <HomeIcon className="h-6 w-6 text-muted-foreground" />,
                buttonTitle: 'Inicio'
            }
        ]
    },
    {
        mainTitle: "Administración de usuarios",
        subItems: [
            {
                href: '/dashboard/adminUsers',
                iconComponent: <UserGroupIcon className="h-6 w-6 text-muted-foreground" />,
                buttonTitle: 'Especialistas'
            },
            {
                href: '/dashboard/adminPatients',
                iconComponent: <UsersIcon className="h-6 w-6 text-muted-foreground" />,
                buttonTitle: 'Pacientes'
            }
        ]
    },
    {
        mainTitle: "Administración de citas",
        subItems: [
            {
                href: '/dashboard/scheduler',
                iconComponent: <CalendarDaysIcon className="h-6 w-6 text-muted-foreground" />,
                buttonTitle: 'Calendario'
            }
        ]
    },
]

export const specialistNavLinks = [
    {
        mainTitle: "Inicio",
        subItems: [
            {
                href: '/dashboard',
                iconComponent: <HomeIcon className="h-6 w-6 text-muted-foreground" />,
                buttonTitle: 'Inicio'
            }
        ]
    },
    {
        mainTitle: "Administración de usuarios",
        subItems: [
            {
                href: '/dashboard/adminPatients',
                iconComponent: <UserGroupIcon className="h-6 w-6 text-muted-foreground" />,
                buttonTitle: 'Pacientes'
            }
        ]
    },
    {
        mainTitle: "Administración de citas",
        subItems: [
            {
                href: '/dashboard/scheduler',
                iconComponent: <CalendarDaysIcon className="h-6 w-6 text-muted-foreground" />,
                buttonTitle: 'Calendario'
            }
        ]
    },
]