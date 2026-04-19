import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; 
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser {
  
  constructor(private usuarioService: UsuarioService) {}

  userForm = new FormGroup({
    nombre_completo: new FormControl('', [Validators.required]),
    ci: new FormControl('', [Validators.required]),
    // Cambiamos 'rol' por 'id_rol' y le damos un valor numérico por defecto (ej. 3 para Enfermería)
    id_rol: new FormControl(3, [Validators.required]), 
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit() {
    if (this.userForm.valid) {
      // El objeto que enviamos ahora coincide con el 'req.body' de tu amigo
      this.usuarioService.registrar(this.userForm.value).subscribe({
        next: (res) => {
          alert("¡Usuario creado! Su ID de sistema es: " + res.user.id_usuario);
          this.userForm.reset({ id_rol: 3 });
        },
        error: (err) => {
          // Capturamos el mensaje de "Esta CI ya existe" que puso tu amigo
          alert(err.error.message || "Error en el servidor");
        }
      });
    }
  }
}