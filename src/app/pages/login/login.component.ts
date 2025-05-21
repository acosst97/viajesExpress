import { Component, ViewChild } from '@angular/core';
import { NavComponent } from "../../components/nav/nav.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../components/modal/modal.component";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavComponent, ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild("AbriModal") abriModal: any;
  @ViewChild("RecoveryModal") recoveryModal: any;
  registroForm: FormGroup;
  loginForm: FormGroup;
  userLogin: any;
  loginError: string = '';
  registroError: string = '';
  email: FormControl;
  constructor(private authService: AuthService, // Inyecta el servicio
    private router: Router) { }
  ngOnInit(): void {
    this.registroForm = new FormGroup({
      documento:new FormControl('', Validators.required),
      primerNombre: new FormControl('', Validators.required),
      segundoNombre: new FormControl(''),
      primerApellido: new FormControl('', Validators.required),
      segApellido: new FormControl(''),
      fechaNacimiento: new FormControl('', Validators.required),
      experiencia: new FormControl('', [Validators.required, Validators.min(0)]), // Ejemplo de validación numérica
      telefono: new FormControl('', Validators.required),
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
    this.loginForm = new FormGroup({
      correoElectronico: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', Validators.required)
    });
    this.email = new FormControl('', [Validators.required]);
  }
  generateToken(length: number = 32): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log('token', token); 
    return token;
  }
  login() {
    if (this.loginForm.valid) {
      const { correoElectronico, contrasena } = this.loginForm.value;
      this.authService.login({ correo: correoElectronico, password: contrasena })
        .subscribe(
          (response) => {
            const token = this.generateToken();
            sessionStorage.setItem('authToken', token)
            console.log('Login exitoso', response);
            this.userLogin = response;
            sessionStorage.setItem('currentUser', JSON.stringify(response));

            this.router.navigate(['/dashboard']);
            this.loginError = '';
          },
          (error) => {
            console.error('Error en el login', error);
            this.loginError = 'Correo o contraseña incorrectos.';

          }
        );
    } else {
      this.loginError = 'Por favor, completa todos los campos correctamente.';
    }
  }
  registre() {
    if (this.registroForm.valid) {
      const registroData = {
        primerNombre: this.registroForm.get('primerNombre')?.value,
        segundoNombre: this.registroForm.get('segundoNombre')?.value,
        primerApellido: this.registroForm.get('primerApellido')?.value,
        segApellido: this.registroForm.get('segApellido')?.value,
        fechaNacimiento: this.registroForm.get('fechaNacimiento')?.value,
        experiencia: this.registroForm.get('experiencia')?.value,
        telefono: this.registroForm.get('telefono')?.value,
        correo: this.registroForm.get('correo')?.value,
        password: this.registroForm.get('password')?.value
      };

      this.authService.registrarUsuario(registroData).subscribe(
        (response) => {
          console.log('Registro exitoso', response);
          this.registroForm.reset(); // Limpia el formulario después del registro
          this.abriModal.showModal = false; // Cierra el modal
          this.registroError = ''; // Limpia cualquier mensaje de error
          // Puedes mostrar un mensaje de éxito al usuario, por ejemplo, usando un servicio de notificaciones
        },
        (error) => {
          console.error('Error en el registro', error);
          this.registroError = 'Error al registrar el usuario.';
          // Aquí puedes analizar el error del backend para mostrar mensajes más específicos
          if (error.error && error.error.message) {
            this.registroError = error.error.message; // Ejemplo si el backend envía un mensaje de error
          } else if (error.status === 409) {
            this.registroError = 'El correo electrónico ya está registrado.'; // Ejemplo de manejo de código de estado
          }
        }
      );
    } else {
      this.registroError = 'Por favor, completa todos los campos de registro correctamente.';
    }
  }


  generateEmail(emailControl: FormControl) {
    console.log("emaio", emailControl.value);
    if (emailControl.valid) {
      this.authService.recoveryPassword(emailControl.value).pipe(
        tap((response) => {
          console.log("Correo enviado exitosamente", response);
        }),
        catchError((error) => {
          console.error("Error al solicitar recuperación", error);

          return of(null);
        })
      ).subscribe();
    } else {
      console.log("El correo electrónico no es válido.");

    }
  }
  openRecovery() {
    this.recoveryModal.showModal = true;
  }
  openModal() {
    this.registroError = ''; // Limpia cualquier mensaje de error al abrir el modal
    this.registroForm.reset(); // Limpia el formulario al abrir el modal
    this.abriModal.showModal = true;
  }
}
