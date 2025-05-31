export interface Vehiculo {
    idVehiculo: number;
    capacidad: number;
    documentacion: string;
    placaVehiculo: string;
    seguroVig: string;
    modelo: string;
    base64:string;
    documentoUsuario: string; 
    nombreUsuario: string;   
  }

  export interface RegistroVehiculoDTO {
    capacidad: string;
    documentacion: string; // Número de documento
    base64: string;     // Documento en formato Base64
    placaVehiculo: string;
    seguroVig: string;     // Fecha de vigencia del seguro
    modelo: string;
    documento:string;
  }

  export interface AsignarVehiculo{
        idVehiculo: any,
    documentoUsuario: string
  }