import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';
import { LoginRequest, RegistroRequest, Usuario } from '../interfaces/loginRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/usuarios';
  private urlEmail = 'http://localhost:8080/auth';
  private urlRestablecerContrasena = 'http://localhost:8080/auth/reset-password';


  registrarUsuario(userData: RegistroRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/registro`, userData);
  }

  login(credentials: LoginRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, credentials);
  }

  recoveryPassword(correo: string): Observable<any> {
    const body: any = { correo };
    console.log('URL de la petición:', `${this.urlEmail}/solicitar-recuperacion`);
    console.log('Cuerpo de la petición:', body);
    return this.http.post(`${this.urlEmail}/solicitar-recuperacion`, body);
  }

  restablecerContrasena(token: string, nuevaContrasena: string): Observable<any> {
    const body: Object = { token, nuevaContrasena };
    return this.http.post(this.urlRestablecerContrasena, body);
  }
  private tokenKey = 'authToken';
  private expirationTime: number = 3 * 60 * 1000;
  private tokenCheckInterval: number = 1 * 60 * 1000;
  private intervalSubscription: Subscription | undefined;

  constructor(private router: Router, private http: HttpClient) { }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
    this.startTokenExpirationTimer();
  }

  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.stopTokenExpirationTimer();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  startTokenExpirationTimer(): void {
    this.stopTokenExpirationTimer();

    this.intervalSubscription = interval(this.tokenCheckInterval).subscribe(() => {
      this.checkTokenExpiration();
    });
  }

  stopTokenExpirationTimer(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  checkTokenExpiration(): void {

    const token = this.getToken();
    if (!token) {
      alert('AuthService: Token no encontrado. Redirigiendo al login.');
      this.redirectToLogin();
    } else {
      console.log('AuthService: Token aún presente.');
    }
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}
