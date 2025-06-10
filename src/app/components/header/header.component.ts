import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginData } from '../../interfaces/loginRequest';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';
import { CustomSrvService } from '../../services/custom-srv.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  customSrv                 = inject(CustomSrvService);
  @ViewChild('RecoveryModal') recoveryModal: any;
  @ViewChild('Profile') profile: any;
  usuario: LoginData;
  email: FormControl;
  loadingData = signal(false);
  showResponseModal         : boolean = false;
  constructor(private router: Router, private authSrv: AuthService) {}
  ngOnInit(): void {
    this.email = new FormControl('', [Validators.required]);
    this.usuario = this.authSrv.obtenerUsuario();
    this.customSrv.toast$.subscribe((message) => {
      this.showResponseModal = !!message;
    });
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    this.router.navigate(['/home']);
    this.authSrv.cerrarSesion();
  }
  openProfile() {
    this.profile.showModal = true;
  }
  openRecovery(){
    this.recoveryModal.showModal = true;
  }

  generateEmail(emailControl: FormControl) {
    this.loadingData.update(() => true);
    console.log('email', emailControl.value);
    if (emailControl.valid) {
      this.authSrv.recoveryPassword(emailControl.value).subscribe({
        next: (res) => {
          console.log('response email', res);
             this.customSrv.showToast({ text: 'Se ha enviado un enlace a tu correo electrónico', type: 'success-white', duration: 2000 });
        },
        error:(error) => {
          const mensaje = error?.error.mensaje || 'Error en la consulta';
           console.log('response email',error);
          this.loadingData.update(() => false);
           this.customSrv.showToast({ text: mensaje, type: 'error-white', duration: 2000 });
        },
        complete: async () => {
          await new Promise(resolve=>setTimeout(resolve,1500));
          this.loadingData.update(() => false);
          this.recoveryModal.showModal = false;
        },
      });
    } else {
      console.log('El correo electrónico no es válido.');
      this.customSrv.showToast({ text: 'campo Invalido', type: 'error-white', duration: 2000 });
    }
  }
}
