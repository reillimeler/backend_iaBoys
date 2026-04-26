import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,FormGroup, FormControl, Validators  } from '@angular/forms';
import { InsumoService } from '../../services/insumo.service';



@Component({
  selector: 'app-register-cat',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './register-cat.html',
  styleUrls: ['./register-cat.css']
})
export class RegistrarCat implements OnInit {

  codigoInterno = signal('');
  nombre = signal('');
  stockMinimo = signal(0);
  errorMessage = signal('');
  successMessage = signal('');
  insumos = signal<any[]>([]);
  mostrarModal = signal(false);

  busqueda = signal('');
  modoEdicion = signal(false);
  idEditando = signal<number | null>(null);

  constructor(private insumoService: InsumoService ) {}

  ngOnInit() {
    this.cargarInsumos();
  }

  abrirModal() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }
  
  cargarInsumos() {
    this.insumoService.getInsumos().subscribe({
      next: (res: any) => {
        this.insumos.set(res.data);
      }
    });
  }

  onRegister() {
  this.errorMessage.set('');
  this.successMessage.set('');

  const insumo = {
    codigo_interno: this.codigoInterno(),
    nombre: this.nombre(),
    stock_minimo: this.stockMinimo()
  };

  if (this.modoEdicion()) {
    this.insumoService.actualizarInsumo(this.idEditando(), insumo).subscribe({
      next: (res: any) => {
        this.successMessage.set('Actualizado correctamente');
        this.resetFormulario();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al actualizar');
      }
    });
  } else {
    this.insumoService.crearInsumo(insumo).subscribe({
      next: (res: any) => {
        this.successMessage.set(res.message);
        this.resetFormulario();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al registrar');
      }
    });
  }
}
resetFormulario() {
  this.codigoInterno.set('');
  this.nombre.set('');
  this.stockMinimo.set(0);

  this.modoEdicion.set(false);
  this.idEditando.set(null);

  this.cargarInsumos();
  this.cerrarModal();
}

 

  insumosFiltrados = computed(() => {
  const texto = this.busqueda().toLowerCase();

  return this.insumos().filter(i =>
    i.nombre.toLowerCase().includes(texto) ||
    i.codigo_interno.toLowerCase().includes(texto)
  );
  });


  editarInsumo(insumo: any) {
  this.modoEdicion.set(true);
  this.idEditando.set(insumo.id_insumo);

  this.codigoInterno.set(insumo.codigo_interno);
  this.nombre.set(insumo.nombre);
  this.stockMinimo.set(insumo.stock_minimo);

  this.abrirModal();
  }
eliminarInsumo(id: number) {
  if (!confirm('¿Eliminar insumo?')) return;

  this.insumoService.eliminarInsumo(id).subscribe({
    next: () => {
      this.cargarInsumos();
    },
    error: () => {
      alert('Error al eliminar');
    }
  });
}

}