import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InsumoService {
  private API_URL_CREATE = 'http://localhost:3000/api/insumos/createInsumo'; // POST

  constructor(private http: HttpClient) {}

  crearInsumo(datos: any): Observable<any> {
    return this.http.post(this.API_URL_CREATE, datos);
  }
}