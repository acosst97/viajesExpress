import { CommonModule } from '@angular/common';
import { Component, ContentChild, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
 //titulos
 @ContentChild('firstTH', { static: false }) firstTH: TemplateRef<any>;
 @ContentChild('lastTH', { static: false }) lastTH: TemplateRef<any>;
 //acciones botones
 @ContentChild('firstTD', { static: false }) firstTD: TemplateRef<any>;
 @ContentChild('lastTD', { static: false }) lastTD: TemplateRef<any>;
 @ContentChild('actions', { static: false }) actions: TemplateRef<any>;
 //lista de acciones desplegable
 lista_acciones = [
   {
     id: '1',
     nombre: 'columns',
     icono: 'layers-outline',
   },
   {
     id: '2',
     nombre: 'Exportar',
     icono: 'download-outline',
   }
 ]

 // dfhdafhadfh

 noData: any;
 @ViewChild("searchInput") searchInput: ElementRef;

 //padding de la tabla
 fileName = 'cliente.xlsx';
 //banderas que genera el componente de filtro
 flagFilters: boolean = false;

 //bandera que genera el componente de acciones
 flagActions: boolean = false;
 //
 auxData: any = [];
 selectedRow: string = '50'
 columns: any = [];
 filters: any = [];
 columnsBox: any = [];
 auxColumn: any = [];
 searchText: string = '';
 searchColumn: string = 'Todas las columnas';
 Object = Object;
 focusSearch: boolean;
 showInputSearch: boolean;
 @Input() tableProps: any = {
   filter: 2,
   actions: 2,
   exportar: {
     objeto: '',
     accion: () => {
     }
   },
   data: [],
   showFilter: false,
   // class: '',
 };

 onClick() {
   this.flagActions = false;
   this.flagFilters = false;
 }

 showFilter(ev: any) {
   ev.stopPropagation();
   this.flagActions = false;
   if (this.flagFilters === true) {
     this.flagFilters = false;
     return;
   }
   this.flagFilters = true;
 }

 nFilas(nFilas: number) {
   this.searchInput.nativeElement.value = '';
   this.tableProps.data = this.auxData;
   let filas = this.tableProps.data.slice(0, nFilas);
   this.tableProps.data = filas;
   this.selectedRow = nFilas.toString();
 }

 showActions(ev: any) {
   ev.stopPropagation();
   console.log(ev.stopPropagation());
   this.flagFilters = false;
   if (this.flagActions === true) {
     this.flagActions = false;
     return;
   }
   this.flagActions = true;
 }

 setValueFilter(event: any) {
   this.searchText = event.target.value;
 }

 setColumnFilter(id: string) {
   this.searchInput.nativeElement.value = '';
   this.searchColumn = id;
   let auxFilter = this.filters.shift();
   this.filters.push(auxFilter, id);
   if (this.searchColumn !== 'Todas las columnas') {
     this.filters = this.filters.filter((filtro: any) => filtro !== 'Todas las columnas');
     this.filters.splice(1, 0, 'Todas las columnas');
     this.flagFilters = false;
   }
 }

 clearInput() {
   this.searchInput.nativeElement.value = '';
   this.searchText = '';
   this.tableProps.data = this.auxData;
   this.expandInputSearch();
   this.onInputFocus(false);
 }

 // execute(id: string) {
 //   const element = document.getElementById('tableClientes');
 //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
 //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
 //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 //   XLSX.writeFile(wb, this.fileName);
 // }

 showColumns(id: string) {
   this.columns = this.auxColumn;
   this.tableProps.data = this.auxData;
   for (let i = 0; i < this.columnsBox.length; i++) {
     if (this.columnsBox[i].id === id) {
       if (this.columnsBox[i].active === true) {
         this.columnsBox[i].active = false;
       } else {
         this.columnsBox[i].active = true;
       }
     }

   }
 }

 expandInputSearch() {
   this.showInputSearch = !this.showInputSearch;
 }
 onInputFocus(val: boolean) {
   this.focusSearch = val;
 }

 ngOnInit() {
   const firstDataRow = this.tableProps.data[0];
   if (this.columns) {
     this.columns! = Object.keys(firstDataRow);
   }
   this.columnsBox = this.columns.map((columnName: any, index: any) => ({
     id: index.toString(),
     nombre: columnName,
     active: true
   }));
   this.filters = ['Todas las columnas', ...this.columns];
   this.auxData = this.tableProps.data;
 }

 constructor(private route: ActivatedRoute,) { };

}
