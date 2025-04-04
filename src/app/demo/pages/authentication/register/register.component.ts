import { ToastService } from './../../../../theme/shared/service/toast.service';
// angular import
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-register',
  imports: [RouterModule, SharedModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {

  registerForm: FormGroup;

  toastService = inject(ToastService);

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {

    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[A-Z])(?=.*\\d).+$') // Al menos 1 mayúscula y 1 número
        ]
      ],
      cveRol: [2], // Valor fijo para el rol
      direccion: ['', Validators.required],
      aceptaTerminos: [false, Validators.requiredTrue]
    });

  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const payload = this.registerForm.value;
      delete payload.aceptaTerminos; // No enviar aceptaTerminos al backend

      this.http.post('http://localhost:3000/carrito/usuario', payload).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          this.toastService.show('Registro exitoso');
          this.router.navigate(['/login']); // Redirigir al login
        },
        error: (error) => {
          console.error('Error en el registro:', error);
          this.toastService.show('Ocurrió un error durante el registro');
        }
      });
    } else {
      this.toastService.show('Debes aceptar los términos y condiciones');
    }
  }

}
