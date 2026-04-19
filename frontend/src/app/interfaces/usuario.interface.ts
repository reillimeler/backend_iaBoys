export interface Rol {
  id: number;
  nombre: string; 
}

export interface Usuario {
  nombre: string;
  email: string;
  rolId: number;
  password: string;
}