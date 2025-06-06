import { Component, inject, signal, ViewChild } from '@angular/core';
import { NavComponent } from '../../components/nav/nav.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { CustomSrvService } from '../../services/custom-srv.service';
import { FormvalidationService } from '../../services/formvalidation.service';
import { AlertComponent } from '../../components/alert/alert.component';
import * as CryptoJS from 'crypto-js';
import { LoginData } from '../../interfaces/loginRequest';
const SECRET_KEY = 'tu_clave_secreta';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NavComponent,
    ReactiveFormsModule,
    CommonModule,
    ModalComponent,
    AlertComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @ViewChild('AbriModal')     abriModal: any;
  @ViewChild('RecoveryModal') recoveryModal: any;
  customSrv                 = inject(CustomSrvService);
  formSrv                   = inject(FormvalidationService);
  loadingData               = signal(false);
  registroForm              : FormGroup;
  loginForm                 : FormGroup;
  userLogin                 : LoginData;
  formSubmitted             : boolean = false;
  showResponseModal         : boolean = false;
  email                     : FormControl;
  newPasswordView           : boolean;
  newPasswordLogin          : boolean;
  constructor(
    private authService: AuthService, // Inyecta el servicio
    private router: Router
  ) {}
  ngOnInit(): void {
    this.registroForm = this.formSrv.formRegistreUser();
    this.loginForm = new FormGroup({
      correoElectronico: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      contrasena: new FormControl('', Validators.required),
    });
    this.email = new FormControl('', [Validators.required]);
    this.customSrv.toast$.subscribe((message) => {
      this.showResponseModal = !!message;
    });
  }
  generateToken(length: number = 32): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log('token', token);
    return token;
  }
  login() {
    this.loadingData.update(()=>true);
    if (this.loginForm.valid) {
      const { correoElectronico, contrasena } = this.loginForm.value;
      this.authService
        .login({ correo: correoElectronico, password: contrasena })
        .subscribe(
          {
            next: (data) => {
              const token = this.generateToken();
              console.log('Login exitoso', data);
              const jsonString = JSON.stringify(data);
              const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
              sessionStorage.setItem('usuario', encrypted);
              sessionStorage.setItem('authToken', token);
              this.userLogin = data;
              this.router.navigate(['/dashboard']);
              this.loadingData.update(()=>false);
            
            },
            error: (error) => {
              const mensaje = error.error?.mensaje || 'Error desconocido';
              this.customSrv.showToast({ text: mensaje, type: 'error-white', duration: 2000 });
              console.error('Error en el login', error);
              this.loadingData.update(() => false);

            },
            complete: async () => {
              this.customSrv.showToast({ text: 'Redirigiendo...', type: 'success-white', duration: 2000 })
              await new Promise(resolve=>setTimeout(resolve,2000));
              this.loadingData.update(()=>false);
            },
          }
        
        );
    } else {
      this.customSrv.showToast({ text: 'Valida la información', type: 'error-white', duration: 2000 })
      this.loadingData.update(()=>false);
    }
  }
  registre() {
    try {
      this.loadingData.update(()=>true);
        const registroData = {
          documento: this.registroForm.get('documento')?.value,
          primerNombre: this.registroForm.get('primerNombre')?.value,
          segundoNombre: this.registroForm.get('segundoNombre')?.value,
          primerApellido: this.registroForm.get('primerApellido')?.value,
          segApellido: this.registroForm.get('segApellido')?.value,
          fechaNacimiento: this.registroForm.get('fechaNacimiento')?.value,
          experiencia: this.registroForm.get('experiencia')?.value || null,
          telefono: this.registroForm.get('telefono')?.value,
          correo: this.registroForm.get('correo')?.value,
          password: this.registroForm.get('password')?.value,
        };
  
        this.authService.registrarUsuario(registroData).subscribe(  {
          next: (data) => {
            console.log('Registro exitoso', data);
            this.customSrv.showToast({ text: 'Registro Exitoso', type: 'success-white', duration: 2000 })
            this.registroForm.reset();
            this.abriModal.showModal = false;
            this.loadingData.update(()=>false);
            this.formSubmitted = false;
          },
          error: (error) => {
            const mensaje = error.error?.mensaje || 'Error desconocido';
            this.customSrv.showToast({ text: mensaje, type: 'error-white', duration: 2000 })
            this.loadingData.update(()=>false);
            console.error('Error en el registro', error);
          },
          complete: async () => {
            this.loadingData.update(()=>false);
            this.formSubmitted = false;
          },
        }
        );
    } catch (error) {
      this.customSrv.showToast({ text: 'Error en el servicio', type: 'error-white', duration: 2000 })
      this.loadingData.update(()=>false);
    }
   
  }

  generateEmail(emailControl: FormControl) {
    console.log('emaio', emailControl.value);
    if (emailControl.valid) {
      this.authService
        .recoveryPassword(emailControl.value)
        .pipe(
          tap((response) => {
            console.log('Correo enviado exitosamente', response);
          }),
          catchError((error) => {
            console.error('Error al solicitar recuperación', error);

            return of(null);
          })
        )
        .subscribe();
    } else {
      console.log('El correo electrónico no es válido.');
    }
  }
  openRecovery() {
    this.recoveryModal.showModal = true;
  }
  openModal() {
    this.registroForm.reset();
    this.abriModal.showModal = true;
  }
  showHideNewPassword() {
    this.newPasswordView = !this.newPasswordView;
  }
  showHideNewPasswordLogin() {
    this.newPasswordLogin = !this.newPasswordLogin;
  }

  /**Validacion form */
  getValidatorError(fieldName: string) {
    return this.formSrv.getValidationErrorRecoveryPassword(
      this.registroForm,
      fieldName,
      this.formSubmitted
    );
  }
  save() {
    this.formSubmitted = true;
    if (this.registroForm.valid && this.formSubmitted) {
      this.registre();
    }else{
      this.customSrv.showToast({ text: 'Valida la información', type: 'error-white', duration: 2000 })
      this.registroForm.markAllAsTouched();
    }
  }
}
