import { Component, ViewChild } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { Router, RouterLink } from '@angular/router';
import { SrvGenericosService } from '../../services/srv-genericos.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrearServicioVehiculoDto, ListarServicioVehiculoDto, MensajeDto } from '../../interfaces/serviciosVehiculos';
import { ModalComponent } from "../modal/modal.component";
import { CommonModule } from '@angular/common';
import { CrearReservacion, ListarReservaciones } from '../../interfaces/reservaciones';
import { error } from 'console';
import { CustomSrvService } from '../../services/custom-srv.service';
import { AlertComponent } from "../alert/alert.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent, RouterLink, ModalComponent, CommonModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  @ViewChild("AbriModalRegister") abriModalRegister: any;
  @ViewChild("OpenReservationModal") openReservationModal: any;
  servicios: ListarServicioVehiculoDto[] = [];
  lstReservaciones: ListarReservaciones[] = [];
  errorMessage: string = '';
  servicioForm: FormGroup;
  mensajeRespuesta: string = '';
  errorRespuesta: string = '';
  reservacionForm: FormGroup;
  showResponseModal: boolean = false;
  constructor(
    private fb: FormBuilder,
    private srv: SrvGenericosService,
    private router: Router,
    private customSrv: CustomSrvService
  ) { }

  ngOnInit(): void {

    this.servicioForm = this.fb.group({
      nombreServicio: ['', Validators.required],
      valorServicio: [null, [Validators.required, Validators.min(0)]],
      descripcion: ['', Validators.required],
      images: [''],
    });
    this.reservacionForm = this.fb.group({
      detallePago: ['', Validators.required],
      valorPago: ['', Validators.required],
      fechaReserva: ['', Validators.required],
      fechaViaje: ['', Validators.required],
      documentoUsuario: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      correo: ['', [Validators.required, Validators.email]],
    });
    this.cargarServicios();
    this.loadReservation();
    this.registrer = new FormGroup([]);
    this.customSrv.toast$.subscribe((message) => {
      this.showResponseModal = !!message;
    });
  }

  registrarServicio(): void {
    if (this.servicioForm.valid) {
      const nuevoServicio: CrearServicioVehiculoDto = this.servicioForm.value;
      this.srv.registrarServicioVehiculo(nuevoServicio).subscribe(
        (response: MensajeDto) => {
          this.mensajeRespuesta = response.mensaje;
          this.errorRespuesta = '';
          this.servicioForm.reset();
        },
        (error) => {
          this.errorRespuesta = 'Error al registrar el servicio.';
          this.mensajeRespuesta = '';
          console.error('Error al registrar servicio:', error);

        }
      );
    } else {
      this.errorRespuesta = 'Por favor, complete el formulario correctamente.';
      this.mensajeRespuesta = '';
    }
  }

  get f() {
    return this.servicioForm.controls;
  }

  cargarServicios(): void {
    this.srv.listarServiciosVehiculos().subscribe(
      (data: any) => {

        this.servicios = data?.servicios;
        console.log("Lista de servicios  vehiculos", this.servicios);
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Error al cargar los servicios.';
        console.error('Error al cargar servicios:', error);
      }
    );
  }
  openRegister() {
    this.abriModalRegister.showModal = true
  }
  onSubmit() {
    if (this.reservacionForm.valid) {
      const formValues = this.reservacionForm.value;
      const reservacionDto = {
        detallePago: formValues.detallePago,
        valorPago: formValues.valorPago,
        fechaReserva: formValues.fechaReserva,
        fechaViaje: formValues.fechaViaje,
        documentoUsuario: formValues.documentoUsuario,
      };

      // Llamamos al servicio para registrar la reservación
      this.srv.registrarReservaciones(reservacionDto).subscribe(
        (response) => {
          console.log('Reservación registrada con éxito:', response);
          this.customSrv.showToast({ text: 'registro exitoso', type: 'success-white', duration: 2000 });
          this.reservacionForm.reset();
        },
        (error) => {
          console.error('Error al registrar la reservación:', error);
          this.customSrv.showToast({ text: "no hay documento asociado", type: 'error-white', duration: 2000 });
          // this.reservacionForm.reset();
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }

  //Servicio para reservaciones
  loadReservation() {
    this.srv.ListarReservaciones().subscribe(
      (data: any) => {
        this.lstReservaciones = data.reservaciones;
        console.log("Lista de reservaciones", this.lstReservaciones);
      },
      (error) => {
        console.log("error de servicio", error);
      }
    )
  }

  openFormReservation() {
    this.openReservationModal.showModal = true;
  }

  home() {
    this.router.navigate(['/home']);
    this.openReservationModal.showModal = false;
  }

  registrer: any
}
