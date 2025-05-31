import { Usuario } from './../../../interfaces/loginRequest';


import { Component, computed, effect, inject, ViewChild } from '@angular/core';
import { AlertComponent } from "../../alert/alert.component";
import { CardComponent } from "../../card/card.component";
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../modal/modal.component";
import { RegistroVehiculoDTO, Vehiculo } from '../../../interfaces/vehiculo';
import { SrvGenericosService } from '../../../services/srv-genericos.service';
import { log } from 'node:console';
import { firstValueFrom } from 'rxjs';
import { Table } from '../../../interfaces/table';
import { TableComponent } from '../../table/table.component';
import { FormvalidationService } from '../../../services/formvalidation.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { SelectComponent } from "../../select/select.component";
import { ListarUsuarioDto, selectOptions } from '../../../interfaces/usuarios';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [AlertComponent, CardComponent, CommonModule, ModalComponent, TableComponent, ReactiveFormsModule, SelectComponent],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss'
})
export class VehiculosComponent {
 @ViewChild('OpenEditModal') openEditModal: any;
 @ViewChild('RegistroModal') registroModal: any;
 @ViewChild('ViewInfoModal') viewInfoModal: any;
 @ViewChild('DocSelected') docSelected: any;
 dataSrv      =    inject(DataService);
 veSrv        =    inject(SrvGenericosService);
 formSrv      =    inject(FormvalidationService);
 tableProps    :   Table;
 listVehiculos :   Vehiculo[];
 vehifilter    :   Vehiculo[];
 usuario       :   ListarUsuarioDto[];
 vehiSelected  :   Vehiculo;  
 formRegistro  :   FormGroup;
 formEdit      :   FormGroup;
 formSubmitted :   boolean = false;
 userOption    :   selectOptions[] = [];
 usuarioSelected:  selectOptions;
 fileName      :   string | null = null;

 public docUsuarios = computed(() => this.dataSrv.getUsuarios());
 
 ngOnInit() {
  this.formRegistro = this.formSrv.initFormVehiculo();
  this.formEdit = this.formSrv.initFormVehiculoEdit();
  this.tableProps = {
    filter: 1,
    actions: 1,
    exportar: {
      objeto: '',
    },
    data: '',
    showFilter: true,
    class: 'non-striped',
  };
 this.listarVehiculoSrv();
 this.listarUsuarios();
 }
 constructor(){
  effect(() => {
    const detailsUser = this.docUsuarios();
    console.log('data detailsUser  changed:', detailsUser);
  });
 }

 getValidatorErroVehiculo(fieldName: string) {
  return this.formSrv.getValidationVehiculo(
    this.formRegistro, fieldName, this.formSubmitted);
}
getValidatorErroVehiculoEdit(fieldName: string) {
  return this.formSrv.getValidationVehiculoEdicion(
    this.formEdit, fieldName, this.formSubmitted);
}
//**LISTA USUARIOS */
async listarUsuarios() {
  try {
    const data: any = await firstValueFrom(this.veSrv.listarUsuarios());
    console.log('data usuarios', data);
    if (data) {
      this.usuario = data.usuarios
      this.dataSrv.setUsuarios(this.usuario);
      if (this.usuario.length>0) {
        for (const key in this.usuario) {
          if (Object.prototype.hasOwnProperty.call(this.usuario, key)) {
            const element = this.usuario[key];
            this.userOption.push({id:element.documento, text:element.primerNombre + "  " + element.primerApellido})
          }
         }
      } 
   }
  } catch (error) {
    console.log('error user', error);
  }
}
//*LISTA VEHICULOS
 async listarVehiculoSrv(){
  try {
    const v :any = await firstValueFrom(this.veSrv.listarVehiculos());
    console.log("data vehiculo", v);
    this.listVehiculos = v.vehiculos;
    this.vehifilter = this.listVehiculos.map((vehiculo: any) => {
      const { base64, nombreUsuario, ...data } = vehiculo;
      return data;
    });
      this.tableProps.data = this.vehifilter;
  } catch (error) {
    console.log(error);
  }  
 }

