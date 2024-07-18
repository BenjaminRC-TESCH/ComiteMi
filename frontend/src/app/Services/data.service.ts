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
    private dia: string = '';
    private mes: string = '';
    private anio: string = '';
    private hora: string = '';
    private minuto: string = '';

    private direccionGeneral: string = '';

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

    //establece la descripcion general del caso
    setDGeneral(value: string[]): void {
        this.DGeneral = value;
    }

    //obtiene la descripcion general del caso
    getDGeneral(): string[] {
        return this.DGeneral;
    }

    //establece la resolucion general del caso
    setSolucion(value: string[]): void {
        this.Solucion = value;
    }

    //obtiene la resolucion general del caso
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

    //Establece el nombre de la directora de la lista de usuarios
    setDirecionGeneral(direccionGeneral: string): void {
        this.direccionGeneral = direccionGeneral;
    }

    getDirecionGeneral(): string {
        return this.direccionGeneral;
    }

    /*Metodos para obtener la fecha y hora*/
    //dia
    setDia(dia: string): void {
        this.dia = dia;
    }

    getdia(): string {
        return this.dia;
    }

    //mes
    setMes(mes: string): void {
        this.mes = mes;
    }

    getMes(): string {
        return this.mes;
    }

    //anio
    setAnios(anio: string): void {
        this.anio = anio;
    }

    getAnio(): string {
        return this.anio;
    }

    //hora
    setHora(hora: string): void {
        this.hora = hora;
    }

    getHora(): string {
        return this.hora;
    }

    //minutos
    setMinuto(minuto: string): void {
        this.minuto = minuto;
    }

    getMinuto(): string {
        return this.minuto;
    }

    // Método para enviar los estados de los alumnos y asistentes seleccionados
    enviarEstadosAlumnos(
        estadosAlumnos: { id: string; Estado: number }[],
        asistentes: { id: string; email: string }[],
        datosActa
    ): Observable<any> {
        return this.http.put(`${this.URL}/estados-alumnos`, { estadosAlumnos, asistentes, datosActa });
    }

    resetDatos(): void {
        this.tipoSesion = '';
        this.asistentesSeleccionados = [];
        this.DGeneral = [];
        this.Solucion = [];
        this.dia = '';
        this.mes = '';
        this.anio = '';
        this.hora = '';
        this.minuto = '';
        this.direccionGeneral = '';
    }
}
