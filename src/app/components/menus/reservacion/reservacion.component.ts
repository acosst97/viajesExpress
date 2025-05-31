import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-reservacion',
  standalone: true,
  imports: [AlertComponent, CardComponent, CommonModule, ModalComponent, TableComponent, ReactiveFormsModule, SelectComponent],
  templateUrl: './reservacion.component.html',
  styleUrl: './reservacion.component.scss'
})
export class ReservacionComponent {
 dataSrv         =    inject(DataService);
 service           =    inject(SrvGenericosService);
 formSrv         =    inject(FormvalidationService);
 tableProps      :    Table;
 reservaFilter   :    ListarReservaciones[];
 listReservas    :    ListarReservaciones[];
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
  
 }

 async getListReservation(){
 try {
     const data: any = await firstValueFrom(this.service.ListarReservaciones());
     console.log('data reservas', data);
 
       this.listReservas = data.reservaciones
       if (this.listReservas.length>0) {
        this.reservaFilter = this.listReservas.map((d:any)=>{
            const { idReservaciones, detallePago,valorPago,fechaReserva, fechaViaje,capacidad,vehiculo,idUsuario,documentoUsuario,primerNombre,primerApellido ,...data } = d
          return {
            idReservaciones,
            detallePago,
            valorPago,
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
 openRegistre(){

 }
 editarReservacion(data:any){

 }
 viewData(data:any){

 }
}
