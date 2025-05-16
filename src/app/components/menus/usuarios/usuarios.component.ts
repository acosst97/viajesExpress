import { Component, inject, Inject, OnInit } from '@angular/core';
import { ListarUsuarioDto } from '../../../interfaces/usuarios';
import { SrvGenericosService } from '../../../services/srv-genericos.service';
import { filter, firstValueFrom } from 'rxjs';
import { Table } from '../../../interfaces/table';
import { TableComponent } from '../../table/table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TableComponent, CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {

  srv = inject(SrvGenericosService);
  tableProps: Table;
  usuario: ListarUsuarioDto;
  ngOnInit(): void {
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




}
