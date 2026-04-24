import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-cat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-cat.html',
  styleUrls: ['./register-cat.css']
})
export class RegistrarCat {
  codigoInterno = signal('');
  nombre = signal('');
  stockMinimo = signal(0);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(private http: HttpClient) {}

  onRegister() {
    this.errorMessage.set('');
    this.successMessage.set('');

    const insumo = {
      codigo_interno: this.codigoInterno(),
      nombre: this.nombre(),
      stock_minimo: this.stockMinimo()
    };

    this.http.post('/api/insumos', insumo).subscribe({
      next: (response) => {
        this.successMessage.set('Insumo registrado exitosamente.');
        // Limpiar campos si deseas
        this.codigoInterno.set('');
        this.nombre.set('');
        this.stockMinimo.set(0);
      },
      error: (error) => {
        this.errorMessage.set('Error al registrar el insumo: ' + (error.error?.message || 'Error desconocido'));
      }
    });
  }
}