import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio-principal/inicio';
import { LoginUser } from './pages/login-user/login';
import { AdminDashboard } from './pages/dashboard-admin/admin';
import { CreateUser } from './pages/create-user/create-user';
import { RegistrarCat } from './pages/register-cat/register-cat';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login', component: LoginUser },
  
  // Dashboard de Administrador
  { 
    path: 'admin', 
    component: AdminDashboard,
    children: [
      { path: 'registrar-usuario', component: CreateUser },
      { path: 'registrar-cat', component: RegistrarCat },
      { path: '', redirectTo: 'registrar-usuario', pathMatch: 'full' }
    ]
  },

  // RUTAS PARA ROLES
  { path: 'enfermeria', component: Inicio }, 
  { path: 'almacen', component: Inicio },

  // Comodín
  { path: '**', redirectTo: '' }
];