import { RegistroRuta, Estados } from './../interfaces/rutas';
import { AsignarVehiculo, RegistroVehiculoDTO } from './../interfaces/vehiculo';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CrearServicioVehiculoDto,
  ListarServicioVehiculoDto,
  MensajeDto,
} from '../interfaces/serviciosVehiculos';
import {
  CrearReservacion,
  ListarReservaciones,
} from '../interfaces/reservaciones';
import {
  ListarUsuarioDto,
  MensajeDTO,
  Roles,
  UpdateUsuarioDTO,
  UpdateUsuarioRolDTO,
} from '../interfaces/usuarios';
import { Vehiculo } from '../interfaces/vehiculo';

@Injectable({
  providedIn: 'root',
})
export class SrvGenericosService {
  private apiUsuarios = 'http://localhost:8080/usuarios';
  private apiUrl = 'http://localhost:8080/services';
  private apiUrlReserva = 'http://localhost:8080/reservaciones';
  private apiUrlVehiculos = 'http://localhost:8080/vehiculos';
  private apiRutas = 'http://localhost:8080/rutas';
  private apiEstado = 'http://localhost:8080/estado';
  

  constructor(private http: HttpClient) {}

  //------------ servicios servicios de viaje --------------  //
  listarServiciosVehiculos(): Observable<ListarServicioVehiculoDto[]> {
    return this.http.get<ListarServicioVehiculoDto[]>(
      `${this.apiUrl}/listarServiciosVehiculos`
    );
  }

  registrarServicioVehiculo(
    crearServicio: CrearServicioVehiculoDto
  ): Observable<MensajeDto> {
    return this.http.post<MensajeDto>(
      `${this.apiUrl}/registerServiciosVehiculos`,
      crearServicio
    );
  }
  eliminarServicioVehiculo(id: number): Observable<MensajeDto> {
    return this.http.delete<MensajeDto>(`${this.apiUrl}/${id}`);
  }
  updateSrvVehiculos(
    service: ListarServicioVehiculoDto
  ): Observable<MensajeDto> {
    return this.http.put<MensajeDto>(
      `${this.apiUrl}/updateSrvVehiculos`,
      service
    );
  }
  //-------------------------------------------------------//
  //------------ servicios Reservaciones -------------- * //
  //-------------------------------------------------------//
  ListarReservaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlReserva}/lstReservaciones`);
  }

  registrarReservaciones(
    objectReservas: CrearReservacion
  ): Observable<MensajeDto> {
    return this.http.post<MensajeDto>(
      `${this.apiUrlReserva}/registrarReservacion`,
      objectReservas
    );
  }
  //-------------------------------------------------------//
  //------------ servicios USUARIOS -------------- *      //
  //-------------------------------------------------------//

  listarUsuarios(): Observable<ListarUsuarioDto[]> {
    return this.http.get<ListarUsuarioDto[]>(`${this.apiUsuarios}/listar`);
  }
  // Servicio para actualizar usuario
  editarUsuario(usuario: UpdateUsuarioDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.apiUsuarios}/actualizar`, usuario);
  }

  // Servicio para asignar/actualizar rol de usuario
  actualizarRolUsuario(data: UpdateUsuarioRolDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(
      `${this.apiUsuarios}/actualizar-rol`,
      data
    );
  }

  //listar roles
  listarRoles(): Observable<Roles> {
    return this.http.get<Roles>(`${this.apiUsuarios}/listarRoles`);
  }

  //-------------------------------------------------------//
  //------------ SERVICIOS VEHICULOS -------------- *      //
  //-------------------------------------------------------//
  listarVehiculos(): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.apiUrlVehiculos}/listarVehiculos`);
  }

  registrarVehiculos(objectVe: RegistroVehiculoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(
      `${this.apiUrlVehiculos}/registrarVehiculo`,
      objectVe
    );
  }

  //editar
  actualizarVehiculo(vehiculo: Vehiculo): Observable<any> {
    return this.http.put(`${this.apiUrlVehiculos}/actualizar`, vehiculo);
  }
  //Asignar
  asignVehicle(vehiculo: AsignarVehiculo): Observable<any> {
    return this.http.put(`${this.apiUrlVehiculos}/asignar`, vehiculo);
  }
  //eliminar vehiculo
  deleteVehiculo(id: number): Observable<MensajeDTO> {
    return this.http.delete<MensajeDto>(`${this.apiUrlVehiculos}/${id}`);
  }

  //-------------------------------------------------------//
  //------------ SERVICIOS RUTAS   ------------------ *    //
  //-------------------------------------------------------//
  getListRutes():Observable<any>{
    return this.http.get<any>(`${this.apiRutas}/listarRutas`);
  }
  registrarRutasSrv(objectVe: RegistroRuta): Observable<MensajeDTO> {
    console.log("data llegada",objectVe);
    
    return this.http.post<MensajeDTO>(`${this.apiRutas}/registrar`, objectVe );
  }

   actualizarRutas(rutaObject: any): Observable<any> {
    return this.http.put(`${this.apiRutas}/actualizar`, rutaObject);
  }
    //-------------------------------------------------------//
  //------------ SERVICIOS RUTAS   ------------------ *    //
  //-------------------------------------------------------//
  getListEstados():Observable<any>{
    return this.http.get<any>(`${this.apiEstado}/listar`);
  }
  registrarEstado(objectVe: RegistroRuta): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.apiEstado}/registrar`, objectVe );
  }

   actualizarEstado(estado: Estados): Observable<any> {
    return this.http.put(`${this.apiEstado}/actualizar`, estado);
  }
  deleteEstado(id: number): Observable<MensajeDTO> {
    return this.http.delete<MensajeDto>(`${this.apiEstado}/eliminar/${id}`);
  }

}
