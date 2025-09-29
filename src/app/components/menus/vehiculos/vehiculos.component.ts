import { LoginData, Usuario } from './../../../interfaces/loginRequest';

import {
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { AlertComponent } from '../../alert/alert.component';
import { CardComponent } from '../../card/card.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../modal/modal.component';
import { RegistroVehiculoDTO, Vehiculo } from '../../../interfaces/vehiculo';
import { SrvGenericosService } from '../../../services/srv-genericos.service';
import { log } from 'node:console';
import { firstValueFrom } from 'rxjs';
import { Table } from '../../../interfaces/table';
import { TableComponent } from '../../table/table.component';
import { FormvalidationService } from '../../../services/formvalidation.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { SelectComponent } from '../../select/select.component';
import { ListarUsuarioDto, selectOptions } from '../../../interfaces/usuarios';
import { resolve } from 'node:path';
import { CustomSrvService } from '../../../services/custom-srv.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [
    AlertComponent,
    CardComponent,
    CommonModule,
    ModalComponent,
    TableComponent,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss',
})
export class VehiculosComponent {
  @ViewChild('OpenEditModal') openEditModal: any;
 @ViewChild('RegistroModal') registroModal: any;
 @ViewChild('ViewInfoModal') viewInfoModal: any;
 @ViewChild('DocSelected') docSelected: any;
 @ViewChild('QuestionModal') questionModal: any;
 dataSrv            =    inject(DataService);
 veSrv              =    inject(SrvGenericosService);
 formSrv            =    inject(FormvalidationService);
 protected authSrv  =   inject(AuthService);
 loadingData        =    signal(false);
 tableProps         :   Table;
 listVehiculos      :   Vehiculo[];
 vehifilter         :   Vehiculo[];
 usuario            :   ListarUsuarioDto[];
 vehiSelected       :   Vehiculo;  
 formRegistro       :   FormGroup;
 formEdit           :   FormGroup;
 formSubmitted      :   boolean = false;
 userOption         :   selectOptions[] = [];
 usuarioSelected    :   selectOptions;
 fileName           :   string | null = null;
 showResponseModal  :   boolean = false;
 seguroAVencer      :   any = null;
 loginData          :   LoginData;
 permiso            :   string[]=[];
  public docUsuarios = computed(() => this.dataSrv.getUsuarios());

  ngOnInit() {
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
    this.formRegistro = this.formSrv.initFormVehiculo();
    this.formEdit = this.formSrv.initFormVehiculoEdit();
    this.listarVehiculoSrv();
    this.listarUsuarios();
    this.customSrv.toast$.subscribe((message) => {
      this.showResponseModal = !!message;
    });
    this.loginData = this.authSrv.obtenerUsuario();
    this.permiso = this.loginData?.roles || [];
  }
  constructor(private customSrv: CustomSrvService) {
    effect(() => {
      const detailsUser = this.docUsuarios();
      console.log('data detailsUser  changed:', detailsUser);
    });
  }

  tieneRol(rol: string): boolean {
    return this.permiso.includes(rol);
  }

  getValidatorErroVehiculo(fieldName: string) {
    return this.formSrv.getValidationVehiculo(
      this.formRegistro,
      fieldName,
      this.formSubmitted
    );
  }
  getValidatorErroVehiculoEdit(fieldName: string) {
    return this.formSrv.getValidationVehiculoEdicion(
      this.formEdit,
      fieldName,
      this.formSubmitted
    );
  }
  //**LISTA USUARIOS */
  async listarUsuarios() {
    try {
      const data: any = await firstValueFrom(this.veSrv.listarUsuarios());
      console.log('data usuarios', data);
      if (data) {
        this.usuario = data.usuarios;
        this.dataSrv.setUsuarios(this.usuario);
        if (this.usuario.length > 0) {
          for (const key in this.usuario) {
            if (Object.prototype.hasOwnProperty.call(this.usuario, key)) {
              const element = this.usuario[key];
              this.userOption.push({
                id: element.documento,
                text: element.primerNombre + '  ' + element.primerApellido,
              });
            }
          }
        }
      }
    } catch (error) {
      console.log('error user', error);
    }
  }
  //*LISTA VEHICULOS
  async listarVehiculoSrv() {
    try {
      const v: any = await firstValueFrom(this.veSrv.listarVehiculos());
      console.log('data vehiculo', v);
      this.listVehiculos = v.vehiculos;
      this.vehifilter = this.listVehiculos.map((vehiculo: any) => {
        const { base64, nombreUsuario, ...data } = vehiculo;
        return data;
      });
      this.tableProps.data = this.vehifilter;
      this.encontrarSeguroProximoAVencer();
    } catch (error) {
      this.tableProps.data = [];
      console.log(error);
    }
  }
  encontrarSeguroProximoAVencer() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let closestVehicle: any = null;
    let smallestDifference = Infinity;

