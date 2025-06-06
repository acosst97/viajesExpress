
export interface ListarReservaciones {
    detallePago:      string;
    valorPago:        string;
    fechaReserva:     Date;
    fechaViaje:       Date;
    vehiculo:         null;
    idReservaciones:  number;
    idUsuario:        number;
    ruta:             Ruta;
    documentoUsuario: string;
    primerNombre:     string;
    primerApellido:   string;
}

export interface Ruta {
    idRuta:      number;
    codRuta:     string;
    nombreRuta:  string;
    origenRuta:  string;
    destinoRuta: string;
}

export interface CrearReservacion {
    detallePago: string;
    valorPago: string
    fechaReserva: string
    fechaViaje: string
    documentoUsuario: string
    idRuta:number;
}

export interface ProcessedReservation {
    idReservaciones: number;
    detalle: string;
    valor: string;
    fechaReserva: Date; 
    fechaViaje: Date;  
    documento: string;
    nombre: string;
    statusVencimiento?: string;
  }

