
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ListarUsuarioDto, selectOptions } from '../interfaces/usuarios';
import { Estados } from '../interfaces/rutas';

@Injectable({
  providedIn: 'root'
})
export class DataService {

 
  private _usuariosData: WritableSignal<ListarUsuarioDto[]> = signal<ListarUsuarioDto[]>([]);
  private  estadoData   :WritableSignal<selectOptions[]> = signal<selectOptions[]>([]);

   

  setUsuarios(data: ListarUsuarioDto[]): void {
    this._usuariosData.set(data);
  }
  getUsuarios(): WritableSignal<ListarUsuarioDto[]> {
    return this._usuariosData;
  }

  setEstados(data: selectOptions[]): void {
    this.estadoData.set(data);
  }
  getEstados(): WritableSignal<selectOptions[]> {
    return this.estadoData;
  }

  // Opcional: Si quieres una signal computada más elaborada (ej. filtrar, mapear)
  // public readonly usuariosActivos: Signal<Usuario[]> = computed(() => {
  //   return this._usuariosData().filter(user => user.activo); // Suponiendo que hay una propiedad 'activo'
  // });
  // getDataUsuarios(): WritableSignal<ListarUsuarioDto[]> {
  //   return this._usuariosData;
  // }
  constructor() {
 
  }

}
