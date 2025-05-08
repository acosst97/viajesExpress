export interface LoginRequest {
  correo: string;
  password?: string;
}

export interface Usuario {
  idUsuario: number;
  primerNombre: string;
  segundoNombre: string | null; // Puede ser nulo si no tiene segundo nombre
  primerApellido: string;
  segApellido: string | null;   // Puede ser nulo si no tiene segundo apellido
  fecha_nacimiento: string;     // Formato YYYY-MM-DD
  experiencia: number;
  telefono: string;
  correo: string;
  password?: string;           // La contraseña usualmente no se devuelve después del login
  rol: any[];                   // Ajusta el tipo si conoces la estructura del rol
  cargos: any[];                // Ajusta el tipo si conoces la estructura de los cargos
  vehiculos: any[];             // Ajusta el tipo si conoces la estructura de los vehículos
  reservaciones: any[];
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