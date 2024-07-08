export const localizationTableConfig = {
    pagination: {
        labelDisplayedRows: '{from}-{to} de {count}',
        labelRows: 'Filas',
        labelRowsPerPage: '',
        firstTooltip: 'Primera página',
        previousTooltip: 'Página anterior',
        nextTooltip: 'Página siguiente',
        lastTooltip: 'Última página'
    },
    toolbar: {
        searchPlaceholder: 'Buscar',
        searchTooltip: 'Buscar'
    },
    body: {
        deleteTooltip: 'Eliminar',
        editTooltip: 'Editar',
        addTooltip: 'Agregar',
        editRow: {
            cancelTooltip: 'Cancelar',
            saveTooltip: 'Guardar',
            deleteText: '¿Desea eliminar este registro?'
        }
    }
}

export const tableOptionConfig: any = {
    pageSize: 10,
    showTitle: false,
    headerStyle: {
        backgroundColor: '#E5E5E5',
        textAlign: 'center',
    },
    padding: "dense",
}