import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormvalidationService } from '../../services/formvalidation.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './recovery.component.html',
  styleUrl: './recovery.component.scss'
})
export class RecoveryComponent {
  formSrv = inject(FormvalidationService)
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

  ngOnInit() {
    // this.customSrv.toast$.subscribe((message) => {
    //   this.showResponseModal = !!message;
    // });
    this.token = this.getUrlParams();
    this.validRecoveryForm = this.formSrv.initFormRecovery();
  }
  constructor(private router: Router) {
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
  async recoveryPassworsdConfirm() {


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
      this.recoveryPassworsdConfirm();
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
