import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Buffer } from 'buffer';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { DatosCaso } from '../Models/datos-caso';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Student } from '../Models/students';
import { AdminService } from './admin.service';

@Injectable({
    providedIn: 'root',
})
export class StudentService {
    private URL = 'http://localhost:4000/api';

    // Nuevo BehaviorSubject para almacenar los datos del caso
    private datosCasoSubject = new BehaviorSubject<FormGroup>(this.formBuilder.group({} as DatosCaso));
    datosCaso$ = this.datosCasoSubject.asObservable();

    constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private adminService: AdminService) {}

    get datosCasoForm(): FormGroup {
        return this.datosCasoSubject.value;
    }

    initDatosCasoForm(): void {
        this.datosCasoSubject.next(this.formBuilder.group({} as DatosCaso));
    }

    // Metodo para obtener los alumnos segunda la carrera para el jefe de carrera
    getComiteAlumno(id: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.URL}/get/comite/alumno/${id}`);
    }

    //Metodo para obtener la informacion del alumno logeado
    getStudentProfile(id: string): Observable<Student> {
        return this.http.get<Student>(`${this.URL}/get/alumno/profile/${id}`);
    }

    // Metodo para registrar un caso
    registrarCaso(datosCaso: FormData, evidencia: Buffer): Observable<any> {
        const formData = new FormData();
        formData.append('telefono', datosCaso.get('telefono')!.toString());
        formData.append('direccion', datosCaso.get('direccion')!.toString());
        formData.append('casoEsta', datosCaso.get('casoEsta')!.toString());
        formData.append('casoTipo', datosCaso.get('casoTipo')!.toString());
        formData.append('semestre', datosCaso.get('semestre')!.toString());
        formData.append('motivosAca', datosCaso.get('motivosAca')!.toString());
        formData.append('motivosPer', datosCaso.get('motivosPer')!.toString());

        // Agrega la evidencia como un ArrayBuffer a FormData
        formData.append('evidencia', new Blob([evidencia]), 'evidencia.pdf');

        // Agrega el userToken como idAlumno
        const userToken = sessionStorage.getItem('token');
        if (userToken) {
            formData.append('token', userToken);
        } else {
            console.error('No se pudo obtener el token del ls');
        }

        const options = {
            headers: new HttpHeaders({
                Accept: 'application/json, multipart/form-data',
            }),
        };

        return this.http.post(`${this.URL}/create/alumno`, formData, options);
    }

    // Metodo para actualizar el perfil del estudiante
    updateStudentProfile(data: any): Observable<any> {
        return this.http.put(`${this.URL}/update/alumno/profile`, data);
    }

    getCasos(): Observable<string[]> {
        return this.adminService.getCasos();
    }
}
