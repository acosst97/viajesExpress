import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuariosComponent } from './components/menus/usuarios/usuarios.component';
import { RecoveryComponent } from './components/recovery/recovery.component';
import { VehiculosComponent } from './components/menus/vehiculos/vehiculos.component';
import { ServicesVehiculosComponent } from './components/menus/services-vehiculos/services-vehiculos.component';
import { ReservacionComponent } from './components/menus/reservacion/reservacion.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recovery/:token', component: RecoveryComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' }, // Redirige a /dashboard/usuarios por defecto
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'vehiculos', component: VehiculosComponent },
      { path: 'reservaciones', component: ReservacionComponent },
      { path: 'servicios', component: ServicesVehiculosComponent },
      // Puedes agregar más rutas hijas aquí para otras secciones del dashboard
    ]
  },
  { path: 'dashBoard', redirectTo: '/dashboard' } // Redirige la ruta duplicada
];
