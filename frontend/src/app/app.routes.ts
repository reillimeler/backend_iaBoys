import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio-principal/inicio';
import { LoginUser } from './pages/login-user/login';
import { AdminDashboard } from './pages/dashboard-admin/admin';
import { CreateUser } from './pages/create-user/create-user';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login', component: LoginUser },
  
  // Dashboard de Administrador
  { 
    path: 'admin', 
    component: AdminDashboard,
    children: [
      { path: '', redirectTo: 'registrar-usuario', pathMatch: 'full' },
      { path: 'registrar-usuario', component: CreateUser },
    ]
  },

  // RUTAS PARA ROLES (Agregadas para que el Login no falle)
  // Por ahora, si no tienes los componentes, puedes usar Inicio o crear uno simple
  { path: 'enfermeria', component: Inicio }, 
  { path: 'almacen', component: Inicio },

  // Comodín: Cualquier ruta no encontrada vuelve al inicio
  { path: '**', redirectTo: '' }
];