import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private baseUrl = 'http://localhost:3000/carrito/categoria'; // Reemplaza <tu-servidor> con la URL de tu backend
  private http: HttpClient;

  constructor(private injector: Injector) {
    // Lazily resolve HttpClient to avoid circular dependency
    this.http = this.injector.get(HttpClient);
  }


  // Listar todas las categorías
  listarCategorias(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  // Listar categorías activas
  listarCategoriasActivas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/activas`);
  }

  // Insertar una nueva categoría
  insertarCategoria(categoria: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, categoria);
  }

  // Actualizar una categoría
  actualizarCategoria(cveCategoria: number, categoria: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${cveCategoria}`, categoria);
  }

  // Eliminar una categoría
  eliminarCategoria(cveCategoria: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${cveCategoria}`);
  }

  // Cambiar el estatus de una categoría
  cambiarEstatusCategoria(cveCategoria: number, estatus: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${cveCategoria}/${estatus}`, {});
  }

}