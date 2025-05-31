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
          // this.validarCaracterEspecial()
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
      
      }
      return validationErrors;
    }
    return []; // retorno vacio si ya no hay Errores
  }

  initFormVehiculo(): FormGroup {
    return this.fb.group({
      capacidad: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/), // Capacidad debería ser solo números
        Validators.min(1),
        Validators.max(100) // Ejemplo de rango
      ]],
      documentacion: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]*$/), 
        Validators.minLength(5),
        Validators.maxLength(20),
      ]],
      docBase64: ['', [Validators.required]], 
      placaVehiculo: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z]{3}[0-9]{3,4}$/), // Ejemplo: ABC123 o ABC1234
        Validators.minLength(6),
        Validators.maxLength(7)
      ]],
      seguroVig: ['', [
        Validators.required,
        // Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/), // Formato dd/mm/aaaa
        // Aquí podrías agregar un validador personalizado para fechas futuras si lo necesitas
      ]],
      modelo: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]]
    });
  }
  initFormVehiculoEdit(): FormGroup {
    return this.fb.group({
      capacidad: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.min(1),
        Validators.max(100) // Ejemplo de rango
      ]],
      documentacion: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]*$/), 
        Validators.minLength(5),
        Validators.maxLength(20),
      ]],
      placaVehiculo: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z]{3}[0-9]{3,4}$/), 
        Validators.minLength(6),
        Validators.maxLength(7)
      ]],

      seguroVig: ['', [
        Validators.required,
 
      ]],
      modelo: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]]
    });
  }
  //Validacion registro Vehiculo 
  getValidationVehiculo(formGroup: FormGroup, fieldName: string, formSubmitted: boolean) {
    const control = formGroup.get(fieldName);
    const errors = control?.errors;
    const validationErrors = [];
    if (errors) {
      if (formSubmitted || control?.touched || control?.dirty) {
        if (errors['required']) {
          validationErrors.push({ valid: false, message: 'Este campo es requerido' });
        }
        if (errors['minlength']) {
          validationErrors.push({ message: `Mínimo ${control.errors['minlength'].requiredLength} caracteres.`, valid: false });
        }
        if (errors['maxlength']) {
          validationErrors.push({ message: `Máximo ${control.errors['maxlength'].requiredLength} caracteres.`, valid: false });
        }
        if (errors['pattern']) {
          validationErrors.push({ message: 'Formato inválido.', valid: false });
        }
        if (errors['min']) {
          validationErrors.push({ message: `El valor mínimo es ${control.errors['min'].min}.`, valid: false });
        }
        if (errors['max']) {
          validationErrors.push({ message: `El valor máximo es ${control.errors['max'].max}.`, valid: false });
        } 
        if (fieldName === 'docBase64' && errors['required'] && !control.value) {
          validationErrors.push({ message: 'Debe cargar un documento.', valid: false });
        }
      }
    }
    if (validationErrors.length > 0) {
      return validationErrors;
    } 
 
    else if (control?.valid && (formSubmitted || control?.touched || control?.dirty)) {
      return [{ message: 'Campo válido', valid: true }];
    } 

    else {
      return []; 
    }
  }
  getValidationVehiculoEdicion(formGroup: FormGroup, fieldName: string, formSubmitted: boolean) {
    const control = formGroup.get(fieldName);
    const errors = control?.errors;
    const validationErrors = [];
    if (errors) {
      if (formSubmitted || control?.touched || control?.dirty) {
        if (errors['required']) {
          validationErrors.push({ valid: false, message: 'Este campo es requerido' });
        }
        if (errors['minlength']) {
          validationErrors.push({ message: `Mínimo ${control.errors['minlength'].requiredLength} caracteres.`, valid: false });
        }
        if (errors['maxlength']) {
          validationErrors.push({ message: `Máximo ${control.errors['maxlength'].requiredLength} caracteres.`, valid: false });
        }
        if (errors['pattern']) {
          validationErrors.push({ message: 'Formato inválido.', valid: false });
        }
        if (errors['min']) {
          validationErrors.push({ message: `El valor mínimo es ${control.errors['min'].min}.`, valid: false });
        }
        if (errors['max']) {
          validationErrors.push({ message: `El valor máximo es ${control.errors['max'].max}.`, valid: false });
        } 
        if (fieldName === 'docBase64' && errors['required'] && !control.value) {
          validationErrors.push({ message: 'Debe cargar un documento.', valid: false });
        }
      }
    }
    if (validationErrors.length > 0) {
      return validationErrors;
    } 
 
    else if (control?.valid && (formSubmitted || control?.touched || control?.dirty)) {
      return [{ message: 'Campo válido', valid: true }];
    } 

    else {
      return []; 
    }
  }

  constructor(private fb: FormBuilder) { }
}
