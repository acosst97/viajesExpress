import {
  Component,
  computed,
  effect,
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
import { ListaRutasDto } from '../../interfaces/rutas';
import { finalize } from 'rxjs';

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
  @ViewChild('QuestionModal') questionModal: any;
  @ViewChild('HelpModalEstado')  helpModalEstado: any;
  @ViewChild('ViewDetail')       viewDetail: any;
  @ViewChild('DescargarFile') modalDescargarFile!:any;
  @Output() sendTo          = new EventEmitter<string>();
  srv                       = inject(SrvGenericosService);
  formSrv                   = inject(FormvalidationService);
  customSrv                 = inject(CustomSrvService);
  dataSrv                   = inject(DataService);
  loadingData               = signal(false);
  public estados            = computed(() => this.dataSrv.getEstados());
  showResponseModal         : boolean = false;
  tableProps                : Table;
  listaRutas                : ListaRutasDto[];
  listaRutasFilter          : any[];
  rutaSelected              : ListaRutasDto;
  formValidation            : FormGroup;
  formSubmitted             : boolean = false;
  showHelpTooltip           : boolean = false;
  estadoOption              : selectOptions[]=[];
  estadoSelected            : selectOptions;
  listReservas              : ListarReservaciones[];
  optioReservas             : selectOptions[] =[];
  reservaSelec              : selectOptions;
  uploadErrorDetails: string[] = [];
  selectedFile: File | null = null;
  constructor() {
     effect(() => {
      this.estadoOption = []
        const data = this.estados();
        if (data) {
        this.estadoOption = data();
        }
        console.log('data changed:', data);
      });
  }
  ngOnInit() {
    // this.getListReservation();
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
 
  openModales(type:string,data?:ListaRutasDto){
    console.log("data",data);
    this.rutaSelected = data;
  switch (type) {
    case 'open-list-rutas':
      this.listRutasModal.showModal = true;
      this.getListRutas();
      break;
      case 'registre-ruta':
      this.registroModal.showModal = true;
      break;
      case 'question-delete':
        const rutas = this.listaRutas.find(d=> d.idRuta === data.idRuta);
        if (rutas) {
          this.rutaSelected = rutas; 
          console.log('onfo ruta', this.rutaSelected);
          this.questionModal.showModal = true;
        }
      break;
      case 'confirm-delete':
       this.deleteRuta(this.rutaSelected.idRuta);
      break;

     case 'view-details':
      const find = this.listaRutas.find(d=> d.idRuta === data.idRuta);
      if (find) {
        this.rutaSelected = find; 
        console.log('onfo ruta', this.rutaSelected);
        this.viewDetail.showModal= true;
      }
     
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
      const object = {
        idEstado, 
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
          this.listaRutasFilter = this.listaRutas.map((ruta:any)=>({
            idRuta : ruta.idRuta,
            codRuta: ruta.codRuta,
            estado: ruta.activa ? 'Activo' : 'Inactiva',
            nombreRuta: ruta.nombreRuta,
            origenRuta: ruta.origenRuta,
            destinoRuta: ruta.destinoRuta
          }));
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

 //*Listado estados
 onSelect(event:any){
  this.estadoSelected = event;
  console.log("seleccion", this.estadoSelected);
 }
 onSelectRe(event:any){
  this.reservaSelec = event;
  console.log("seleccion", this.reservaSelec);
 }
 //DELETE 
 deleteRuta(id:number){
  try {
    this.loadingData.update(()=>true)
    this.srv.borrarRuta(id).subscribe({
      next:(data)=>{
        console.log("success",data);
        this.customSrv.showToast({ text: 'Registro Eliminado', type: 'success-white', duration: 2000 });
        this.getListRutas();
      },error:(error)=>{
        console.error("error",error);
        const mensaje = error?.error.mensaje || 'Falló la solicitud';
        this.customSrv.showToast({ text: mensaje, type: 'error-white', duration: 2000 });
        this.loadingData.update(()=>false);
      },complete:async()=>{
        await new Promise(resolve=>setTimeout(resolve,1000));
        this.loadingData.update(()=>false);
        this.questionModal.showModal = false;
      }
    })
  } catch (error) {
    console.error("error",error);
    this.loadingData.update(()=>false)
    console.log("error de servicio", error);
  }
 }
 openMasiveModales(){
    this.modalDescargarFile.showModal = true;
 }
   descargarPlantilla() {
    this.loadingData.update(()=>true);
    this.srv.descargarPlantillaExcel()
      .pipe(finalize(() => this.loadingData.update(()=>false)))
      .subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'plantilla_rutas.xlsx'; 
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); 
          console.log('Plantilla descargada con éxito.');
        },
        error: (error) => {
          console.error('Error al descargar la plantilla:', error);
          alert('No se pudo descargar la plantilla. Inténtalo de nuevo más tarde.'); 
        }
      });
  }
    // ----------------------------------------------------
  // Lógica para cargar el archivo Excel
  // ----------------------------------------------------
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  uploadFile() {
      this.loadingData.update(()=>true);
    if (!this.selectedFile) {
    this.customSrv.showToast({ text: 'Por favor, selecciona un archivo Excel para cargar.', type: 'error-white', duration: 2000 });
      return;
    }
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
      'application/vnd.ms-excel' 
    ];
    if (!allowedTypes.includes(this.selectedFile.type)) {
      this.customSrv.showToast({ text: 'Tipo de archivo no válido. Por favor, sube un archivo.xls.', type: 'error-white', duration: 2000 });  
      this.selectedFile = null; // Resetear la selección
      return;
    }

    this.srv.uploadExcel(this.selectedFile)
      .pipe(finalize(() => this.loadingData.update(()=>false))) // Ocultar spinner al finalizar
      .subscribe({
        next: (response) => {
          if (response.success) {
             this.customSrv.showToast({ text: 'Archivo cargado y rutas procesadas con éxito.', type: 'error-white', duration: 2000 });
            
            if (response.successfulUploads > 0) {
                ` ${response.successfulUploads} rutas guardadas.`;
            }
            if (response.failedUploads > 0) {
              ` ${response.failedUploads} rutas con errores.`;
            }
            if (response.errors && response.errors.length > 0) {
             console.log("error",response);
            }
          } else {
            this.customSrv.showToast({ text: 'ocurrio un error al procesar', type: 'error-white', duration: 2000 });
            if (response.errors && response.errors.length > 0) {
                this.uploadErrorDetails = response.errors;
            }
            console.error('Error del backend al procesar la carga:', response);
          }
        },
        error: (error) => {
          this.uploadErrorDetails =error?.errors;
        this.loadingData.update(()=>false)
        console.error('Error en la carga:', error);
        this.customSrv.showToast({ text: 'Fallo la solicitud revisa errores', type: 'error-white', duration: 2000 });  
        },
        complete:async()=>{
            await new Promise(resolve=>setTimeout(resolve,1000));
          this.getListRutas();
        }
      });
  }

}
