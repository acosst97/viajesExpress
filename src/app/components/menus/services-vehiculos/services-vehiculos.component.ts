import { ChangeDetectorRef, Component, inject, signal, ViewChild } from '@angular/core';
import { CardComponent } from '../../card/card.component';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from '../../alert/alert.component';
import { ModalComponent } from '../../modal/modal.component';
import { SelectComponent } from '../../select/select.component';
import { TableComponent } from '../../table/table.component';
import { CrearServicioVehiculoDto, ListarServicioVehiculoDto } from '../../../interfaces/serviciosVehiculos';
import { Table } from '../../../interfaces/table';
import { SrvGenericosService } from '../../../services/srv-genericos.service';
import { CustomSrvService } from '../../../services/custom-srv.service';
import { FormvalidationService } from '../../../services/formvalidation.service';
import { RutasComponent } from "../../rutas/rutas.component";
import { EstadoRutaComponent } from '../../estado-ruta/estado-ruta.component';
import { AuthService } from '../../../services/auth.service';
import { LoginData } from '../../../interfaces/loginRequest';

@Component({
  selector: 'app-services-vehiculos',
  standalone: true,
  imports: [AlertComponent, CardComponent, CommonModule, ModalComponent, TableComponent, ReactiveFormsModule, SelectComponent, RutasComponent,EstadoRutaComponent],
  templateUrl: './services-vehiculos.component.html',
  styleUrl: './services-vehiculos.component.scss'
})
export class ServicesVehiculosComponent {
  
    @ViewChild("AbriModalRegister") abriModalRegister: any;
    @ViewChild("EditServiceModal") editServiceModal: any;
    @ViewChild('QuestionModal') questionModal: any;
    
  srv              = inject(SrvGenericosService);
  formSrv          = inject(FormvalidationService);
  private cdr      = inject(ChangeDetectorRef);
  loadingData      = signal(false);
  protected authSrv    =    inject(AuthService);
  listServices     :        ListarServicioVehiculoDto[];
  listSrvFilter    :        ListarServicioVehiculoDto[];
  selectedImageBase64:      string | ArrayBuffer | null = null;
  listRutas        :        any[];
  tableProps       :        Table;
  formValidation   :        FormGroup;
  showResponseModal:        boolean = false;
  formSubmitted    :        boolean = false;
  viewTable        :        boolean = true;
  serviceSelected  :        ListarServicioVehiculoDto;
  loginData           :    LoginData;
  permiso           :    string[]=[];
 constructor(private customSrv: CustomSrvService){}
 ngOnInit() {
  this.formValidation = this.formSrv.initFormServices();
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
   this.cargarServicios();
   this.loginData  = this.authSrv.obtenerUsuario();
   this.permiso = this.loginData?.roles || [];
 }

 tieneRol(rol: string): boolean {
  return this.permiso.includes(rol);
}
 /**Validacion form */
 getValidatorErroVehiculo(fieldName: string) {
  return this.formSrv.getValidationVehiculo(
    this.formValidation, fieldName, this.formSubmitted);
}
  //------------------------- Servicios ----------------------//
//listar Servicios Vehiculos
cargarServicios(): void {
  this.srv.listarServiciosVehiculos().subscribe({
  next:(data: any) => {
    this.listServices = data?.servicios;
    if (this.listServices.length>0) {
      this.listSrvFilter = this.listServices.map((d:ListarServicioVehiculoDto)=>{
       const {images, ...data} = d
      return data;
      })
      this.tableProps.data = this.listSrvFilter;
    }else{
      this.tableProps.data = []
    }
    console.log("Lista de servicios  vehiculos", this.listServices);
  },
  error:(error)=>{
    console.log("error de servicio", error);
    this.tableProps.data = [];
  }
  }
  );
}

//* ------------------------ REGISTRO---------------//
//NOTE registro
openRegister() {
  if (this.tieneRol('ADMINISTRADOR')) {
    this.formValidation.reset();
    this.abriModalRegister.showModal = true
  }else{
    this.customSrv.showToast({ text: 'Permiso denegado', type: 'error-white', duration: 2000 })
  }
}
  registrarServicio() {
  try {
    this.loadingData.update(()=>true);
    const nuevoServicio: CrearServicioVehiculoDto = this.formValidation.value;
    this.srv.registrarServicioVehiculo(nuevoServicio).subscribe({
      next:async(res) =>{
        this.selectedImageBase64 = null;
        this.customSrv.showToast({ text: 'Registro exitoso', type: 'success-white', duration: 2000 })
        console.log("res registro Servicio",res)
       this.cargarServicios(); 
       await new Promise(resolve=>setTimeout(resolve,2000));
       this.abriModalRegister.showModal = false;
       this.loadingData.update(()=>false);
       this.selectedImageBase64 = null;
      },
      error:(error) =>{
        console.error("error",error),
        this.customSrv.showToast({ text: 'fallo la Solicitud', type: 'error-white', duration: 2000 })
        this.loadingData.update(()=>false);
      },
      complete:()=> {
        this.formValidation.reset();
        this.loadingData.update(()=>false)
        this.formSubmitted = false;
        this.selectedImageBase64 = null;
      }
    });
  } catch (error) {
    this.loadingData.update(()=>false);
  }
}
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.formValidation.get('image')?.setValue(reader.result as string);
      this.formValidation.get('image')?.markAsDirty();
      this.formValidation.get('image')?.updateValueAndValidity();
      this.selectedImageBase64 = reader.result;
      this.formValidation.patchValue({
        images: reader.result as string 
      });
      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
        this.formValidation.get('image')?.setValue('');
        this.formValidation.get('image')?.markAsDirty();
        this.formValidation.get('image')?.updateValueAndValidity(); 
      };
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file); 
  } else {
    this.selectedImageBase64 = null;
    this.formValidation.patchValue({ images: null });
  }
}
onSubmitService(){
  this.formSubmitted = true;
  if (this.formValidation.valid && this.formSubmitted) {
    this.registrarServicio();
  } else {
    this.formValidation.markAllAsTouched();
    this.customSrv.showToast({ text: 'Valida la información', type: 'error-white', duration: 2000 });
  }
}


