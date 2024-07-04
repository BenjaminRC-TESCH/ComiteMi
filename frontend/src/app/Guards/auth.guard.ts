import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    const authService = inject(AuthService);
    const isAuthenticated = authService.isAuthenticated();
    const userRoles = authService.getRole(); // Get roles as array
    const expectedRoles = route.data['expectedRole'];

    //console.log(userRoles);
    //console.log(expectedRoles);

    if (!isAuthenticated) {
        Swal.fire({
            icon: 'info',
            title: 'Acceso denegado',
            text: 'Debes iniciar sesión para acceder a esta página.',
            showCancelButton: false,
            confirmButtonText: 'Entendido',
        });
        return false;
    }

    if (expectedRoles && !expectedRoles.some((role: string) => userRoles.includes(role))) {
        Swal.fire({
            icon: 'info',
            title: 'Acceso denegado',
            text: 'No tienes permiso para acceder a esta página.',
            showCancelButton: false,
            confirmButtonText: 'Entendido',
        });
        return false;
    }

    return true;
};
