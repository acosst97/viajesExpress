import {
  Component,
  computed,
  effect,
  ElementRef,
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
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../table/table.component';
import { Table } from '../../interfaces/table';
import { SelectComponent } from "../select/select.component";
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataService } from '../../services/data.service';
import { selectOptions } from '../../interfaces/usuarios';
import { ListarReservaciones } from '../../interfaces/reservaciones';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [ModalComponent, CommonModule, ReactiveFormsModule, TableComponent, SelectComponent,MatTooltipModule],
  templateUrl: './rutas.component.html',
  styleUrl: './rutas.component.scss',
})
export class RutasComponent {
  @ViewChild('ListRutasModal') listRutasModal: any;
  @ViewChild('RegistroModal')  registroModal: any;
  @ViewChild('UpdateModal')    updateModal: any;
  @ViewChild('DeleteModal')    deleteModal: any;
  @ViewChild('HelpModal')      helpModal: any;
  @ViewChild('HelpModalEstado')      helpModalEstado: any;
  @Output() sendTo          = new EventEmitter<string>();
  srv                       = inject(SrvGenericosService);
  formSrv                   = inject(FormvalidationService);
  customSrv                 = inject(CustomSrvService);
  dataSrv                   = inject(DataService);
  loadingData               = signal(false);
  public estados            = computed(() => this.dataSrv.getEstados());
  showResponseModal         : boolean = false;
  tableProps                : Table;
  listaRutas                : any;
  listaRutasFilter          : any;
  formValidation            : FormGroup;
  formSubmitted             : boolean = false;
  showHelpTooltip           : boolean = false;
  estadoOption              :selectOptions[]=[];
  estadoSelected            :selectOptions;
  constructor() {
     effect(() => {
      this.estadoOption = null
        const data = this.estados();
        if (data) {
        this.estadoOption = data();
        }
        console.log('data changed:', data);
      });
  }
  ngOnInit() {
    this.getListReservation();
    this.formValidation = this.formSrv.initFormRutas();
    this.customSrv.toast$.subscribe((message) => {
      this.showResponseModal = !!message;
    });
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
  }
  //NOTE Validacion form 
  getValidatorErrors(fieldName: string) {
    return this.formSrv.getValidationRutasEstados(
      this.formValidation, fieldName, this.formSubmitted);
  }
  helpEstado(){
    this.helpModalEstado.showModal=true;
  }
  async prueba() {
    this.helpModal.showModal = true;
    this.customSrv.showToast({
      text: 'Valida la información',
      type: 'error-white',
      duration: 2000,
    });
  }

  openModales(type:string){
  switch (type) {
    case 'open-list-rutas':
      this.listRutasModal.showModal = true;
      this.getListRutas();
      break;
      case 'registre-ruta':
      this.registroModal.showModal = true;
      break;
      case 'value':
      
      break;
      case 'dff':
      
      break;
      case 'terter':
      
      break;
  }
  }

    /**-------------------------------- SERVICIOS ---------------------------- */
//NOTE **REGISTRO
  registroRutaSrv(){
    try {
      this.loadingData.update(()=>true)
      const formValues = this.formValidation.getRawValue();
      const idEstado = this.estadoSelected.id;
      const reservacionesIdReservaciones = this.reservaSelec.id || null;
      const object = {
        idEstado,
        reservacionesIdReservaciones,
        ...formValues
      }
      this.srv.registrarRutasSrv(object).subscribe({
       next:()=>{
        this.customSrv.showToast({ text: 'Registro exitoso', type: 'success-white', duration: 2000 })
       }, error:(error)=>{
        console.log("error de servicio", error);
        this.customSrv.showToast({ text: 'Falló la solicitud', type: 'error-white', duration: 2000 })
        this.loadingData.update(()=>false)
        this.formSubmitted = false;
      },
      complete:async()=>{
        await new Promise(resolve=>setTimeout(resolve,1000));
        this.formValidation.reset();
        this.formSubmitted = false;
        this.getListRutas();
        this.registroModal.showModal = false;
        this.loadingData.update(()=>false)
      }
      })
      
    } catch (error) {
      console.log("error de servicio", error);
        this.customSrv.showToast({ text: 'Falló la solicitud', type: 'error-white', duration: 2000 })
        this.loadingData.update(()=>false);
    }
  }
  onSubmitRegistre(){
    this.formSubmitted = true;
    if (this.formValidation.valid && this.formSubmitted) {
      this.registroRutaSrv();
    }else{
      this.customSrv.showToast({ text: 'Valida la información', type: 'error-white', duration: 2000 })
      this.formValidation.markAllAsTouched();
    }
  }
//NOTE **lISTADO RUTAS
 getListRutas(){
  try {
    this.srv.getListRutes().subscribe({
      next:(data: any) => {
       console.log("Lista de rutas", data);
        this.listaRutas = data?.rutas;
        if (this.listaRutas.length>0) {
          this.listaRutasFilter = this.listaRutas.map((d:any)=>{
           const {...data} = d;
          return data;
          })
          this.tableProps.data = this.listaRutasFilter;
        }else{
          this.tableProps.data = [];
          this.customSrv.showToast({ text: 'No hay registros para mostrar', type: 'error-white', duration: 2000 })
        }
      },
      error:(error)=>{
        console.log("error de servicio", error);
        this.tableProps.data = [];
      }
      }
      );
  } catch (error) {
    console.log("error de servicio", error);
  }
 }
 listReservas    :    ListarReservaciones[];
 optioReservas   :    selectOptions[] =[];
 reservaSelec    :    selectOptions;
 async getListReservation(){
 try {
     const data: any = await firstValueFrom(this.srv.ListarReservaciones());
     console.log('data reservas', data);
       this.listReservas = data.reservaciones
       if (this.listReservas.length>0) {
       for (const key in this.listReservas) {
        if (Object.prototype.hasOwnProperty.call(this.listReservas, key)) {
          const element:ListarReservaciones = this.listReservas[key];
          this.optioReservas.push({id:element.idReservaciones,text:element.documentoUsuario});
        }
       }
       }
   } catch (error) {
     console.log('error user', error);
   }
 }
 //*Listado estados
 onSelect(event:any){
  this.estadoSelected = event;
  console.log("seleccion", this.estadoSelected);
 }
 onSelectRe(event:any){
  this.reservaSelec = event;
  console.log("seleccion", this.reservaSelec);
 }
}
