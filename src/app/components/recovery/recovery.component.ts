import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormvalidationService } from '../../services/formvalidation.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomSrvService } from '../../services/custom-srv.service';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './recovery.component.html',
  styleUrl: './recovery.component.scss'
})
export class RecoveryComponent {
  formSrv = inject(FormvalidationService)
  customSrv = inject(CustomSrvService);

  text = 'string';
  validRecoveryForm: FormGroup;;
  repeatPasswordView: boolean;
  newPasswordView: boolean;
  formSubmitted: boolean;
  loadingData = signal(false);
  // showSuccessModal: boolean;
  showResponseModal: boolean;
  messageResponse: any
  dataUrl: any;
  @ViewChild('RecoveryPassword') recoveryPassword: any;
  token: any;
  nuevaContrasena: string = '';  // Nueva contraseña ingresada por el usuario
  confirmacionContrasena: string = '';
  ngOnInit() {
    this.customSrv.toast$.subscribe((message) => {
      this.showResponseModal = !!message;
    });
    this.token = this.getUrlParams();
    this.validRecoveryForm = this.formSrv.initFormRecovery();
  }
  constructor(private router: Router, private authSrv: AuthService) {
    this.getUrlParams();
  }


  //NOTE Deshabilita la acción de copiar
  disableCopy(event: ClipboardEvent) {
    event.preventDefault();
  }

  //NOTE Deshabilita la acción de pegar
  disablePaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  //NOTE Deshabilita el menú contextual (click derecho)
  disableContextMenu(event: MouseEvent) {
    event.preventDefault();
  }


  //---------------------------------------------------------------------------------------// 
  //   //************** Servicio  confirmacion Recovery Pássword  **********               //                                                                                   
  //-------------------------------------------------------------------------------------- //
  async recoveryPasswordConfirm() {
    const password = this.validRecoveryForm.get('recoveryKey').value;

    try {
      const response = await this.authSrv.restablecerContrasena(this.token, password);
      this.customSrv.showToast({ text: 'Contraseña restablecida con éxito', type: 'success-white', duration: 2000 });
      console.log('Contraseña restablecida con éxito', response);
      alert('Contraseña restablecida con éxito');
      this.router.navigate(['/login']);

    } catch (error) {
      // Si ocurre un error, manejarlo aquí
      console.error('Error al restablecer la contraseña', error);
      alert('Ocurrió un error. Intenta de nuevo más tarde');
    }
  }
  //NOTE Validacion Formulario Recovery
  getErrorRecoveryPassword(fieldName: string) {
    return this.formSrv.getValidationErrorRecoveryPassword(
      this.validRecoveryForm,
      fieldName,
      this.formSubmitted
    )
  }
  onSubmitRecoveryConfirm() {
    if (this.validRecoveryForm.valid) {
      this.recoveryPasswordConfirm();
    } else {
      this.validRecoveryForm.markAsTouched();
    }
  }



  //**  Metodo para cambiar el hidden de contraseñas**/
  showHideNewPassword() {
    this.newPasswordView = !this.newPasswordView;
  }
  showHideRepeatPassword() {
    this.repeatPasswordView = !this.repeatPasswordView;
  }
  getUrlParams() {
    try {
      /* -------------------------------- forma uno ------------------------------- */
      // const queryString = window.location.search;
      // this.showLog.log(queryString);
      /* ----------------------------- obtiene la url ----------------------------- */
      let href = this.router.url;

      /* --------------------- obtiene la respuesta de la data -------------------- */
      let res = href.split("/", 3);

      /* ------------ convierte los caracteres del formato url a ascii ------------ */

      const path = window.location.pathname;
      const segment = path.split('/');
      const token = segment[segment.length - 1];
      console.log("path******", token);

      return token;

    } catch (error) {
      console.log('Error al procesar los params.')
      return undefined;
    }
  }

}
