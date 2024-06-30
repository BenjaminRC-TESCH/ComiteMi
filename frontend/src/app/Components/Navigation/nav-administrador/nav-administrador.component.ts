import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';

@Component({
    selector: 'app-nav-administrador',
    templateUrl: './nav-administrador.component.html',
    styleUrls: ['./nav-administrador.component.css'],
})
export class NavAdministradorComponent {
    constructor(private authService: AuthService, private router: Router) {}

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
