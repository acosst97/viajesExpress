import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { NavBoardComponent } from "../../components/nav-board/nav-board.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, NavBoardComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('DashboardComponent: ngOnInit llamado.');
    if (!this.authService.isAuthenticated()) {
      console.log('DashboardComponent: Usuario no autenticado, redirigiendo.');
      this.authService.redirectToLogin();
      return;
    }
    this.authService.startTokenExpirationTimer();
    console.log('DashboardComponent: Temporizador de verificación del token iniciado.');
  }
  ngOnDestroy(): void {
    this.authService.stopTokenExpirationTimer(); // Limpiar el intervalo al destruir el componente
  }
}
