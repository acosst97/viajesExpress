import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormvalidationService {

  //--------------------------------------------------------------------------------------//
  //   //*******************  Validacion De formulario RECOVERY Password *** //
  //------------------------------------------------------------------------------------//
  initFormRecovery() {
    return this.fb.group({
      recoveryKey: ['',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/),
          Validators.minLength(8),
          Validators.maxLength(14),
          this.validarMayuscula(),
          this.validarCaracterEspecial()
        ]],
      recoveryconfirm: ['', Validators.required]
    },
      { validator: this.compararClaveLogin });
  }
  compararClaveLogin(formGroup: FormGroup) {
    const pin = formGroup.get('recoveryKey').value;
    const confirmarPin = formGroup.get('recoveryconfirm').value;
    return pin === confirmarPin ? null : { noCoincide: true };
  }
  validarMayuscula() {
    return (control: any) => {
      const Mayuscula = /[A-Z]/.test(control.value);
      return Mayuscula ? null : { mayusculaError: true };

    };
  }
  validarCaracterEspecial() {
    return (control: any) => {
      const tieneCaracterEspecial = /[#$*+%&!@^~;:'"\[\]{}|,.<>\/?]/.test(control.value);
      return tieneCaracterEspecial ? null : { caracter: true };
    };
  }
  getValidationErrorRecoveryPassword(form: FormGroup, fieldName: string, formSubmitted: boolean) {
    const control = form.get(fieldName);
    const errors = control?.errors;
    const validationErrors = [];
    const value = control?.value || '';
    if (errors) {
      if (formSubmitted || control?.touched || control?.dirty) {

        if (errors['required']) {
          validationErrors.push({ valid: false, message: 'Este campo es requerido' });
        }
        if (errors['pattern']) {
          validationErrors.push({ valid: false, message: 'Revisa Espacios o caracteres especiales' });
        }
        if (errors['minlength']) {
          validationErrors.push({ valid: false, message: 'La contraseña debe ser de 8 digitos o mas' });
        }
        if (errors['maxlength']) {
          validationErrors.push({ valid: false, message: 'La contraseña no debe exceder los 14 digitos' });
        }
        if (errors['mayusculaError']) {
          validationErrors.push({ valid: false, message: 'Se requiere una letra Mayuscula' });
        }
        if (errors['caracter']) {
          validationErrors.push({ valid: false, message: 'Se requiere al menos un caracter especial' });
        }
      }
      return validationErrors;
    }
    return []; // retorno vacio si ya no hay Errores
  }
  constructor(private fb: FormBuilder) { }
}
