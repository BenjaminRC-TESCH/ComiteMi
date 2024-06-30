// nav-estudiante.component.ts
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';

@Component({
    selector: 'app-nav-estudiante',
    templateUrl: './nav-estudiante.component.html',
    styleUrls: ['./nav-estudiante.component.css'],
})
export class NavEstudianteComponent implements OnInit {
    isAuthenticated: boolean;
    isClient: boolean;

    constructor(private authService: AuthService, private router: Router) {
        this.isAuthenticated = false;
    }

    ngOnInit(): void {
        this.isAuthenticated = this.authService.isAuthenticated();
    }

    logout() {
        Swal.fire({
            title: '¿Seguro que quieres cerrar sesión?',
            text: 'Tu sesión actual se cerrará',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Lógica para cerrar sesión
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('userEmail');
                // Redireccionar a la página de inicio de sesión
                this.router.navigate(['/login']);
            }
        });
    }
}
