import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private API_URL = 'http://localhost:8080/components';
  private CAT_TIPOS_URL = 'http://localhost:8080/api/catalogos/tipos-componente';
  private CAT_UBICACIONES_URL = 'http://localhost:8080/api/catalogos/tipos-ubicacion';

  constructor(private http: HttpClient) {}
  getComponentes(): Observable<any[]> { return this.http.get<any[]>(this.API_URL); }
  getTipos(): Observable<any[]> { return this.http.get<any[]>(this.CAT_TIPOS_URL); }
  getUbicaciones(): Observable<any[]> { return this.http.get<any[]>(this.CAT_UBICACIONES_URL); }

  create(data: any): Observable<any> { return this.http.post(this.API_URL, data); }
  updateLocation(id: string, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/location`, data);
  }
  delete(id: string): Observable<any> { return this.http.delete(`${this.API_URL}/${id}`); }
}
