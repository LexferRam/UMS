import { CalendarDaysIcon, HomeIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export const adminNavLinks = [
    {
        mainTitle: "Inicio",
        subItems: [
            {
                href: '/dashboard',
                iconComponent: <HomeIcon className="h-5 w-5 text-muted-foreground" />,
                buttonTitle: 'Inicio'
            }
        ]
    },
    {
        mainTitle: "Administración de usuarios",
        subItems: [
            {
                href: '/dashboard/adminUsers',
                iconComponent: <UserGroupIcon className="h-5 w-5 text-muted-foreground" />,
                buttonTitle: 'Especialistas'
            },
            {
                href: '/dashboard/adminPatients',
                iconComponent: <UserGroupIcon className="h-5 w-5 text-muted-foreground" />,
                buttonTitle: 'Pacientes'
            }
        ]
    },
    {
        mainTitle: "Administración de citas",
        subItems: [
            {
                href: '/dashboard/scheduler',
                iconComponent: <CalendarDaysIcon className="h-5 w-5 text-muted-foreground" />,
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
                iconComponent: <HomeIcon className="h-5 w-5 text-muted-foreground" />,
                buttonTitle: 'Inicio'
            }
        ]
    },
    {
        mainTitle: "Administración de usuarios",
        subItems: [
            {
                href: '/dashboard/adminPatients',
                iconComponent: <UserGroupIcon className="h-5 w-5 text-muted-foreground" />,
                buttonTitle: 'Pacientes'
            }
        ]
    },
    {
        mainTitle: "Administración de citas",
        subItems: [
            {
                href: '/dashboard/scheduler',
                iconComponent: <CalendarDaysIcon className="h-5 w-5 text-muted-foreground" />,
                buttonTitle: 'Calendario'
            }
        ]
    },
]