async prueba(){
  this.customSrv.showToast({ text: 'Valida la información', type: 'error-white', duration: 2000 });
}
converteNumber(data:any){
  const n = data;
  return Number(n);
}
changueView(){
  this.viewTable = !this.viewTable;
}
//* ------------------------ EDITAR Y ELIMINAR---------------//
//NOTE 
tableFlujo(type:string,data:ListarServicioVehiculoDto){
  this.serviceSelected = data;
  console.log("service",this.serviceSelected);
  
 switch (type) {
  case 'edit-service':
    if (this.tieneRol('ADMINISTRADOR')) {
      this.serviceSelected = data;
      this.pathValuesForm(this.serviceSelected);
      this.editServiceModal.showModal = true;
    }else{
      this.customSrv.showToast({ text: 'Permiso denegado', type: 'error-white', duration: 2000 })
    }
    break;
  case 'question-delete':
    if (this.tieneRol('ADMINISTRADOR')) {
      this.questionModal.showModal = true;
    }else{
      this.customSrv.showToast({ text: 'Permiso denegado', type: 'error-white', duration: 2000 })
    }
    break;
    case 'confirm-delete':
    this.deleteServiceMethod(this.serviceSelected);
      break;
 }
}
deleteServiceMethod(s:ListarServicioVehiculoDto){
  try {
    this.loadingData.update(()=>true);
    this.srv.eliminarServicioVehiculo(s.idServicio).subscribe(
      {
      next: ()=>{
        this.customSrv.showToast({ text: 'Servicio eliminado exitosamente', type: 'success-white', duration: 3000 });
        this.cargarServicios();
      },
      error:(errorS)=>{
        this.customSrv.showToast({ text: 'Error en la solicitud', type: 'error-white', duration: 2000 });
        console.error("error de servicio suscri",errorS);
        this.loadingData.update(()=>false);
      },
      complete:async ()=>{
        await new Promise(resolve=>setTimeout(resolve,1000));
        this.loadingData.update(()=>false);
        this.questionModal.showModal = false;
      }
      });
  } catch (error) {
   console.error("error de servicio",error);
   this.customSrv.showToast({ text: 'Error en la solicitud', type: 'error-white', duration: 2000 });
  }
}
onSubmitEdit(){
  this.formSubmitted = true;
if (this.formValidation.valid && this.formSubmitted) {
  this.editarServiceSrv();
}else{
  this.formValidation.markAllAsTouched();
  this.customSrv.showToast({ text: 'Valida el formulario', type: 'error-white', duration: 2000 });
}
}

 editarServiceSrv(){
 try {
  this.loadingData.update(()=>true);
  const formValues = this.formValidation.value;
  const idServicio  = this.serviceSelected.idServicio;
  const object = {
    idServicio,
    ...formValues,
  }
  console.log("cuerpo solicitud",object);
  this.srv.updateSrvVehiculos(object).subscribe({
  next: ()=>{
    this.customSrv.showToast({ text: 'Servicio actualizado', type: 'success-white', duration: 4000 });
    this.cargarServicios();
  },
  error:(errorS)=>{
    this.customSrv.showToast({ text: 'Error en la solicitud', type: 'error-white', duration: 2000 });
    console.error("error de servicio suscri",errorS);
    this.loadingData.update(()=>false);
  },
  complete:async ()=>{
    await new Promise(resolve=>setTimeout(resolve,1000));
    this.loadingData.update(()=>false);
    this.formSubmitted = false;
  }
 });
  
 } catch (error) {
  this.customSrv.showToast({ text: 'Error en la solicitud', type: 'error-white', duration: 2000 });
  this.loadingData.update(()=>false);
 }  
}

pathValuesForm(service:ListarServicioVehiculoDto){
  this.formValidation.patchValue({
    nombreServicio: service.nombreServicio,
    valorServicio: service.valorServicio,
    descripcion: service.descripcion,
    images: service.images,
  });
}
}
