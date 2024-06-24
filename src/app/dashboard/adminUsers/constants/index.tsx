interface Ispecilities {
    value: string;
    label: string;
}

export const specilities: Ispecilities[] = [
    { value: 'PS', label: 'Psicología' },
    { value: 'TO', label: 'Terapia ocupacional' },
    { value: 'PP', label: 'Psicopedagogía' },
    { value: 'TL', label: 'Terapia de lenguaje' },
    { value: 'NEU', label: 'Neuropediatría' },
    { value: 'FS', label: 'Fisioterapia' },
    { value: 'NU', label: 'Nutrición' },
]

export const SPECIALITIES_DICTIONARY: any = {
    'Terapia ocupacional': 'TO',
    'Psicología': 'PS',
    'Psicopedagogía': 'PP',
    'Terapia de lenguaje': 'TL',
    'Neuropediatría': 'NEU',
    'Fisioterapia': 'FS',
    'Nutrición': 'NU',
}

export const SPECIALITIES_VALUES_DICTIONARY: any = {
    'TO': 'Terapia ocupacional',
    'PS': 'Psicología',
    'PP': 'Psicopedagogía',
    'TL': 'Terapia de lenguaje',
    'NEU': 'Neuropediatría',
    'FS': 'Fisioterapia',
    'NU': 'Nutrición',
}

export const ROLES_DICTIONARY: any = {
    'Administrador': 'admin',
    'Especialista': 'specialist',
}