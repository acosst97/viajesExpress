import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import * as CryptoJS from 'crypto-js';
const SECRET_KEY = 'tu_clave_secreta';
@Component({
  selector: 'app-nav-board',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './nav-board.component.html',
  styleUrl: './nav-board.component.scss'
})
export class NavBoardComponent {
  usuario: any;
  roles: string[] = [];

  ngOnInit(): void {
    const encrypted = sessionStorage.getItem('usuario');
    if (encrypted) {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decryptedJson = bytes.toString(CryptoJS.enc.Utf8);
      this.usuario = JSON.parse(decryptedJson);
      this.roles = this.usuario.roles;
      console.log("usuario desencrup",this.usuario);
      
    }
  }

  tieneRol(rol: string): boolean {
    return this.roles.includes(rol);
  }
}
