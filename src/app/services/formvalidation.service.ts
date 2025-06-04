import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormvalidationService {


  initFormUsuario(){
    return this.fb.group({
      idUsuario: ['', [
      ]],
      documento: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.min(1),
        Validators.max(100) 
      ]],
      primerNombre: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]*$/), 
        Validators.minLength(5),
        Validators.maxLength(20),
      ]],
      primerApellido: ['', [
        Validators.required,
        // Validators.pattern(/^[A-Za-z]{3}[0-9]{3,4}$/), 
      ]],
      segundoNombre: ['', [
       
  
      ]],
      segApellido: ['', [
    
      ]],
  
      experiencia: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]*$/), 
        Validators.minLength(0),
        // Validators.maxLength(20),
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]*$/), 
   
      ]],
      correo: ['', [
        Validators.required,

      ]],
   
    });
  }
  formRegistreUser(){
    return this.fb.group({
      documento: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
     
      ]],
      primerNombre: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]*$/), 
        Validators.minLength(5),
        Validators.maxLength(20),
      ]],
      primerApellido: ['', [
        Validators.required,
      ]],
      segundoNombre: ['', [
      
      ]],
      segApellido: ['', [
    
      ]],
      fechaNacimiento: ['', [
        Validators.required,
      ]],
      experiencia: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]*$/), 
        // Validators.minLength(0),
       
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]*$/), 
   
      ]],
      correo: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/),
        Validators.minLength(8),
        Validators.maxLength(14),
        this.validarMayuscula(),
      ]],
   
    });
  }

//RESERVACIONES
initFormReservas(){
 return  this.fb.group({
    detallePago: ['', Validators.required],
    valorPago: ['', Validators.required],
    fechaReserva: ['', [Validators.required,this.fechaNoPasadaValidator]],
    fechaViaje: ['', [Validators.required, this.fechaNoPasadaValidator]],
    documentoUsuario: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    correo: ['', [Validators.required, Validators.email]],
  });
} 
fechaNoPasadaValidator(control: AbstractControl): ValidationErrors | null {
  const fechaValor = control.value;
  if (!fechaValor) return null;

  const fechaViaje = new Date(fechaValor);
  const hoy = new Date();

  // Quitar horas/minutos/segundos para comparación solo de fechas
  hoy.setHours(0, 0, 0, 0);
  fechaViaje.setHours(0, 0, 0, 0);

  return fechaViaje < hoy ? { fechaPasada: true } : null;
}
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
        Validators.pattern(/^[A-Za-z]{3}[0-9]{3,4}$/), 
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
        if (fieldName === 'images' && errors['required'] && !control.value) {
          validationErrors.push({ message: 'Debe cargar un imagen.', valid: false });
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

  //SERVICIO VEHICULO 
  initFormServices():FormGroup{
    return this.fb.group({
      nombreServicio: ['', [
        Validators.required,
        Validators.min(5),
        Validators.max(45) 
      ]],
      valorServicio: ['', [
        Validators.required,
        Validators.pattern(/^[.0-9]*$/), 
        // Validators.minLength(5),
        // Validators.maxLength(20),
      ]],
      descripcion: ['', [Validators.required]], 
      images: ['', [
        ,
      ]],
    });
  }
  

    //SERVICIO   RUTAS
    initFormRutas():FormGroup{
      return this.fb.group({
        codRuta: ['', [
          Validators.required,
          Validators.min(5),
        ]],
        nombreRuta: ['', [
          Validators.required,
          Validators.pattern(/^[a-zA-Z. -0-9]*$/), 
          Validators.minLength(2),
          Validators.maxLength(20),
        ]],
        origenRuta: ['', [
          Validators.required,
          Validators.pattern(/^[a-zA-Z. -0-9]*$/), 
          Validators.minLength(2),
          Validators.maxLength(20),
        ]],
        destinoRuta: ['', [
          Validators.required,
          Validators.pattern(/^[a-zA-Z. -0-9]*$/),  
          Validators.minLength(2),
          Validators.maxLength(20),
        ]],
    
      });
    }
    getValidationRutasEstados(formGroup: FormGroup, fieldName: string, formSubmitted: boolean) {
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
          if (errors['fechaPasada']) {
            validationErrors.push({ valid: false, message: 'no se permite fechas pasadas,' });
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

    //*Estados form
    initFormEstado():FormGroup{
      return this.fb.group({
        nombreEstado: ['', [
          Validators.required,
          Validators.min(5),
          // Validators.max(45) 
        ]],
        descripcionEstado: ['', [
          Validators.required,
          Validators.pattern(/^[a-zA-Z 0-9]*$/), 
          Validators.minLength(2),
          Validators.maxLength(40),
        ]],
   
      });
    }
  constructor(private fb: FormBuilder) { }
}
