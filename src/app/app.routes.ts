import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent  },
    { path: 'login', component: LoginComponent  },
    {
      path: 'dashboard',
      component: DashboardComponent,
      children: [
        { path: '', redirectTo: 'usuarios', pathMatch: 'full' }, // Redirige a /dashboard/usuarios por defecto
        { path: 'usuarios', component: UsuariosComponent },
        // { path: 'tareas', component: TareasComponent },
        // Puedes agregar más rutas hijas aquí para otras secciones del dashboard
      ]
    },
    { path: 'dashBoard', redirectTo: '/dashboard' } // Redirige la ruta duplicada
  ];
