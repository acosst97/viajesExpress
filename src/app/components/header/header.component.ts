import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router) { }

  logout() {
    // Aquí podrías agregar lógica para limpiar la sesión del usuario
    localStorage.removeItem('token'); // Ejemplo: eliminar un token del localStorage
    this.router.navigate(['/galeria']); // Redirige al usuario a la ruta '/home'
  }
}
