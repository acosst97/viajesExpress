export interface ListarServicioVehiculoDto {
    idServicio: number;
    nombreServicio: string;
    valorServicio: string;
    descripcion: string;
    images?: string;
}

export interface CrearServicioVehiculoDto {
    nombreServicio: string;
    valorServicio: number | null;
    descripcion: string;
    images?: string | null;
}
export interface MensajeDto {
    mensaje: string;
}