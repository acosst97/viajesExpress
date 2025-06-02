export interface RegistroRuta { 
    codRuta: string;
    nombreRuta: string;
    origenRuta: string;
    destinoRuta: string;
    idEstado?: number;
    reservacionesIdReservaciones?: number; 
  }

  export interface Estados {
  idEstado:          number;
  nombreEstado:      string;
  descripcionEstado: string;
}
