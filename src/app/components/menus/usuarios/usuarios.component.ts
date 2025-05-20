import { Component, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { ListarUsuarioDto } from '../../../interfaces/usuarios';
import { SrvGenericosService } from '../../../services/srv-genericos.service';
import { filter, firstValueFrom } from 'rxjs';
import { Table } from '../../../interfaces/table';
import { TableComponent } from '../../table/table.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TableComponent, CommonModule,ReactiveFormsModule,ModalComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
    @ViewChild("OpenEdit") openEdit: any;
  srv = inject(SrvGenericosService);
  tableProps: Table;
  editForm:FormGroup;
  usuario: ListarUsuarioDto;
  EditError: string = '';
  ngOnInit(): void {
     this.editForm = new FormGroup({
          primerNombre: new FormControl('', Validators.required),
          segundoNombre: new FormControl(''),
          primerApellido: new FormControl('', Validators.required),
          segApellido: new FormControl(''),
          experiencia: new FormControl('', [Validators.required, Validators.min(0)]), // Ejemplo de validación numérica
          telefono: new FormControl('', Validators.required),
          correo: new FormControl('', [Validators.required, Validators.email]),
       
        });
    this.tableProps = {
      filter: 1,
      actions: 1,
      exportar: {
        objeto: '',
      },
      data: '',
      showFilter: true,
      class: 'non-striped'
    }
    this.listarUsuarios();
  }


  async listarUsuarios() {
    try {
      const data: any = await firstValueFrom(this.srv.listarUsuarios());
      console.log("data usuarios", data);
      this.usuario = data.usuarios;

      this.tableProps.data = this.usuario;

    } catch (error) {
      console.log("error user", error);

    }

  }

  editarUser(){
    this.openEdit.showModal = true;
  }

save(){}


}
