import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JefesService } from '../Services/jefes.service';

@Injectable({
    providedIn: 'root',
})
export class SecretariaTsService {
    private URL = 'http://localhost:4000/api';

    constructor(private http: HttpClient, private jefesService: JefesService) {}

    getAlumnos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.URL}/get/alumnos`);
    }

    //Metodo para aceptar el caso por la secretaria
    aceptarSolicitudSecre(id: string): Observable<any> {
        return this.http.put(`${this.URL}/aceptar/secretaria/comite/${id}`, {});
    }

    //Metodo para rechazar el caso por la secretaria
    rechazarSolicitudSecre(id: string, motivoRechazo: string): Observable<any> {
        const url = `${this.URL}/rechazar/secretaria/comite/${id}`;
        const body = { motivoRechazo };
        return this.http.put(url, body);
    }

    //Metodo para obtener los alumnos aceptados
    getAlumnosAceptados(): Observable<string[]> {
        return this.http.get<any[]>(`${this.URL}/get/secretaria/comite/aceptados`);
    }

    //Metodo para obtener el historial de casos
    obtenerHistorialCasos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.URL}/historial/secretaria/comite`);
    }

    //Metodo para obtener los alumnos del PAPELERA
    //getReciclajeAlumnos(carrera: string): Observable<any[]> {
    //return this.jefesService.getReciclajeAlumnos();
    //}
}
