import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminService } from '../Services/admin.service';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private tipoSesion: string = '';
    private asistentesSeleccionados: any[] = [];
    private DGeneral: string[] = [];
    private Solucion: string[] = [];

    private URL = 'http://localhost:4000/api';

    constructor(private http: HttpClient, private adminService: AdminService) {}

    obtenerInformacionActa(): Observable<any> {
        return this.http.get<any>(this.URL + '/get/acta/number');
    }

    createActaNumber(acta: FormData): Observable<any> {
        const headers = new HttpHeaders().append('Accept', 'application/json, multipart/form-data');
        return this.http.post<any>(this.URL + '/create/acta/number', acta, { headers });
    }

    getParticipantes(): Observable<any> {
        return this.http.get<any>(this.URL + '/get/participantes/acta');
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

    /*metodos para obtener las actas */
    getActas(): Observable<any[]> {
        return this.http.get<any[]>(`${this.URL}/actas`);
    }

    getActaPDF(id: string): Observable<Blob> {
        return this.http.get(`${this.URL}/actas/${id}/pdf`, { responseType: 'blob' });
    }
}