    this.listVehiculos.forEach((vehiculo: any) => {
      const seguroVigDate = new Date(vehiculo.seguroVig);
      seguroVigDate.setHours(0, 0, 0, 0);

      const diffTime = seguroVigDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const warningThresholdDays = 30;
      if (diffDays <= warningThresholdDays) {
        if (Math.abs(diffDays) < smallestDifference) {
          smallestDifference = Math.abs(diffDays);
          closestVehicle = vehiculo;
        }
      }
    });

    this.seguroAVencer = closestVehicle;
    console.log(
      'Vehículo con seguro más próximo a vencer:',
      this.seguroAVencer
    );
  }
  esSeguroVencidoOProximo(seguroVigencia: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const seguroDate = new Date(seguroVigencia);
    seguroDate.setHours(0, 0, 0, 0);

    const diffTime = seguroDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 30;
  }

  esSeguroVencido(seguroVigencia: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const seguroDate = new Date(seguroVigencia);
    seguroDate.setHours(0, 0, 0, 0);

    return seguroDate.getTime() < today.getTime();
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
    const selectedDocumentId = this.usuarioSelected
      ? this.usuarioSelected.id
      : null;
    if (
      this.formRegistro.valid &&
      this.formSubmitted === true &&
      this.docSelected.selectOption
    ) {
      const formValues = this.formRegistro.value;
      const vehiculoDataDTO: RegistroVehiculoDTO = {
        documento: selectedDocumentId,
        ...formValues,
      };
      console.log('Datos del vehículo a enviar:', vehiculoDataDTO);
      this.registro(vehiculoDataDTO);
    } else {
      console.log('El formulario es inválido. Por favor, revisa los campos.');
      this.formRegistro.markAllAsTouched();
      this.formSubmitted = false;
    }
  }

  onUsuarioSelected(event: any) {
    console.log('usuario selecte', event);
    this.usuarioSelected = event;
    console.log('usuario selecte', this.usuarioSelected);
  }
  registro(vehiculo: any) {
    this.loadingData.update(() => true);
    this.veSrv.registrarVehiculos(vehiculo).subscribe({
      next: (data) => {
        console.log('res', data);
         this.customSrv.showToast({
          text: 'Registro exitoso',
          type: 'success-white',
          duration: 3000,
        });
        this.formSubmitted = false;
        this.listarVehiculoSrv();
        this.fileName = null;
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || 'Falló el servicio';
        this.customSrv.showToast({
          text: mensaje,
          type: 'error-white',
          duration: 3000,
        });
        console.error('Error al registrar el vehículo', err); 
      },
      complete: async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.loadingData.update(() => false);
        this.registroModal.showModal = false;
      },
    });
  }
  openRegistre() {
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
      docBase64: '', // lo puedes dejar vacío si no se va a actualizar
    });
    this.formEdit.get('documentacion')?.disable();
  }
  onSubmitEdit() {
    this.formSubmitted = true;
    if (this.formEdit.invalid) return;
    this.loadingData.update(() => true);
    const formValue = this.formEdit.getRawValue(); // incluye valores deshabilitados
    const actualizarVehiculoDTO = {
      idVehiculo: this.vehiSelected.idVehiculo,
      documento: this.vehiSelected.documentoUsuario,
      ...formValue,
    };
    console.log('data a enviar', actualizarVehiculoDTO),
      this.veSrv.actualizarVehiculo(actualizarVehiculoDTO).subscribe({
        next: (res) => {
          console.log('log actualizacion', res);
          this.customSrv.showToast({
            text: res?.mensaje || 'consumo Exitoso',
            type: 'success-white',
            duration: 3000,
          });
          this.listarVehiculoSrv();
          this.formSubmitted = false;
        },
        error: (err) => {
          const mensaje = err?.error?.mensaje || 'Falló el servicio';
          this.customSrv.showToast({
            text: mensaje,
            type: 'error-white',
            duration: 3000,
          });
          this.loadingData.update(() => false);
        },
        complete: async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          this.loadingData.update(() => false);
          this.openEditModal.showModal = false;
        },
      });
  }

  //*ASIGNACION DE VEHICULO
  viewData(data: Vehiculo) {
    const dataVehi = this.listVehiculos.find(
      (d) => d.idVehiculo === data.idVehiculo
    );
    if (dataVehi) {
      this.vehiSelected = dataVehi;
      console.log('data', this.vehiSelected);

      this.viewInfoModal.showModal = true;
    }
  }
  asigneConfirm(data: Vehiculo) {
    if (this.tieneRol('ADMINISTRADOR')) {
      try {
        this.loadingData.update(() => true);
        const id = data.idVehiculo;
        const usuario = this.usuarioSelected.id;
        const Dto = {
          idVehiculo: id,
          documentoUsuario: usuario,
        };
        this.veSrv.asignVehicle(Dto).subscribe({
          next: (data) => {
            this.customSrv.showToast({
              text: 'Asignación Exitosa',
              type: 'error-white',
              duration: 3000,
            });
            console.log('Asignación completa exitoso', data);
          },
          error: (err) => {
            console.error('Error al registrar el vehículo', err);
            this.loadingData.update(() => false);
          },
          complete: async () => {
            this.loadingData.update(() => false);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            this.viewInfoModal.showModal = false;
            this.listarVehiculoSrv();
            this.loadingData.update(() => false);
          },
        });
      } catch (error) {
        console.log('error de servicio', error);
        this.loadingData.update(() => false);
      }
    } else {
      this.customSrv.showToast({
        text: 'Permiso denegado',
        type: 'error-white',
        duration: 2000,
      });
    }
  }
  downloadVehicleDocument(): void {
    if (
      this.vehiSelected &&
      this.vehiSelected.base64 &&
      this.vehiSelected.documentacion
    ) {
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

  download(
    content: string,
    name: string,
    type: string = 'application/octet-stream'
  ) {
    const link = document.createElement('a');
    link.download = name;
    link.href = `data:${type};base64,${content}`; // Ahora esta URL será válida
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  //*ELIMINAR VEHICULO
  eliminarVehiculoSrv() {
    this.loadingData.update(() => true);
    this.veSrv.deleteVehiculo(this.vehiSelected.idVehiculo).subscribe({
      next: (res) => {
        console.log('respuesta', res);
      },
      error: (error) => {
        console.error('error de servicio', error);
      },
      complete: async () => {
        console.log(console.log('comppleado'));
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.loadingData.update(() => false);
        this.questionModal.showModal = false;
        this.listarVehiculoSrv();
      },
    });
  }
  deleteVehi(type: string, data: any) {
    this.vehiSelected = data;
    switch (type) {
      case 'question':
        if (this.tieneRol('ADMINISTRADOR')) {
          this.questionModal.showModal = true;
          console.log('onfo vehi', this.vehiSelected);
        } else {
          this.customSrv.showToast({
            text: 'Permiso denegado',
            type: 'error-white',
            duration: 2000,
          });
        }
        break;
      case 'confirm-delete':
        this.eliminarVehiculoSrv();
        break;
    }
  }
}
