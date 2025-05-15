import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearServicioVehiculoDto, ListarServicioVehiculoDto, MensajeDto } from '../interfaces/serviciosVehiculos';
import { CrearReservacion, ListarReservaciones } from '../interfaces/reservaciones';
import { ListarUsuarioDto } from '../interfaces/usuarios';

@Injectable({
  providedIn: 'root'
})
export class SrvGenericosService {

  private apiUrl = 'http://localhost:8080/services';
  private apiUrlReserva = 'http://localhost:8080/reservaciones';
  private apiUrlVehiculos = '';
  constructor(private http: HttpClient) { }

  private apiUsuarios = 'http://localhost:8080/usuarios';

  //------------ servicios servicios de viaje --------------  // 
  listarServiciosVehiculos(): Observable<ListarServicioVehiculoDto[]> {
    return this.http.get<ListarServicioVehiculoDto[]>(`${this.apiUrl}/listarServiciosVehiculos`);
  }

  registrarServicioVehiculo(crearServicio: CrearServicioVehiculoDto): Observable<MensajeDto> {
    return this.http.post<MensajeDto>(`${this.apiUrl}/lstReservaciones`, crearServicio);
  }

  eliminarServicioVehiculo(id: number): Observable<MensajeDto> {
    return this.http.delete<MensajeDto>(`${this.apiUrl}/${id}`);
  }

  //------------ servicios Reservaciones --------------  //
  ListarReservaciones(): Observable<ListarReservaciones[]> {
    return this.http.get<ListarReservaciones[]>(`${this.apiUrlReserva}/lstReservaciones`);
  }

  registrarReservaciones(objectReservas: CrearReservacion): Observable<MensajeDto> {
    return this.http.post<MensajeDto>(`${this.apiUrlReserva}/registrarReservacion`, objectReservas);
  }
  //---------------usuarios------------------
  listarUsuarios(): Observable<ListarUsuarioDto[]> {
    return this.http.get<ListarUsuarioDto[]>(`${this.apiUsuarios}/listar`);
  }
}
