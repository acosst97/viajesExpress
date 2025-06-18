import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CustomSrvService } from '../../services/custom-srv.service';

@Component({
  selector: 'app-error-connection',
  standalone: true,
  imports: [],
  templateUrl: './error-connection.component.html',
  styleUrl: './error-connection.component.scss'
})
export class ErrorConnectionComponent {
  isOnline: boolean = navigator.onLine

  constructor(
    private toastSrv: CustomSrvService,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {

      window.addEventListener('online', this.updateOnlineStatus.bind(this));
      window.addEventListener('offline', this.updateOnlineStatus.bind(this));
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('online', this.updateOnlineStatus.bind(this));
      window.removeEventListener('offline', this.updateOnlineStatus.bind(this));
    }
  }

  updateOnlineStatus(): void {
    this.isOnline = navigator.onLine
    if (!this.isOnline) {
      // this.toastSrv.showToast({ text: 'error-white', duration: 2000 })
      this.toastSrv.showToast({ text: "No tienes conexión a internet", type: 'error-white', duration: 2000 })
    } else {
      this.toastSrv.showToast({ text: "De nuevo en linea", type: 'success-white', duration: 2000 })
    }
  }
}
