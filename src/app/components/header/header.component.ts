import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginData } from '../../interfaces/loginRequest';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router,private authSrv:AuthService) { }
   usuario:LoginData;
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    this.router.navigate(['/home']);
    this.authSrv.cerrarSesion();
  }
  ngOnInit(): void {
 this.usuario  = this.authSrv.obtenerUsuario();
  }
}
