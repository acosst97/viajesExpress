
export interface ListarReservaciones {
    idReservaciones: number;
    detallePago: string;
    valorPago: number;
    fechaReserva: string;
    fechaViaje: string;
    idUsuario?: number;
    documentoUsuario?: string;
    primerNombre?: string;
    primerApellido?: string;
}

export interface CrearReservacion {
    detallePago: string;
    valorPago: string
    fechaReserva: string
    fechaViaje: string
    documentoUsuario: string
}