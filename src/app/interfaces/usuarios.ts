export interface ListarUsuarioDto {
    idUsuario: number;
    documento: string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segApellido: string;
    correo: string;
    nombresRoles: string[];
}