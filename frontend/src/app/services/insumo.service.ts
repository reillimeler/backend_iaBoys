import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InsumoService {
  private API_URL_CREATE = 'http://localhost:3000/api/insumos/'; // POST

  private API_URL_OBTENER = 'http://localhost:3000/api/insumos/getInsumos';


  constructor(private http: HttpClient) {}

  crearInsumo(datos: any): Observable<any> {
    return this.http.post(this.API_URL_CREATE, datos);
  }

 // 🔹 Obtener todos los insumos
  getInsumos(): Observable<any> {
    return this.http.get(this.API_URL_OBTENER);
  }
   // 🔥 NUEVOS

  actualizarInsumo(id: number | null, datos: any): Observable<any> {
    return this.http.put(`http://localhost:3000/api/insumos/${id}`, datos);
  }

  eliminarInsumo(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/insumos/${id}`);
  }
 
}