import {
  Component,
  EventEmitter,
  inject,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CustomSrvService } from '../../services/custom-srv.service';
import { FormvalidationService } from '../../services/formvalidation.service';
import { SrvGenericosService } from '../../services/srv-genericos.service';
import { ModalComponent } from '../modal/modal.component';
import { Table } from '../../interfaces/table';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Estados } from '../../interfaces/rutas';
import { DataService } from '../../services/data.service';
import { selectOptions } from '../../interfaces/usuarios';
import { SelectComponent } from "../select/select.component";

@Component({
  selector: 'app-estado-ruta',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule, CommonModule, SelectComponent],
  templateUrl: './estado-ruta.component.html',
  styleUrl: './estado-ruta.component.scss',
})
export class EstadoRutaComponent {
  
  @ViewChild('OpenRegistreModal') openRegistreModal: any;
  @ViewChild('OpenUpdateModal') openUpdateModal: any;
  @ViewChild('OpenListModal') openListModal: any;
  @Output() sendTo = new EventEmitter<string>();
  srv               =       inject(SrvGenericosService);
  formSrv           =       inject(FormvalidationService);
  customSrv         =       inject(CustomSrvService);
  dataSrv           =         inject(DataService);
  loadingData       =       signal(false);

  tableProps        :       Table;
  formValidation    :       FormGroup;
  showResponseModal :       boolean = false;
  formSubmitted     :       boolean = false;
  viewTable         :       boolean = true;
  estadoSelected    :       Estados;
  listEstado        :       Estados[];
  estadoOption      :       selectOptions[]=[]
  estadoOptionRegis: selectOptions[] = [
  { id: 1, text: 'ACTIVO' },
  { id: 2, text: 'INACTIVO' },
  { id: 3, text: "PENDIENTE" },
  { id: 3, text: "SIN ASIGNAR" },
  { id: 3, text: "ASIGNADO" }
];
  optionSelected    :     selectOptions;     
  constructor() {}
  ngOnInit(): void {
    this.formValidation = this.formSrv.initFormEstado();
    this.getList();
  }
  getList() {
    try {
      this.srv.getListEstados().subscribe({
        next: (data) => {
          console.log('success srv', data);
          this.listEstado = data.estados;
          if (this.listEstado.length > 0) {
            this.customSrv.showToast({
              text: 'success ',
              type: 'success-white',
              duration: 2000,
            });
            this.estadoOption = [];
            for (const key in this.listEstado) {
              if (Object.prototype.hasOwnProperty.call(this.listEstado, key)) {
                const element:Estados = this.listEstado[key];
                this.estadoOption.push({id:element.idEstado, text:element.nombreEstado})
              }
              this.dataSrv.setEstados(this.estadoOption);
            }
          } else {
            this.customSrv.showToast({
              text: 'no hay información para mostar',
              type: 'error-white',
              duration: 2000,
            });
          }
        },
        error: (error) => {
          console.error('error de servicio', error);
          this.customSrv.showToast({
            text: 'Falló la solicitud',
            type: 'error-white',
            duration: 2000,
          });
        },
      });
    } catch (error) {
      this.customSrv.showToast({
        text: 'Falló la solicitud',
        type: 'error-white',
        duration: 2000,
      });
    }
  }

