import { Component, ViewChild } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { RouterLink } from '@angular/router';
import { SrvGenericosService } from '../../services/srv-genericos.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrearServicioVehiculoDto, ListarServicioVehiculoDto, MensajeDto } from '../../interfaces/serviciosVehiculos';
import { ModalComponent } from "../modal/modal.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent, RouterLink, ModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  @ViewChild("AbriModalRegister") abriModalRegister: any;

  servicios: ListarServicioVehiculoDto[] = [];
  errorMessage: string = '';
  servicioForm: FormGroup;
  mensajeRespuesta: string = '';
  errorRespuesta: string = '';

  constructor(
    private fb: FormBuilder,
    private srv: SrvGenericosService
  ) { }

  ngOnInit(): void {
    this.servicioForm = this.fb.group({
      nombreServicio: ['', Validators.required],
      valorServicio: [null, [Validators.required, Validators.min(0)]],
      descripcion: ['', Validators.required],
      images: [''],
    });
    this.cargarServicios();
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
      (data) => {
        this.servicios = data;
        console.log("Lista de vehiculos", this.servicios);

        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Error al cargar los servicios.';
        console.error('Error al cargar servicios:', error);
      }
    );
  }
  openRegister() {
    this.abriModalRegister.showModal = true;
  }
}
