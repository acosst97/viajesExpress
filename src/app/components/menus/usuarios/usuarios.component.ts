import { Router } from '@angular/router';
import { Component, inject, Inject, OnInit, ViewChild } from '@angular/core';
import {
  ListarUsuarioDto,
  RolDto,
  Roles,
  selectOptions,
  UpdateUsuarioDTO,
} from '../../../interfaces/usuarios';
import { SrvGenericosService } from '../../../services/srv-genericos.service';
import { filter, firstValueFrom } from 'rxjs';
import { Table } from '../../../interfaces/table';
import { TableComponent } from '../../table/table.component';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { log } from 'console';
import { SelectComponent } from "../../select/select.component";
import { CardComponent } from "../../card/card.component";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TableComponent, CommonModule, ReactiveFormsModule, ModalComponent, SelectComponent, CardComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit {
  @ViewChild('OpenEdit') openEdit: any;
  @ViewChild('AsingRol') asingRolModal: any;
  srv = inject(SrvGenericosService);
  tableProps: Table;
  editForm: FormGroup;
  usuario: ListarUsuarioDto[];
  roles: RolDto[];
  rolesOption: selectOptions[] = [];
  EditError: string = '';
  ngOnInit(): void {
    this.initEditForm();

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
    this.listarUsuarios();
    this.listarRoles();
  }
  initEditForm(): void {
    this.editForm = this.fb.group({
      idUsuario: [''], // Campo oculto para almacenar el ID del usuario a editar
      documento: [{ value: '', disabled: true }, Validators.required], // Deshabilitado
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segApellido: [''],
      experiencia: ['', [Validators.required, Validators.min(0)]],
      telefono: ['', Validators.required],
      correo: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ], // Deshabilitado
      // Puedes añadir un campo para el rol si lo manejarás en el mismo formulario
      // idRol: ['']
    });
  }

  async listarUsuarios() {
    try {
      const data: any = await firstValueFrom(this.srv.listarUsuarios());
      console.log('data usuarios', data);
      this.usuario = data.usuarios;

      this.tableProps.data = this.usuario;
    } catch (error) {
      console.log('error user', error);
    }
  }
  //listarRoles
  async listarRoles() {
    try {
      const data: Roles = await firstValueFrom(this.srv.listarRoles());
      console.log('data Roles', data);
      if (data.roles.length > 0) {
        for (const key in data.roles) {
          if (Object.prototype.hasOwnProperty.call(data.roles, key)) {
            const element = data.roles[key];
            this.rolesOption.push({
              id: element.idRol,
              text: element.nombreRol,
            });
            console.log('lista option roles', this.rolesOption);
          }
        }
      }
    } catch (error) {
      console.log('Error ROLES', error);
    }
  }

  editarUser(data: ListarUsuarioDto) {
    console.log('data que llega para editar', data);
    // Asigna los datos del usuario al formulario
    this.editForm.patchValue({
      idUsuario: data.idUsuario,
      documento: data.documento,
      primerNombre: data.primerNombre,
      segundoNombre: data.segundoNombre,
      primerApellido: data.primerApellido,
      segApellido: data.segApellido,
      telefono: data.telefono,
      correo: data.correo,
    });

    this.editForm.get('documento')?.disable();
    this.editForm.get('correo')?.disable();

    this.openEdit.showModal = true;
    console.log('Formulario precargado con data:', this.editForm.value);
  }
  editarUser1(data: ListarUsuarioDto) {
    console.log('data que llega', data);
    const dataUser = this.usuario.find((d) => data.idUsuario === d.idUsuario);
    this.openEdit.showModal = true;
    console.log('data econtrada', dataUser);
  }
  eliminarUser(data: ListarUsuarioDto) {
    const dataUser = this.usuario.find((d) => data.idUsuario === d.idUsuario);
    console.log('data econtrada', dataUser);
  }

  goToHome() {
    // this.router.navigate(['/usuarios']);
    this.openEdit.showModal = false;
  }
  save(): void {
    if (this.editForm.valid) {
      // Clona el valor del formulario para evitar mutar el original, y habilita temporalmente los campos deshabilitados para obtener sus valores
      const formData = { ...this.editForm.getRawValue() };

      const updateUsuarioDTO: UpdateUsuarioDTO = {
        idUsuario: formData.idUsuario,
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre,
        primerApellido: formData.primerApellido,
        segApellido: formData.segApellido,
        experiencia: formData.experiencia,
        telefono: formData.telefono,
        correo: formData.correo, // El correo se incluirá porque usamos getRawValue()
      };

      this.srv.editarUsuario(updateUsuarioDTO).subscribe({
        next: (response) => {
          console.log('Usuario actualizado exitosamente:', response);
          this.EditError = null;
          this.openEdit.showModal = false; // Cierra el modal
          this.listarUsuarios(); // Recarga la lista de usuarios para ver los cambios
          this.editForm.reset(); // Reinicia el formulario
          this.editForm.get('documento')?.enable(); // Habilita nuevamente los campos para el próximo uso
          this.editForm.get('correo')?.enable();
        },
        error: (err) => {
          console.error('Error al actualizar usuario:', err);
          this.EditError =
            err.error?.mensaje || 'Error al actualizar el usuario.';
          // Si el error tiene un mensaje específico del backend, lo mostramos
        },
      });
    } else {
      this.editForm.markAllAsTouched(); // Marca todos los campos como "tocados" para mostrar los errores de validación
    }
  }
  asignarRoles(){
    this.asingRolModal.showModal = true;
  }
  constructor(private router: Router, private fb: FormBuilder) {}
}
