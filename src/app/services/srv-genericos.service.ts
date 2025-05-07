import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearServicioVehiculoDto, ListarServicioVehiculoDto, MensajeDto } from '../interfaces/serviciosVehiculos';

@Injectable({
  providedIn: 'root'
})
export class SrvGenericosService {

  private apiUrl = 'http://localhost:8080/services';

  constructor(private http: HttpClient) { }

  listarServiciosVehiculos(): Observable<ListarServicioVehiculoDto[]> {
    return this.http.get<ListarServicioVehiculoDto[]>(`${this.apiUrl}/listarVehiculos`);
  }

  registrarServicioVehiculo(crearServicio: CrearServicioVehiculoDto): Observable<MensajeDto> {
    return this.http.post<MensajeDto>(`${this.apiUrl}/registerServiciosVehiculos`, crearServicio);
  }

  eliminarServicioVehiculo(id: number): Observable<MensajeDto> {
    return this.http.delete<MensajeDto>(`${this.apiUrl}/${id}`);
  }

}
