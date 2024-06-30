import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-est-registro',
    templateUrl: './est-registro.component.html',
    styleUrls: ['./est-registro.component.css'],
})
export class EstRegistroComponent {
    constructor(private authService: AuthService, private router: Router) {}
    student = {
        nombre: '',
        aPaterno: '',
        aMaterno: '',
        matricula: '',
        carrera: '',
        correo: '',
        password: '',
        confirmPassword: '',
    };

    Signup(): void {
        this.authService.signUpStudent(this.student).subscribe(
            (response) => {
                Swal.fire(
                    'Registro Exitoso',
                    'Se ha envidado un código de verificación a tu correo',
                    'success'
                );
                this.router.navigate(['/login']);
            },
            (error) => {
                console.error('Error al resgistro:', error);
                Swal.fire(
                    'Error',
                    error.error.message || 'Error al registrar',
                    'error'
                );
            }
        );
    }
}
