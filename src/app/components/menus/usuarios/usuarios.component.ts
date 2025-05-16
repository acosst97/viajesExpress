import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent  implements OnInit{
  
  tableProp:any;

  ngOnInit(): void {
    this.tableProp = {
      data:[]
    }
  }
  



}
