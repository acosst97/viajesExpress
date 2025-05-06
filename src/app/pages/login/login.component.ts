import { Component, ViewChild } from '@angular/core';
import { NavComponent } from "../../components/nav/nav.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../components/modal/modal.component";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavComponent, ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild("AbriModal") abriModal : any;
  registroForm: FormGroup; 
  loginForm: FormGroup;
  userLogin:any;
  loginError: string = ''; 
  registroError: string = '';
  constructor(private authService: AuthService, // Inyecta el servicio
    private router: Router ){}
  ngOnInit(): void {
    this.registroForm = new FormGroup({
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
  registre(){}
  openModal(){
    this.registroError = ''; // Limpia cualquier mensaje de error al abrir el modal
    this.registroForm.reset(); // Limpia el formulario al abrir el modal
    this.abriModal.showModal = true;
  }
}
