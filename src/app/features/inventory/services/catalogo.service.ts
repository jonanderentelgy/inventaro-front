import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos la interfaz (equivale a tu CatalogoDTO en Java)
export interface Catalogo {
  id?: number; // Es opcional porque al crear (POST) aún no tenemos ID
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private apiUrl = 'http://localhost:8080/api/catalogos';

  constructor(private http: HttpClient) {}

  // ==========================================
  // PETICIONES: TIPOS DE COMPONENTE
  // ==========================================
  getComponentes(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`${this.apiUrl}/tipos-componente`);
  }

  createComponente(catalogo: Catalogo): Observable<Catalogo> {
    return this.http.post<Catalogo>(`${this.apiUrl}/tipos-componente`, catalogo);
  }

  updateComponente(id: number, catalogo: Catalogo): Observable<Catalogo> {
    return this.http.put<Catalogo>(`${this.apiUrl}/tipos-componente/${id}`, catalogo);
  }

  deleteComponente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tipos-componente/${id}`);
  }

  // ==========================================
  // PETICIONES: TIPOS DE UBICACION
  // ==========================================
  getUbicaciones(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`${this.apiUrl}/tipos-ubicacion`);
  }

  createUbicacion(catalogo: Catalogo): Observable<Catalogo> {
    return this.http.post<Catalogo>(`${this.apiUrl}/tipos-ubicacion`, catalogo);
  }

  updateUbicacion(id: number, catalogo: Catalogo): Observable<Catalogo> {
    return this.http.put<Catalogo>(`${this.apiUrl}/tipos-ubicacion/${id}`, catalogo);
  }

  deleteUbicacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tipos-ubicacion/${id}`);
  }
}
