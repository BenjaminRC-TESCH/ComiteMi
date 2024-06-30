import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class JefesService {
    private URL = 'http://localhost:4000/api';

    constructor(private http: HttpClient) {}

    /************************/
    /*METODO PARA COMPENDIO*/
    /**********************/

    //Obtener alumnos segun la carrera
    getAlumnosJefes(token: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.URL}/get/jefes/comites/${token}`);
    }

    //Aceptar alumnos por el jefe de carrera
    aceptarAlumnoJefe(id: string): Observable<any> {
        return this.http.put(`${this.URL}/aceptar/jefes/comite/${id}`, {});
    }

    //Rechazar alumno por el jefe de carrera
    rechazarSolicitudAlumno(id: string, motivoRechazo: string): Observable<any> {
        const url = `${this.URL}/rechazar/jefes/comite/${id}`;
        const body = { motivoRechazo };
        return this.http.put(url, body);
    }

    // Mover alumno a PAPELERA por jefe de carrera
    moverAlumnoReciclaje(alumnoId: string): Observable<any> {
        const url = `${this.URL}/mover/reciclaje/jefes/comite/${alumnoId}`;
        return this.http.post(url, {});
    }

    /***********************/
    /*METODO PARA PAPELERA*/
    /*********************/

    //Metodo para obtener los alumnos del PAPELERA
    getReciclajeAlumnos(carrera: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.URL}/get/reciclaje/jefes/comite/${carrera}`);
    }

    //Metodo para resturar de PAPELERA
    restaurarAlumno(alumnoId: string): Observable<any> {
        const url = `${this.URL}/restaurar/reciclaje/jefes/comite/${alumnoId}`;
        return this.http.post(url, {});
    }

    //Metodo para eliminar de PAPELERA
    eliminarAlumnoReciclado(alumnoId: string): Observable<any> {
        const url = `${this.URL}/delete/reciclaje/jefes/alumno/${alumnoId}`;
        return this.http.delete(url);
    }

    /*********************************/
    /*METODO PARA HISTORIAL DE CASOS*/
    /*******************************/

    //Metodo para obtener el historial de casos
    obtenerHistorialCasos(token: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.URL}/historial/jefes/comite/${token}`);
    }

    /************************/
    /*METODO PARA ACEPTADOS*/
    /**********************/
    getAlumnosAceptados(token: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.URL}/get/jefes/comite/aceptados/${token}`);
    }
}
