
import { Router } from '@angular/router';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  ListarUsuarioDto,
  RolDto,
  Roles,
  selectOptions,
  UpdateUsuarioDTO,
} from '../../../interfaces/usuarios';
import { SrvGenericosService } from '../../../services/srv-genericos.service';
import {  firstValueFrom } from 'rxjs';
import { Table } from '../../../interfaces/table';
import { TableComponent } from '../../table/table.component';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { SelectComponent } from "../../select/select.component";
import { CardComponent } from "../../card/card.component";
import { CustomSrvService } from '../../../services/custom-srv.service';
import { AlertComponent } from '../../alert/alert.component';
import { FormvalidationService } from '../../../services/formvalidation.service';
import { AuthService } from '../../../services/auth.service';
import { LoginData } from '../../../interfaces/loginRequest';

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
  @ViewChild('QuestionModal') questionModal: any;
  
  srv               = inject(SrvGenericosService);
  customSrv         = inject(CustomSrvService);
  formSrv           = inject(FormvalidationService);
  authSrv           = inject(AuthService);
  loadingData       = signal(false);
  tableProps        : Table;
  tablePropsRoles   : Table;
  editForm          : FormGroup;
  usuario           : ListarUsuarioDto[];
  userWitRol        : ListarUsuarioDto
  usuarioFilter     : any[];
  loginData         : LoginData;
  permiso           : string[]=[];
  roles             : RolDto[] ;
  rolesOption       : selectOptions[] = [];
  rolSelected       : selectOptions;
  userSelected      : ListarUsuarioDto;
  EditError         : string = '';
  formSubmitted     : boolean = false;
  showResponseModal : boolean = false;
  desasociateSelec  : any;
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
    this.loginData  = this.authSrv.obtenerUsuario();
    this.permiso = this.loginData?.roles || [];
   
  }
  tieneRol(rol: string): boolean {
    return this.permiso.includes(rol);
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
      let usersToList = data.usuarios; 
      this.userWitRol = data.usuarios;
      console.log('data usuarios wir rol',  this.userWitRol); 
      const userRoles = this.loginData.roles;
      const esAdministrador = userRoles.includes('ADMINISTRADOR');
      // Si NO es administrador, solo ve su propio registro
      if (!esAdministrador) {
        usersToList = usersToList.filter((user: any) => user.idUsuario === this.loginData.idUsuario);
      }
      this.usuario = usersToList;
      if (this.usuario.length>0) {
      this.usuarioFilter = this.usuario.map((data:any)=>{
      const {idUsuario, documento,primerNombre,segundoNombre,
        primerApellido,segApellido,telefono,correo,experiencia,roles,...d
       } = data
       const nombreCompleto = `${primerNombre} ${primerApellido}`;
      return {
        idUsuario,
        documento,
        nombre:nombreCompleto,
        telefono,
        correo,
        experiencia
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
  openRegistre(){
    if (this.tieneRol('ADMINISTRADOR')) {
      this.openRegistreRol.showModal = true;
  }else{
      this.customSrv.showToast({ text: 'Permiso denegado', type: 'error-white', duration: 2000 })
  }
  }
  openModalRoles(type:string,data?:any){
     this.userSelected = data;
     this.userWitRol = this.usuario.find((user: any) => user.idUsuario === data.idUsuario); 
     console.log("data wit rol" , "***" , this.userWitRol);
    switch (type) {
      case 'abrir-modal':
        if (this.tieneRol('ADMINISTRADOR')) {
          this.asingRolModal.showModal = true;
        }else{
          this.customSrv.showToast({ text: 'Permiso denegado', type: 'error-white', duration: 2000 })
        }
        break;
      case 'confirm':
        this.confirmAsigRol(this.userSelected);
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
    console.log('rol selected',this.rolSelected);
    return this.rolSelected;
  }

  registreRol(){
    try {
      this.loadingData.update(()=>true);
      const text  = this.rolSelected.text;
      console.log('conversion',text);
      const req ={
        nombreRol: text
    }
     this.srv.registrarRol(req).subscribe({
       next: (response) => {
         console.log('Rol Registrado Correctamente',response);
         this.listarRoles(); 
         this.customSrv.showToast({ text: response.mensaje, type: 'success-white', duration: 2000 });
         this.loadingData.update(()=>false);
       },
       error: (err) => {
         console.error('Error al actualizar usuario:', err);
         const mensaje = err?.error.mensaje;
         this.customSrv.showToast({ text: mensaje, type: 'error-white', duration: 2000 });
         this.loadingData.update(()=>false);
       },
       complete:async ()=>{
         await new Promise(resolve=>setTimeout(resolve,2000));
         this.loadingData.update(()=>false);
         this.asingRolModal.showModal = false;
       }
     });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      this.customSrv.showToast({ text: "falló la solicitud", type: 'error-white', duration: 2000 });
      this.loadingData.update(()=>false);
    }
  }

  openModalDesasociate(type: string, data: { idUsuario: number, idRol: number, nombreRol: string }) {
    this.desasociateSelec = data;
    switch (type) {
      case 'question-delete-rol':
        const usuarioLogueado = this.authSrv.obtenerUsuario();
        const esPropio = usuarioLogueado.idUsuario === data.idUsuario;
    
        if (esPropio && data.nombreRol === 'ADMINISTRADOR') {
          this.customSrv.showToast({
            text: 'No puedes eliminarte tu propio rol de ADMINISTRADOR.',
            type: 'error-white',
            duration: 2500
          });
          return;
        }
  
        this.questionModal.showModal = true;
        break;
  
      case 'confirm-delete-rol':
        this.confirmDesasociateRol(this.desasociateSelec);
        break;
    }
  }
  confirmDesasociateRol(data: { idUsuario: number, idRol: number }) {
    try {
      this.loadingData.update(() => true);
  
      const request = {
        idUsuario: data.idUsuario,
        idRol: data.idRol
      };
  
      this.srv.desasociateRol(request).subscribe({
        next:async (response) => {
          this.customSrv.showToast({
            text: 'Rol eliminado con éxito',
            type: 'success-white',
            duration: 2000
          });

        },
        error: (error) => {
          this.loadingData.update(() => false);
          const mensaje = error?.error?.mensaje || 'Servicio no disponible';
          this.customSrv.showToast({ text: mensaje, type: 'error-white', duration: 2000 });
        },
        complete: async () => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.loadingData.update(() => false);
          this.questionModal.showModal = false;
          this.listarUsuarios();
        }
      });
    } catch (error) {
      this.loadingData.update(() => false);
      this.customSrv.showToast({
        text: 'Falló la solicitud',
        type: 'error-white',
        duration: 2000
      });
    }
  }
  constructor() {}
}
