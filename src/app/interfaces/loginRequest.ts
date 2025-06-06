export interface LoginRequest {
  correo: string;
  password?: string;
}

export interface Usuario {
  idUsuario: number;
  primerNombre: string;
  segundoNombre: string | null; 
  primerApellido: string;
  segApellido: string | null;   
  fecha_nacimiento: string;     
  experiencia: number;
  telefono: string;
  correo: string;
  password?: string;           
  rol: any[];                   
  cargos: any[];                
  vehiculos: any[];             
  reservaciones: any[];
}

export interface LoginData {
  idUsuario:      number;
  primerNombre:   string;
  primerApellido: string;
  correo:         string;
  roles:          string[];
}

export interface RegistroRequest {
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segApellido?: string;
  fechaNacimiento: string;
  experiencia: number;
  telefono: string;
  correo: string;
  password: string;
}