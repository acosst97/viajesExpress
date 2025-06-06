import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../../services/auth.service';
import { LoginData } from '../../interfaces/loginRequest';
const SECRET_KEY = 'tu_clave_secreta';
@Component({
  selector: 'app-nav-board',
  standalone: true,
  imports: [RouterLink,CommonModule,RouterLinkActive],
  templateUrl: './nav-board.component.html',
  styleUrl: './nav-board.component.scss'
})
export class NavBoardComponent {
  usuario: LoginData;
  roles: string[] = [];


  puedeVerUsuarios: boolean = false;
  puedeVerVehiculosServicios: boolean = false;
  puedeVerReservaciones: boolean = false;
  ngOnInit(): void {
    this.usuario = this.authSrv.obtenerUsuario();
    console.log("usuario desencriptado navboard", this.usuario);
    this.roles = this.usuario?.roles || [];

    this.puedeVerUsuarios = this.tieneAlgunRol(['ADMINISTRADOR', 'EMPLEADO', 'CLIENTE']);
    this.puedeVerVehiculosServicios = this.tieneAlgunRol(['ADMINISTRADOR', 'EMPLEADO']);
    this.puedeVerReservaciones = this.tieneAlgunRol(['EMPLEADO', 'CLIENTE']);
  }

  tieneRol(rol: string): boolean {
    return this.roles.includes(rol);
  }

  tieneAlgunRol(rolesPermitidos: string[]): boolean {
    return this.roles.some(rol => rolesPermitidos.includes(rol));
  }
  constructor(private authSrv:AuthService){}
}
