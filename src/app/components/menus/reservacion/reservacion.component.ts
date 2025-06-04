import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from '../../alert/alert.component';
import { CardComponent } from '../../card/card.component';
import { ModalComponent } from '../../modal/modal.component';
import { SelectComponent } from '../../select/select.component';
import { TableComponent } from '../../table/table.component';
import { SrvGenericosService } from '../../../services/srv-genericos.service';
import { DataService } from '../../../services/data.service';
import { FormvalidationService } from '../../../services/formvalidation.service';
import { Table } from '../../../interfaces/table';
import { firstValueFrom } from 'rxjs';
import { ListarReservaciones } from '../../../interfaces/reservaciones';
import { CustomSrvService } from '../../../services/custom-srv.service';

@Component({
  selector: 'app-reservacion',
  standalone: true,
  imports: [AlertComponent, CardComponent, CommonModule, ModalComponent, TableComponent, ReactiveFormsModule, SelectComponent],
  templateUrl: './reservacion.component.html',
  styleUrl: './reservacion.component.scss'
})
export class ReservacionComponent {

  @ViewChild('ViewDataModal') viewDataModal: any;
  @ViewChild('AsingRol')       asingRolModal: any;
  @ViewChild('QuestionModal')  questionModal: any;
 dataSrv         =    inject(DataService);
 customSrv       =    inject(CustomSrvService);
 service         =    inject(SrvGenericosService);
 formSrv         =    inject(FormvalidationService);
 
 loadingData     =    signal(false);
 tableProps      :    Table;
 reservaFilter   :    ListarReservaciones[];
 listReservas    :    ListarReservaciones[];
 reservaSelected :    ListarReservaciones;
 showResponseModal :  boolean = false;
 constructor(){}
 ngOnInit() {
  this.getListReservation();
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
  this.customSrv.toast$.subscribe((message) => {
    this.showResponseModal = !!message;
  });
 }
 async getListReservation(){
 try {
     const data: any = await firstValueFrom(this.service.ListarReservaciones());
     console.log('data reservas', data);
       this.listReservas = data.reservaciones;
       if (this.listReservas.length>0) {
        this.reservaFilter = this.listReservas.map((d:any)=>{
            const { idReservaciones, detallePago,valorPago,fechaReserva, fechaViaje,vehiculo,ruta,idUsuario,documentoUsuario,primerNombre,primerApellido ,...data } = d
          return {
            idReservaciones,
            detalle:detallePago,
            valor: "$ " + valorPago,
            fechaReserva,
            fechaViaje,
            documento:documentoUsuario,
            nombre : primerNombre + ' '+ primerApellido,
            ...data
          };
        });
        this.tableProps.data = this.reservaFilter;
       }else{
        this.tableProps.data = [];
       }
    
   } catch (error) {
     console.log('error user', error);
   }
 }
   
 

 openDelete(type:string, data:any){
  this.reservaSelected = data;
  switch (type) {
    case 'eliminar':
      this.questionModal.showModal = true;
      break;
      case 'confirm-delete':
       this.deleteConfirm(this.reservaSelected.idReservaciones);
        break;
    default:
      break;
  }
  
 }
 deleteConfirm(id:number){
  try {
    this.loadingData.update(()=>true);
    this.service.borrarReserva(id).subscribe({
      next:()=>{
        this.customSrv.showToast({ text: 'Registro Eliminado correctamente', type: 'success-white', duration: 2000 });
        this.loadingData.update(()=>false);
        this.getListReservation();
      },error:(error)=>{
        console.error("error",error);
        
        const mensaje = error?.error.mensaje || null 
        this.customSrv.showToast({ text: mensaje, type: 'error-white', duration: 2000 });
        this.loadingData.update(()=>false);
      },complete:async()=>{
        await new Promise(resolve=>setTimeout(resolve,2000));
        this.questionModal.showModal = false;
        this.loadingData.update(()=>false);
      }
    })
  } catch (error) {
    this.customSrv.showToast({ text: 'Falló la solicitud', type: 'success-white', duration: 2000 });
    console.error("error",error);
    this.loadingData.update(()=>false);
  }
 }
 viewData(data:ListarReservaciones){
  const r = this.listReservas.find(d=> d.idReservaciones === data.idReservaciones)
  if(r){
    this.reservaSelected  = r;
    console.log("data", this.reservaSelected);
    this.viewDataModal.showModal = true;
  }
 }


}
