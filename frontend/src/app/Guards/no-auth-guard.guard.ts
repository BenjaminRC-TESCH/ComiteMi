import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import Swal from 'sweetalert2';

export const noAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    const authService = inject(AuthService);

    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
        Swal.fire({
            icon: 'info',
            title: 'Ya estás autenticado',
            text: 'Ya has iniciado sesión.',
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            }
        });
        return false;
    }

    return true;
};