 //lectura archivo a base64
 onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.formRegistro.get('docBase64')?.setValue(reader.result as string);
      this.formRegistro.get('docBase64')?.markAsDirty();
      this.formRegistro.get('docBase64')?.updateValueAndValidity();
      this.fileName = file.name; 
    };

    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
      this.formRegistro.get('docBase64')?.setValue('');
      this.formRegistro.get('docBase64')?.markAsDirty();
      this.formRegistro.get('docBase64')?.updateValueAndValidity();
      this.fileName = null; 
    };

    reader.readAsDataURL(file);
  } else {
    this.clearFile(); // Llama a clearFile si no se selecciona ningún archivo
  }
}
clearFile(): void {
  this.formRegistro.get('docBase64')?.setValue('');
  this.formRegistro.get('docBase64')?.markAsDirty(); 
  this.formRegistro.get('docBase64')?.updateValueAndValidity(); 
  this.fileName = null; 
}
onSubmit(): void {
  this.formSubmitted = true;
  console.log('doc', this.docSelected.selectOption);
  const selectedDocumentId = this.usuarioSelected ? this.usuarioSelected.id : null;
  if (this.formRegistro.valid && this.formSubmitted === true && this.docSelected.selectOption) {
    const formValues = this.formRegistro.value;
    const vehiculoDataDTO:RegistroVehiculoDTO = {
     documento:selectedDocumentId,
  ...formValues
}
    console.log('Datos del vehículo a enviar:', vehiculoDataDTO);
    this.registro(vehiculoDataDTO);
  } else {
    console.log('El formulario es inválido. Por favor, revisa los campos.');
    this.formRegistro.markAllAsTouched();
    this.formSubmitted =false; 
  }
}

    onUsuarioSelected(event:any){
      console.log("usuario selecte", event);
     this.usuarioSelected = event;
     console.log("usuario selecte", this.usuarioSelected);
    }
  registro(vehiculo: any) {
    this.veSrv.registrarVehiculos(vehiculo).subscribe({
      next: (data) => {
        console.log("Registro exitoso", data);
        this.formSubmitted =false; 
        this.listarVehiculoSrv();
      },
      error: (err) => {
        console.error("Error al registrar el vehículo", err); // aquí 
      }
    });   
  
  }
  openRegistre(){
    this.registroModal.showModal = true;
  }
  
/**EDICION */
  editarVehiculo(vehiculo: Vehiculo) {
    this.openEditModal.showModal = true;
    this.vehiSelected = vehiculo;
    this.formEdit.patchValue({
      capacidad: vehiculo.capacidad,
      documentacion: vehiculo.documentacion,
      placaVehiculo: vehiculo.placaVehiculo,
      seguroVig: vehiculo.seguroVig,
      modelo: vehiculo.modelo,
      docBase64: '' // lo puedes dejar vacío si no se va a actualizar
    });
    this.formEdit.get('documentacion')?.disable();
  }
  onSubmitEdit() {
    this.formSubmitted = true;
    if (this.formEdit.invalid) return;
    const formValue = this.formEdit.getRawValue(); // incluye valores deshabilitados
      const actualizarVehiculoDTO = {
        idVehiculo: this.vehiSelected.idVehiculo,
        documento: this.vehiSelected.documentoUsuario, 
        ...formValue
      };
      console.log("data a enviar", actualizarVehiculoDTO),
      this.veSrv.actualizarVehiculo(actualizarVehiculoDTO).subscribe({
        next: res => {console.log("log actualizacion", res)
          this.listarVehiculoSrv();
          this.formSubmitted = false;
        },
        error: err => alert(`${err.error?.mensaje}, + "error"` || 'Error actualizando vehículo')
      });
  }

 //*ASIGNACION DE VEHICULO
  viewData(data:Vehiculo){
    const dataVehi = this.listVehiculos.find(d=> d.idVehiculo === data.idVehiculo);
    if (dataVehi) {
      this.vehiSelected = dataVehi;
      console.log("data",this.vehiSelected);
      
     this.viewInfoModal.showModal = true;
    }
  }
  asigneConfirm(data:Vehiculo){
   try {
    const id = data.idVehiculo;
    const usuario = this.usuarioSelected.id;
    const Dto = {
    idVehiculo: id,
    documentoUsuario: usuario
    }
     this.veSrv.asignVehicle(Dto).subscribe({
      next: (data) => {
        console.log("Asignación completa exitoso", data);
        this.listarVehiculoSrv();
      },
      error: (err) => {
        console.error("Error al registrar el vehículo", err); 
      }
     });
   } catch (error) {
    console.log("error de servicio",error);
    
   }
  }
  downloadVehicleDocument(): void {
    if (this.vehiSelected && this.vehiSelected.base64 && this.vehiSelected.documentacion) {
      const fileName = this.vehiSelected.documentacion;
      let base64String = this.vehiSelected.base64;
      let fileType = 'application/octet-stream';
      if (base64String.includes(';base64,')) {
        const parts = base64String.split(';base64,');
        fileType = parts[0].replace('data:', ''); 
        base64String = parts[1]; 
      }
      this.download(base64String, fileName, fileType);
    } else {
      console.warn('No base64 document or file name available for download.');
    
    }
  }
  
  download(content: string, name: string, type: string = 'application/octet-stream') {
    const link = document.createElement('a');
    link.download = name;
    link.href = `data:${type};base64,${content}`; // Ahora esta URL será válida
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
