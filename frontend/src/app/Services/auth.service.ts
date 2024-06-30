import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { DatosCaso } from '../Models/datos-caso';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private URL = 'http://localhost:4000/api';
    private jwtHelper = new JwtHelperService();

    // Nuevo BehaviorSubject para almacenar los datos del caso
    private datosCasoSubject = new BehaviorSubject<FormGroup>(this.formBuilder.group({} as DatosCaso));
    datosCaso$ = this.datosCasoSubject.asObservable();

    constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router) {}

    public isAuthenticated(): boolean {
        const token = sessionStorage.getItem('token');
        if (!token) {
            return false;
        }
        const isTokenExpired = this.jwtHelper.isTokenExpired(token);
        return !isTokenExpired;
    }

    public getRole(): string[] {
        const token = sessionStorage.getItem('token');
        if (token) {
            const helper = new JwtHelperService();
            const decodedToken = helper.decodeToken(token);
            return decodedToken.rol;
        }

        return [];
    }

    get datosCasoForm(): FormGroup {
        return this.datosCasoSubject.value;
    }

    initDatosCasoForm(): void {
        this.datosCasoSubject.next(this.formBuilder.group({} as DatosCaso));
    }

    signUp(user: any): Observable<any> {
        return this.http.post<any>(this.URL + '/users/signup', user);
    }

    signUpStudent(student: any): Observable<any> {
        return this.http.post<any>(this.URL + '/student/signup-student', student);
    }

    signIn(user: any): Observable<any> {
        return this.http.post<any>(this.URL + '/users/signin', user).pipe(
            tap((res) => {
                const redirectUrl = res.redirect;
                if (redirectUrl) {
                    this.router.navigate([redirectUrl]);
                }
            }),
            catchError((error) => {
                if (error.status === 401) {
                    // Manejar error de autenticación
                } else {
                    // Manejar otros errores
                }
                return throwError(error);
            })
        );
    }

    verifiedCode(student: any): Observable<any> {
        return this.http.post<any>(this.URL + '/student/verified-code', student).pipe(
            tap((res) => {
                const redirectUrl = res.redirect;
                if (redirectUrl) {
                    this.router.navigate([redirectUrl]);
                }
            }),
            catchError((error) => {
                if (error.status === 401) {
                    // Manejar error de autenticación
                } else {
                    // Manejar otros errores
                }
                return throwError(error);
            })
        );
    }

    confirmRole(email: string, role: string): Observable<any> {
        return this.http.post<any>(this.URL + '/users/confirm-role', { email, role }).pipe(
            tap((res) => {
                const redirectUrl = res.redirect;
                if (redirectUrl) {
                    this.router.navigate([redirectUrl]);
                }
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }
}
