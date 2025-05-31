
export interface ListarReservaciones {
    idReservaciones:  number;
    detallePago:      string;
    valorPago:        string;
    fechaReserva:     Date;
    fechaViaje:       Date;
    capacidad:        null;
    vehiculo:         null;
    idUsuario:        number;
    documentoUsuario: string;
    primerNombre:     string;
    primerApellido:   string;
}

export interface CrearReservacion {
    detallePago: string;
    valorPago: string
    fechaReserva: string
    fechaViaje: string
    documentoUsuario: string
}

export interface Dsad {
   
}

