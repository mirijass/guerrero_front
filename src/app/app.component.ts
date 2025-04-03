import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';
import { SharedModule } from './theme/shared/shared.module';
import { ToastService } from './theme/shared/service/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, SpinnerComponent, SharedModule]
})
export class AppComponent {
  title = 'Sistema de ventas Guerrero';
  constructor(public toastService: ToastService) {} // Inyección del servicio como público
}
