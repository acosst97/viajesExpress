import { Router } from '@angular/router';
import { Component, inject, Inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  ListarUsuarioDto,
  RolDto,
  RolEnum,
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
import { CustomSrvService } from '../../../services/custom-srv.service';
import { AlertComponent } from '../../alert/alert.component';
import { FormvalidationService } from '../../../services/formvalidation.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [AlertComponent,TableComponent, CommonModule, ReactiveFormsModule, ModalComponent, SelectComponent, CardComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit {
  @ViewChild('OpenEdit') openEdit: any;
  @ViewChild('AsingRol') asingRolModal: any;
  @ViewChild('OpenRegistreRol') openRegistreRol: any;
  srv               = inject(SrvGenericosService);
  customSrv         = inject(CustomSrvService);
  formSrv           = inject(FormvalidationService);
  loadingData       = signal(false);
  tableProps        : Table;
  tablePropsRoles   : Table;
  editForm          : FormGroup;
  usuario           : ListarUsuarioDto[] ;
  usuarioFilter     : any[];
  roles             : RolDto[] ;
  rolesOption       : selectOptions[] = [];
  rolSelected       : selectOptions;
  userSelected      : ListarUsuarioDto;
  EditError         : string = '';
  formSubmitted     :        boolean = false;
  showResponseModal :        boolean = false;
  listaRolesAssing  :selectOptions[] = [
    { text: "ADMINISTRADOR" },
    { text: "EMPLEADO" },
    { text: "CLIENTE" }
  ];
  ngOnInit(): void {
    this.editForm = this.formSrv.initFormUsuario();
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
    this.tablePropsRoles = {
      filter: 0,
      actions: 1,
      exportar: {
        objeto: '',
      },
      data: '',
      showFilter: false,
      class: 'non-striped',
    };
    this.listarUsuarios();
    this.listarRoles();
    this.customSrv.toast$.subscribe((message) => {
      this.showResponseModal = !!message;
    });
  }

  /**Validacion form */
  getValidatorError(fieldName: string) {
    return this.formSrv.getValidationRutasEstados(
      this.editForm, fieldName, this.formSubmitted);
  }
  
  async listarUsuarios() {
    try {
      const data: any = await firstValueFrom(this.srv.listarUsuarios());
      console.log('data usuarios', data);
      this.usuario = data.usuarios;
      if (this.usuario.length>0) {
        // const usuariosConRol = this.usuario.filter((data: ListarUsuarioDto) => {
        //   return data.rolId !== null && data.rolId !== undefined; // Filtra si rolId no es nulo
        //   // Si quieres filtrar por un rol específico:
        //   // return data.rolNombre === 'ADMINISTRADOR';
        // });
      this.usuarioFilter = this.usuario.map((data:any)=>{
      const {idUsuario, documento,primerNombre,segundoNombre,
        primerApellido,segApellido,telefono,correo,experiencia,rolId,rolNombre,...d
       } = data
       const nombreCompleto = `${primerNombre} ${primerApellido}`;
      return {
        idUsuario,
        documento,
        nombre:nombreCompleto,
        telefono,
        correo,
        experiencia,
        rol:rolNombre
      }
      })  
      this.tableProps.data = this.usuarioFilter;
      }
    } catch (error) {
      console.log('error user', error);
      this.tableProps.data = [];
    }
  }
  //listarRoles
  async listarRoles() {
    try {
      const data: Roles = await firstValueFrom(this.srv.listarRoles());
      console.log('data Roles', data);
      if (data.roles.length > 0) {
        this.roles = data.roles;
        console.log('table Roles', this.roles);
        this.tablePropsRoles.data = this.roles;
        const rolesFiltrados = data.roles.filter(role => role.nombreRol.toUpperCase() !== 'ADMINISTRADOR');
        for (const key in rolesFiltrados) {
          if (Object.prototype.hasOwnProperty.call(rolesFiltrados, key)) {
            const element = rolesFiltrados[key];
            this.rolesOption.push({
              id: element.idRol,
              text: element.nombreRol,
            });
            console.log('lista option roles', this.rolesOption);
          }
        }
      }else{
        this.customSrv.showToast({ text: 'Sin roles para asignar', type: 'success-white', duration: 2000 });
        this.loadingData.update(()=>false);
        this.tablePropsRoles.data =  [];
      }
    } catch (error) {
      console.log('Error ROLES', error);
      this.customSrv.showToast({ text: 'Falló la solicitud', type: 'error-white', duration: 2000 })
    }
  }
  editarUser(userDataParaEditar: ListarUsuarioDto) {
    console.log('data que llega para editar', userDataParaEditar);   
    const data = this.usuario.find(
      (u: ListarUsuarioDto) => u.idUsuario === userDataParaEditar.idUsuario
    );
    const idUsuario = data.idUsuario;
    console.log('data convert', data);
    if (data) {
      this.editForm.patchValue({
        idUsuario: idUsuario,
        documento: data.documento,
        primerNombre: data.primerNombre,
        segundoNombre: data.segundoNombre,
        primerApellido: data.primerApellido,
        experiencia:data.experiencia,
        segApellido: data.segApellido,
        telefono: data.telefono,
        correo: data.correo,
      });
      this.editForm.get('documento')?.disable();
      this.editForm.get('correo')?.disable();
      this.openEdit.showModal = true;
      console.log('Formulario precargado con data:', this.editForm.value);
    }
  }
  eliminarUser(data: ListarUsuarioDto) {
    const dataUser = this.usuario.find((d) => data.idUsuario === d.idUsuario);
    console.log('data econtrada', dataUser);
  }

  goToHome() {
    // this.router.navigate(['/usuarios']);
    this.openEdit.showModal = false;
  }
  save() {
    this.loadingData.update(()=>true);
    if (this.editForm.valid) {
      const formData = this.editForm.getRawValue();
      const updateUsuarioDTO: UpdateUsuarioDTO = {
        idUsuario: formData.idUsuario,
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre,
        primerApellido: formData.primerApellido,
        segApellido: formData.segApellido,
        experiencia: formData.experiencia,
        telefono: formData.telefono,
        correo: formData.correo, 
      };
      try {
        this.srv.editarUsuario(updateUsuarioDTO).subscribe({
          next: (response) => {
            this.customSrv.showToast({ text: 'Usuario actualizado exitosamente', type: 'success-white', duration: 2000 });
            this.EditError = null;
            this.openEdit.showModal = false; 
            this.listarUsuarios(); 
            this.editForm.reset(); 
            this.editForm.get('documento')?.enable();
            this.editForm.get('correo')?.enable();
            this.loadingData.update(()=>false);
          },
          error: (err) => {
            console.error('Error al actualizar usuario:', err);
              this.customSrv.showToast({ text: 'Falló la solicitud', type: 'error-white', duration: 2000 });
              this.loadingData.update(()=>false);
          },complete:async()=>{
            this.customSrv.showToast({ text: 'Falló la solicitud', type: 'error-white', duration: 2000 });
            await new Promise(resolve=>setTimeout(resolve,2000));
            this.openEdit.showModal = false; 
            this.loadingData.update(()=>false);
          }
        });
      } catch (error) {
        this.loadingData.update(()=>false);
        console.error('Error al actualizar usuario:', error);
        this.customSrv.showToast({ text: 'Falló la solicitud', type: 'error-white', duration: 2000 })
      }finally{
        this.loadingData.update(()=>false);
      }
    } else {
      this.editForm.markAllAsTouched();
      this.customSrv.showToast({ text: 'Formulario invalido', type: 'error-white', duration: 2000 })
      this.loadingData.update(()=>false);
    }
  }
  openModalRoles(type:string,data?:any){
     this.userSelected = data;
    switch (type) {
      case 'abrir-modal':
        this.asingRolModal.showModal = true;
        break;
      case 'confirm':
        this.confirmAsigRol(this.userSelected);
        break;
        case 'registre-rol':
          this.openRegistreRol.showModal = true;
          break;
    }
  }
  confirmAsigRol(user:ListarUsuarioDto){
    this.loadingData.update(()=>true);
  const req = {
    idUsuario: user.idUsuario,
    idRol: this.rolSelected.id
  }
  this.srv.actualizarRolUsuario(req).subscribe({
    next: (response) => {
      console.log('Rol actualizado exitosamente:', response);
      this.listarUsuarios(); 
      this.customSrv.showToast({ text: response.mensaje, type: 'success-white', duration: 2000 });
      this.loadingData.update(()=>false);
    },
    error: (err) => {
      console.error('Error al actualizar usuario:', err);
        this.customSrv.showToast({ text: 'Falló la solicitud', type: 'error-white', duration: 2000 });
        this.loadingData.update(()=>false);
    },
    complete:async ()=>{
      await new Promise(resolve=>setTimeout(resolve,2000));
      this.loadingData.update(()=>false);
      this.asingRolModal.showModal = false;
    }
  });
  }
  onRolSelect(data:any){
    this.rolSelected = data;
  }
  constructor(private router: Router, private fb: FormBuilder) {}
}