  onSelelec(data:any){
    this.optionSelected = data;
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.formValidation.valid && this.formSubmitted == true) {
      this.registroEstado();
    } else {
      this.formValidation.markAllAsTouched();
      this.customSrv.showToast({
        text: 'Valida la información',
        type: 'error-white',
        duration: 2000,
      });
    }
  }
  registroEstado() {
    try {
      this.loadingData.update(() => true);
      const formValues = this.formValidation.getRawValue();
      const nombreEstado = this.optionSelected.text;
      const req = {
        nombreEstado,
        ...formValues
      }
      console.log('envio cuerpo solcitud', req);
      this.srv.registrarEstado(req).subscribe({
        next: (data) => {
          console.log('success', data);
          this.customSrv.showToast({
            text: 'Registro Exitoso',
            type: 'success-white',
            duration: 2000,
          });
          this.formValidation.reset();
          this.getList();

        },
        error: (error) => {
          console.error('error de servicio', error);
          this.customSrv.showToast({
            text: 'Falló la solicitud',
            type: 'error-white',
            duration: 2000,
          });
          this.loadingData.update(() => false);
        },
        complete:async () => {
          await new Promise(resolve=>setTimeout(resolve,1400));
          this.loadingData.update(() => false);
          this.formSubmitted = false;
          this.openRegistreModal.showModal = true;
        },
      });
    } catch (error) {
      console.error('error de servicio', error);
      this.customSrv.showToast({
        text: 'Falló la solicitud',
        type: 'error-white',
        duration: 2000,
      });
      this.loadingData.update(() => false);
    }
  }
  //Editar
  actualizarEstadoSrv(){
    try {
      console.log('envio', this.estadoSelected);
      this.loadingData.update(() => true);
      const idEstado = this.estadoSelected.idEstado
      const formValues = this.formValidation.getRawValue();
      const object = {
        idEstado,
        ...formValues
      }
      console.log('envio cuerpo solcitud', object);
      this.srv.actualizarEstado(object).subscribe({
        next: (data) => {
          this.customSrv.showToast({
            text: 'Actualización Exitosa',
            type: 'success-white',
            duration: 2000,
          });
          
        },
        error: (error) => {
          console.error('error de servicio', error);
          this.customSrv.showToast({
            text: 'Falló la solicitud',
            type: 'error-white',
            duration: 2000,
          });
          this.loadingData.update(() => false);
        },
        complete: async() => {
          await new Promise(resolve=>setTimeout(resolve,1000));
          this.loadingData.update(() => false);
          this.formSubmitted = false;
          this.openUpdateModal.showModal = false;
          this.formValidation.reset();
          this.getList();
        },
      });
    } catch (error) {
      console.error('error de servicio', error);
      this.customSrv.showToast({
        text: 'Falló la solicitud',
        type: 'error-white',
        duration: 2000,
      });
      this.loadingData.update(() => false);
    }
  }
  onSubmitEdit(){
    this.formSubmitted = true;
    if (this.formValidation.valid && this.formSubmitted == true) {
      this.actualizarEstadoSrv();
    } else {
      this.formValidation.markAllAsTouched();
      this.customSrv.showToast({
        text: 'Valida la información',
        type: 'error-white',
        duration: 2000,
      });
    }
  }
  //NOTE borrar
  deleteEstadoSrv(data:number) {
    try {
      this.loadingData.update(() => true);
      this.srv.deleteEstado(data).subscribe({
        next: (data) => {
          this.customSrv.showToast({
            text: 'Registro Eliminado',
            type: 'success-white',
            duration: 2000,
          });
        
        },
        error: (error) => {
          console.error('error de servicio', error);
          this.customSrv.showToast({
            text: 'Falló la solicitud',
            type: 'error-white',
            duration: 2000,
          });
          this.loadingData.update(() => false);
        },
        complete: async() => {
          await new Promise(resolve=>setTimeout(resolve,1000));
          this.loadingData.update(() => false);
          this.getList();
        },
      });
    } catch (error) {
      console.error('error de servicio', error);
      this.customSrv.showToast({
        text: 'Falló la solicitud',
        type: 'error-white',
        duration: 2000,
      });
    }
   
  }
  stateFlujo(type: string,data?:Estados) {
    console.log("llega data",data);
    this.estadoSelected = data;
    switch (type) {
      case 'open-registre':
        this.openRegistreModal.showModal = true;
        break;
        case 'open-list':
        this.openListModal.showModal = true;
      
        break;
      case 'open-edit':
        this.estadoSelected = data;
        this.openListModal.showModal = false;
        this.pathValuesForm(this.estadoSelected);
        this.openUpdateModal.showModal = true;
        break;
      case 'confirm-delete':
        this.deleteEstadoSrv(this.estadoSelected.idEstado);
        break;
    }
  }
  getValidatorErrors(fieldName: string) {
    return this.formSrv.getValidationRutasEstados(
      this.formValidation,
      fieldName,
      this.formSubmitted
    );
  }
  pathValuesForm(estado:Estados){
    this.formValidation.patchValue({
      nombreEstado: estado.nombreEstado,
      descripcionEstado: estado.descripcionEstado,
    });
  }
}
