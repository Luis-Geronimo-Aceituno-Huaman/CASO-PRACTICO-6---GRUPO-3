import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly cargando = signal(false);
  readonly verPassword = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    correo: ['admin@meditech.pe', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required, Validators.minLength(6)]],
  });

  enviar(): void {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    const { correo, password } = this.form.getRawValue();

    this.auth.login(correo, password).subscribe({
      next: () => {
        this.cargando.set(false);
        this.toast.success('Bienvenido al sistema Meditech');
        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        this.cargando.set(false);
        this.error.set(e?.message ?? 'No se pudo iniciar sesión');
      },
    });
  }

  campoInvalido(nombre: string): boolean {
    const c = this.form.get(nombre);
    return !!c && c.invalid && c.touched;
  }
}
