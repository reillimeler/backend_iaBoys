import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
 
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminDashboard {

  isCollapsed = false;
  titulo = 'Panel Administrativo';
   mostrarModal = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;

      if (url.includes('registrar-usuario')) {
        this.titulo = 'Gestión de Usuarios';
      } else if (url.includes('registrar-cat')) {
        this.titulo = 'Registro de Insumos';
      } else {
        this.titulo = 'Panel Administrativo';
      }
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
   abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}