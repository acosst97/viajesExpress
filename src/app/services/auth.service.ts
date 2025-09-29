import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { interval, Observable, Subscription } from 'rxjs';
import { LoginData, LoginRequest, RegistroRequest, Usuario } from '../interfaces/loginRequest';
import { isPlatformBrowser } from '@angular/common';
const SECRET_KEY = 'tu_clave_secreta';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/usuarios';
  private urlAuth = 'http://localhost:8080/auth';
  protected isBrowser: boolean;

  registrarUsuario(userData: RegistroRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/registro`, userData);
  }

  login(credentials: LoginRequest): Observable<LoginData> {
    return this.http.post<LoginData>(`${this.apiUrl}/login`, credentials);
  }

  recoveryPassword(correo: string): Observable<any> {
    const body: any = { correo };
    console.log('URL de la petición:', `${this.urlAuth}/solicitar-recuperacion`);
    console.log('Cuerpo de la petición:', body);
    return this.http.post(`${this.urlAuth}/solicitar-recuperacion`, body);
  }

  restablecerContrasena(token: string, nuevaContrasena: any): Observable<any> {
    const body: Object = { token, nuevaContrasena };
    console.log("body recovery", body);
    console.log('URL de la petición:', `${this.urlAuth}/reset-password`);
    return this.http.post(`${this.urlAuth}/reset-password`, body, { responseType: 'text' });
  }
  private tokenKey = 'authToken';
  private expirationTime: number = 3 * 60 * 1000;
  private tokenCheckInterval: number = 1 * 60 * 1000;
  private intervalSubscription: Subscription | undefined;

  constructor(private router: Router, private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object ) { 
    this.isBrowser = isPlatformBrowser(this.platformId); 
  }

   getToken(): string | null {
    if (this.isBrowser) { // Solo accede a sessionStorage si estás en un navegador
      return sessionStorage.getItem(this.tokenKey);
    }
    return null;
  }

  setToken(token: string): void {
    if (this.isBrowser) { // Solo accede a sessionStorage si estás en un navegador
      sessionStorage.setItem(this.tokenKey, token);
      this.startTokenExpirationTimer();
    }
  }

   clearToken(): void {
    if (this.isBrowser) { // Solo accede a sessionStorage si estás en un navegador
      sessionStorage.removeItem(this.tokenKey);
      this.stopTokenExpirationTimer();
    }
  }

  isAuthenticated(): boolean {
    if (this.isBrowser) { // Solo accede a sessionStorage si estás en un navegador
      return !!this.getToken();
    }
    return false; // No autenticado si no estás en un entorno de navegador
  }

  startTokenExpirationTimer(): void {
    if (this.isBrowser) { // Solo inicia el temporizador si estás en un navegador
      this.stopTokenExpirationTimer();
      this.intervalSubscription = interval(this.tokenCheckInterval).subscribe(() => {
        this.checkTokenExpiration();
      });
    }
  }
  

  stopTokenExpirationTimer(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

 checkTokenExpiration(): void {
    if (this.isBrowser) { // Solo verifica la expiración del token si estás en un navegador
      const token = this.getToken();
      if (!token) {
        alert('AuthService: Token no encontrado. Redirigiendo al login.');
        this.redirectToLogin();
      } else {
        console.log('AuthService: Token aún presente.');
      }
    }
  }

  redirectToLogin(): void {
    // Esta navegación debería funcionar incluso en SSR, pero la redirección real
    // solo ocurrirá en el navegador después de la hidratación.
    this.router.navigate(['/login']);
  }

  obtenerUsuario(): any {
    if (this.isBrowser) { // Solo accede a sessionStorage si estás en un navegador
      const encrypted = sessionStorage.getItem('usuario');
      if (!encrypted) return null;
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    }
    return null;
  }

  cerrarSesion() {
    if (this.isBrowser) { // Solo accede a sessionStorage si estás en un navegador
      sessionStorage.removeItem('usuario');
    }
  }
}
