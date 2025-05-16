export interface DataTable {
    filter?: number;
    actions?: number;
    exportar?: Exportar;
    data?: any[];
    showFilter?: boolean;
    class?: string;
}

interface Exportar {
    objeto: string;
    accion?: any;
}

export interface Table {
    filter?: number;
    actions?: number;
    exportar?: Exportar;
    data?: any;
    showFilter?: boolean;
    class?: string;
}