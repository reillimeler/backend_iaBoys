import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // <--- ¡Mantenlo!

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  //puerta de el lase con el backend
  private API_URL_REGISTER = 'http://localhost:3000/api/usuarios/register';
  private API_URL_LOGIN = 'http://localhost:3000/api/usuarios/login'; // <--- Nueva URL

  constructor(private http: HttpClient) {}

  registrar(datos: any): Observable<any> {
    return this.http.post(this.API_URL_REGISTER, datos);
  }

  // Nueva función para el Login
  login(credenciales: any): Observable<any> {
    return this.http.post(this.API_URL_LOGIN, credenciales);
  }

  getUsuarios(): Observable<any> {
    return this.http.get('http://localhost:3000/api/usuarios/getUsuario');
  }
///:id
  actualizarUsuario(id: number | null, datos: any): Observable<any> {
    return this.http.put(`http://localhost:3000/api/usuarios/${id}`, datos);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/usuarios/${id}`);
  }



}