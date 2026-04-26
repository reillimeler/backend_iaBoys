import { Component } from '@angular/core';
import { signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule, Validators } from '@angular/forms'; 
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})

  
export class CreateUser implements OnInit {

  constructor(private usuarioService: UsuarioService) {}

  // 🔥 SIGNALS
  usuarios = signal<any[]>([]);
  busqueda = signal('');
  mostrarModal = signal(false);
  modoEdicion = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  idEditando = signal<number | null>(null);

  // 🔥 FORM
  userForm = new FormGroup({
    nombre_completo: new FormControl('', [Validators.required]),
    ci: new FormControl('', [Validators.required]),
    id_rol: new FormControl(3, [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  // 🔥 INIT
  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (res: any) => {
        this.usuarios.set(res.data);
      }
    });
  }

  // 🔍 FILTRO
 usuariosFiltrados = computed(() => {
  const texto = this.busqueda().toLowerCase();

  return this.usuarios().filter(u => {
    const nombre = u.nombre_completo?.toLowerCase() || '';
    const ci = u.ci || '';
    const rol = this.getRolNombre(u.id_rol).toLowerCase();

    return nombre.includes(texto) ||
           ci.includes(texto) ||
           rol.includes(texto);
    });
  });

  abrirModal() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  editarUsuario(usuario: any) {
    this.modoEdicion.set(true);
    this.idEditando.set(usuario.id_usuario);

    this.userForm.patchValue({
      nombre_completo: usuario.nombre_completo,
      ci: usuario.ci,
      id_rol: usuario.id_rol
    });

    this.abrirModal();
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Eliminar usuario?')) return;

    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => this.cargarUsuarios()
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    if (this.modoEdicion()) {
      this.usuarioService.actualizarUsuario(this.idEditando(), this.userForm.value).subscribe({
        next: () => {
          alert('Usuario actualizado');
          this.resetForm();
        }
      });
    } else {
      this.usuarioService.registrar(this.userForm.value).subscribe({
        next: () => {
          alert('Usuario creado');
          this.resetForm();
        }
      });
    }
  }

  resetForm() {
    this.userForm.reset({ id_rol: 3 });

    this.modoEdicion.set(false);
    this.idEditando.set(null);

    this.cerrarModal();
    this.cargarUsuarios();
  }

  // 🔥 BONUS (rol bonito)
  getRolNombre(id: number) {
    if (id === 1) return 'Administrador';
    if (id === 2) return 'Almacén';
    if (id === 3) return 'Enfermería';
    return 'Desconocido';
  }
}