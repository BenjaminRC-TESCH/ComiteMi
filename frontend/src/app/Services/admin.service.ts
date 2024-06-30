import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    private URL = 'http://localhost:4000/api';

    constructor(private http: HttpClient) {}

    /*Metodos para usuarios*/
    getAllUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.URL}/users/get`);
    }

    deleteUser(userId: string): Observable<any> {
        const url = `${this.URL}/users/delete/${userId}`;
        return this.http.delete(url);
    }

    updateUsuario(id: string, datosUsuario: any): Observable<any> {
        return this.http.put(`${this.URL}/users/update/${id}`, datosUsuario);
    }

    createUser(newUser: any): Observable<any> {
        return this.http.post<any>(`${this.URL}/users/create`, newUser);
    }

    /*Metodos para Estudiantes*/
    getStudents(): Observable<any[]> {
        return this.http.get<any[]>(`${this.URL}/students/get`);
    }

    updateStudent(id: string, datosEstudiante: any): Observable<any> {
        const url = `${this.URL}/students/update/${id}`;
        return this.http.put(url, datosEstudiante);
    }

    deleteStudent(studentId: string): Observable<any> {
        return this.http.delete(`${this.URL}/students/delete/${studentId}`);
    }

    /*Metodos para Roles*/
    getRoles(): Observable<string[]> {
        return this.http.get<string[]>(`${this.URL}/roles/get`);
    }

    createRol(newRole: any): Observable<any> {
        return this.http.post<any>(`${this.URL}/roles/create`, newRole);
    }

    updateRol(roleId: string, updatedRole: any): Observable<any> {
        return this.http.put(`${this.URL}/roles/update/${roleId}`, updatedRole);
    }

    deleteRol(roleId: string): Observable<any> {
        return this.http.delete(`${this.URL}/roles/delete/${roleId}`);
    }

    /*Metodos para casos*/
    getCasos(): Observable<string[]> {
        return this.http.get<string[]>(`${this.URL}/casos/get`);
    }

    createCaso(newCaso: any): Observable<any> {
        return this.http.post<any>(`${this.URL}/caso/create`, newCaso);
    }

    updateCaso(casoId: string, updatedRole: any): Observable<any> {
        return this.http.put(`${this.URL}/caso/update/${casoId}`, updatedRole);
    }

    deleteCaso(casoId: string): Observable<any> {
        return this.http.delete(`${this.URL}/caso/delete/${casoId}`);
    }

    /*Metodos para carreras*/
    getCarreras(): Observable<string[]> {
        return this.http.get<string[]>(`${this.URL}/carreras/get`);
    }

    createCarrera(newCarrera: any): Observable<any> {
        return this.http.post<any>(`${this.URL}/carrera/create`, newCarrera);
    }

    updateCarrera(carreraId: string, updatedRole: any): Observable<any> {
        return this.http.put(`${this.URL}/carrera/update/${carreraId}`, updatedRole);
    }

    deleteCarrera(carreraId: string): Observable<any> {
        return this.http.delete(`${this.URL}/carrera/delete/${carreraId}`);
    }
}
