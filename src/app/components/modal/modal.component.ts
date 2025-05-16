import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Output() onClose = new EventEmitter<void>();
  valorAnterior: boolean=false;
  @Input() idDefault: any;
  private destroy$ = new Subject<void>();
  @Input() modalProps: any = {
    height: '90',
    width: '90'
  };

  showModal: boolean = false;


  cerrarModal(event: any) {
    if (event.target.id === 'cierre' ) { 
      this.showModal = false;
      this.onClose.emit();
      this.destroy$.next();  // Evento de cierre
    }
  }


  cancelarEvento(event: any) {
    if (this.idDefault != 1) {
      event.preventDefault();
    }
    event.stopPropagation();
  }

  ngDoCheck(): void {
    if (this.showModal !== this.valorAnterior) {
      this.valorAnterior = this.showModal;

      if (this.showModal) {
        // Bloquea el scroll del body cuando se muestre el modal
        document.body.style.overflow = 'hidden';
      } else {

        document.body.style.overflow = '';
      }
    
    }
  }

  constructor() { };
}
