import { Element } from './../../../../node_modules/parse5/dist/tree-adapters/default.d';
import { Component, signal, ViewChild } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { Router, RouterLink } from '@angular/router';
import { SrvGenericosService } from '../../services/srv-genericos.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CrearServicioVehiculoDto,
  ListarServicioVehiculoDto,
  MensajeDto,
} from '../../interfaces/serviciosVehiculos';
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';
import { ListarReservaciones } from '../../interfaces/reservaciones';
import { CustomSrvService } from '../../services/custom-srv.service';
import { AlertComponent } from '../alert/alert.component';
import { CardComponent } from '../card/card.component';
import { FormvalidationService } from '../../services/formvalidation.service';
import { selectOptions } from '../../interfaces/usuarios';
import { SelectComponent } from "../select/select.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavComponent,
    RouterLink,
    ModalComponent,
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    CardComponent,
    SelectComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('AbriModalRegister') abriModalRegister: any;
  @ViewChild('OpenReservationModal') openReservationModal: any;
  servicios                           : ListarServicioVehiculoDto[] = [];
  lstReservaciones                    : ListarReservaciones[] = [];
  formSubmitted                       : boolean = false;
  showResponseModal                   : boolean = false;
  loadingData                         = signal(false);
  mensajeRespuesta                    : string = '';
  errorRespuesta                      : string = '';
  reservacionForm                     : FormGroup;
  listaRutas                          : any[]
  optioRutas                          :    selectOptions[] =[]; 
  rutaSelected                        : selectOptions;
  constructor(
    private formSrv: FormvalidationService,
    private srv: SrvGenericosService,
    private router: Router,
    private customSrv: CustomSrvService
  ) {}

  ngOnInit(): void {
    this.optioRutas = [];
    this.reservacionForm = this.formSrv.initFormReservas();
    this.cargarServicios();
    this.getListRutas();
    this.customSrv.toast$.subscribe((message) => {
      this.showResponseModal = !!message;
    });
  }
  getValidatorError(fieldName: string) {
    return this.formSrv.getValidationRutasEstados(
      this.reservacionForm,
      fieldName,
      this.formSubmitted
    );
  }
  cargarServicios(): void {
    this.srv.listarServiciosVehiculos().subscribe(
      (data: any) => {
        this.servicios = data?.servicios;
        console.log('Lista de servicios  vehiculos', this.servicios);
      },
      (error) => {
        console.error('Error al cargar servicios:', error);
      }
    );
  }
  //CARGAR RUTAS
//NOTE **lISTADO RUTAS
getListRutas(){
  try {
    this.srv.getListRutes().subscribe({
      next:(data: any) => {
       console.log("Lista de rutas", data);
        this.listaRutas = data?.rutas;
        if (this.listaRutas.length>0) {
         for (const key in this.listaRutas) {
          if (Object.prototype.hasOwnProperty.call(this.listaRutas, key)) {
            const element = this.listaRutas[key];
            this.optioRutas.push({id:element.idRuta,text:element.nombreRuta});
          }
         }
        }else{
          this.customSrv.showToast({ text: 'No hay Rutas disponibles', type: 'error-white', duration: 2000 })
        }
      },
      error:(error)=>{
        console.error("error de servicio", error);
      }
      }
      );
  } catch (error) {
    console.log("error de servicio", error);
  }
 }
 onRutaSelec(data:any){
  this.rutaSelected = data;
  return this.rutaSelected;
 }

//*
  onSubmit() {
    try {
      this.loadingData.update(() => true);
      if (this.reservacionForm.valid) {
        const formValues = this.reservacionForm.value;
        const valorPago = this.reservacionForm.get('valorPago').value;
        const idRuta = this.rutaSelected.id;
        const reservacionDto = {
          detallePago: formValues.detallePago,
          valorPago: valorPago,
          fechaReserva: formValues.fechaReserva,
          fechaViaje: formValues.fechaViaje,
          documentoUsuario: formValues.documentoUsuario,
          idRuta:idRuta
        };
        console.log('form values:', reservacionDto);
        this.srv.registrarReservaciones(reservacionDto).subscribe(
          {
            next:(res) => {
              console.log('res reservas', res);
              this.customSrv.showToast({
                text: 'registro exitoso',
                type: 'success-white',
                duration: 2000,
              });
              this.reservacionForm.reset();
              this.loadingData.update(() => false);
            },
            error: (error) => {
              const mensaje = error?.error.mensaje || "Error en la solicitud";
              this.customSrv.showToast({
                text: mensaje,
                type: 'error-white',
                duration: 2000,
              });
              this.loadingData.update(() => false);
            },
            complete: async () => {
              await new Promise(resolve=>setTimeout(resolve,2000));
              this.loadingData.update(() => false);
              this.abriModalRegister.showModal = false;
              this.formSubmitted = false;
             
            },
          }
        );
      } else {
        console.log('Formulario inválido');
      }
    } catch (error) {
      this.loadingData.update(() => false);
      console.error('error reguistrando reservas', error);
      this.formSubmitted = false;
    }
  }
prueba(){
  this.customSrv.showToast({
    text: "dsd",
    type: 'error-white',
    duration: 5000,
  });
}
  //Servicio para reservaciones
  loadReservation() {
    this.srv.ListarReservaciones().subscribe(
      (data: any) => {
        this.lstReservaciones = data.reservaciones;
        console.log('Lista de reservaciones', this.lstReservaciones);
      },
      (error) => {
        console.log('error de servicio', error);
      }
    );
  }
  converterToNumber(n: any) {
    const number = n;
    return Number(number);
  }
  openFormReservation(item: any) {
    const data = this.servicios.find((d) => d.idServicio == item.idServicio);
    if (data) {
      this.reservacionForm.patchValue({
        valorPago: data.valorServicio,
      });
      this.reservacionForm.get('valorPago').disable();
      this.openReservationModal.showModal = true;
    }
  }

  home() {
    this.router.navigate(['/home']);
    this.openReservationModal.showModal = false;
  }


}
