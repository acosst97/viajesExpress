export interface RegistroRuta { 
    codRuta: string;
    nombreRuta: string;
    origenRuta: string;
    destinoRuta: string;
    idEstado?: number;
  }

  export interface ListaRutasDto {
  idRuta:        number;
  codRuta:       string;
  activa:        boolean;
  nombreRuta:    string;
  origenRuta:    string;
  destinoRuta:   string;
  reservaciones: Reservacione[];
}

export interface Reservacione {
  idReservacion: number;
  detallePago:   string;
  valorPago:     string;
  fechaReserva:  Date;
  fechaViaje:    Date;
}

  export interface Estados {
  idEstado:          number;
  nombreEstado:      string;
  descripcionEstado: string;
}
