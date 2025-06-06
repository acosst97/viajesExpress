export interface ListarUsuarioDto {
  idUsuario:      number;
  documento:      string;
  primerNombre:   string;
  segundoNombre:  string;
  primerApellido: string;
  segApellido:    string;
  telefono:       string;
  correo:         string;
  experiencia:    number;
  roles:          Role[];
}

export enum RolEnum {
  ADMINISTRADOR = "ADMINISTRADOR",
  EMPLEADO = "EMPLEADO",
  CLIENTE = "CLIENTE"
}


export interface UpdateUsuarioDTO {
    idUsuario: number;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido?: string;
    segApellido?: string;
    experiencia?: number;
    telefono: string;
    correo?: string;
  }
  
  export interface UpdateUsuarioRolDTO {
    idUsuario: number;
    idRol: number; 
  }
  
  export interface MensajeDTO {
    mensaje: string;
  }
  
  // Si necesitas un DTO para el rol
  export interface RolDto {
    idRol: number;
    nombreRol: string;
  }

  export interface selectOptions {
    id?: any,
    codigoBanco?: any;
    text?: any,
    value?: any,
    idPersona?: any;
    typeDocument?: any;
    nombreTipoDocumeto?: any;
    nombreCompletoLista?: any;
    codigoDane?: any;
    fkDepartamentoId?: any;
    pkRelacionid?: any;
}  
export interface Roles {
  roles:   Role[];
  mensaje: string;
}

export interface Role {
  idRol:     number;
  nombreRol: string;
}

export interface DesasociateRol{
  success: boolean,
  message: string,
  idUsuario: number,
  idRol: number
}
