import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginUser {
  protected ci = signal('');
  protected password = signal('');
  protected errorMessage = signal('');

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  onLogin() {
    const credenciales = { ci: this.ci(), password: this.password() };

    this.usuarioService.login(credenciales).subscribe({
      next: (res) => {
        if (res.success) {
          // Guardamos el nombre en el navegador para usarlo en el saludo de la otra página
          localStorage.setItem('userName', res.user.nombre);
          
          const rolUsuario = res.user.rol;

          // Lógica de redirección por roles
          switch (rolUsuario) {
            case 'Administrador':
              this.router.navigate(['/admin']);
              break;
            
            case 'Enfermeria':
              // Aunque no existan todavía, ya dejamos la lógica lista
              console.log('Redirigiendo a panel de Enfermería...');
              this.router.navigate(['/enfermeria']);
              break;

            case 'Almacen':
              console.log('Redirigiendo a panel de Almacén...');
              this.router.navigate(['/almacen']);
              break;

            default:
              this.errorMessage.set('Rol no reconocido. Contacte al administrador.');
              break;
          }
        }
      },
      error: (err) => {
        // Captura los errores del backend (401, 404, etc.)
        this.errorMessage.set(err.error?.message || 'Error de conexión con el servidor');
      }
    });
  }
}