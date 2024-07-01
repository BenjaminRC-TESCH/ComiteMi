import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';

@Component({
    selector: 'app-nav-jefes',
    templateUrl: './nav-jefes.component.html',
    styleUrls: ['./nav-jefes.component.css'],
})
export class NavJefesComponent implements OnInit {
    userEmail: string | null = '';

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit() {
        this.userEmail = sessionStorage.getItem('userEmail');
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
