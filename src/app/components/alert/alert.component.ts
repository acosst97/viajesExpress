import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { AlertData } from '../../interfaces/alert';
import { CustomSrvService } from '../../services/custom-srv.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  @Input() url: String = '';
  @Input() texto: any;
  @Input() type: string = '';

  alertSrv = inject(CustomSrvService);
  verde: boolean = false;
  rojo: boolean = false;

  protected alerData: AlertData | null = null;
  constructor(private cdr: ChangeDetectorRef) { }
  ngOnInit() {
    this.alertSrv.toast$.subscribe((data) => {
      this.alerData = data;

      if (data) {
        if (data.type === 'success-white' || data.type === 'limits-darkblue') {
          this.verde = true;
          this.rojo = false;
        } else if (data.type === 'error-white') {
          this.verde = false;
          this.rojo = true;
        }

        // Forzar comprobación de cambios
        this.cdr.detectChanges();
      }
    });
  }

  getType(type: string | undefined) {
    switch (type) {
      case 'success-white':
        this.verde = true;
        this.rojo = false;
        break;
      case 'error-white':
        this.verde = false;
        this.rojo = true;
        break;
      default:
        return this.rojo;
    }

    return '';
  }
}
