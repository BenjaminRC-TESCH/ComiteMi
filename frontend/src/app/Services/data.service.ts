import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private tipoSesion: string = '';
  private asistentesSeleccionados: any[] = [];
  private DGeneral: string[]=[];
  private Solucion: string[]=[];
  private URL = 'http://localhost:4000/api'
  constructor(private http: HttpClient){}

  obtenerInformacionActa(): Observable<any> {
    return this.http.get<any>(this.URL + '/acta/number');
  }
  
  setTipoSesion(tipoSesion: string): void {
    this.tipoSesion = tipoSesion;
  }

  getTipoSesion(): string {
    return this.tipoSesion;
  }

  setAsistentesSeleccionados(asistentes: any[]): void {
    this.asistentesSeleccionados = asistentes;
  }

  getAsistentesSeleccionados(): any[] {
    return this.asistentesSeleccionados;
  }

  setDGeneral(value: string[]): void {
    this.DGeneral = value;
  }

  getDGeneral(): string[] {
    return this.DGeneral;
  }

  setSolucion(value: string[]): void {
    this.Solucion = value;
  }

  getSolucion(): string[] {
    return this.Solucion;
  }
  updateActaNumber(): Observable<any> {
    return this.http.put<any>(this.URL + '/acta/number', {});
  }
}