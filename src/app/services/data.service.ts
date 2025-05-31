
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ListarUsuarioDto } from '../interfaces/usuarios';

@Injectable({
  providedIn: 'root'
})
export class DataService {

 
  private _usuariosData: WritableSignal<ListarUsuarioDto[]> = signal<ListarUsuarioDto[]>([]);
 

   

  setUsuarios(data: ListarUsuarioDto[]): void {
 
    this._usuariosData.set(data);
  }

  // Method to get the signal itself (not its value directly)
  getUsuarios(): WritableSignal<ListarUsuarioDto[]> {
    return this._usuariosData;
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
