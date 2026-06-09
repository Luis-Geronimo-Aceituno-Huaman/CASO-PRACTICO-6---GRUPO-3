import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Usuario } from '../../shared/models';

const TOKEN_KEY = 'meditech_token';
const USER_KEY = 'meditech_user';

/**
 * Servicio de autenticación. Simula `POST /api/v1/login`.
 * Guarda el JWT en localStorage con la clave `meditech_token`.
 * El interceptor JWT lee este token para cada petición saliente.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly usuario = signal<Usuario | null>(this.cargarUsuario());
  readonly autenticado = computed(() => !!this.usuario());

  /** Credenciales de demo (en producción valida el backend). */
  private readonly credencialesDemo = { correo: 'admin@meditech.pe', password: 'admin123' };

  login(correo: string, password: string): Observable<{ token: string; usuario: Usuario }> {
    const ok = correo.trim().toLowerCase() === this.credencialesDemo.correo &&
               password === this.credencialesDemo.password;

    if (!ok) {
      return throwError(() => ({ status: 401, message: 'Correo o contraseña incorrectos' })).pipe(delay(700));
    }

    const usuario: Usuario = {
      id: 1, nombre: 'Dra. Patricia Admin', correo: this.credencialesDemo.correo, rol: 'admin',
    };
    // JWT simulado (header.payload.signature codificado en base64)
    const token = this.generarTokenFalso(usuario);

    return of({ token, usuario }).pipe(
      delay(900),
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.usuario));
        this.usuario.set(res.usuario);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.usuario.set(null);
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private cargarUsuario(): Usuario | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) as Usuario : null;
  }

  private generarTokenFalso(u: Usuario): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: u.id, name: u.nombre, rol: u.rol, iat: 1718000000 }));
    return `${header}.${payload}.meditech-signature`;
  }
}
