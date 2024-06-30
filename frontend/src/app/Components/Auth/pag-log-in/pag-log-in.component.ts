import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { AdminService } from '../../../Services/admin.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-pag-log-in',
    templateUrl: './pag-log-in.component.html',
    styleUrls: ['./pag-log-in.component.css'],
})
export class PagLogInComponent implements OnInit {
    showPassword: boolean = false;
    mostrarFormularioVerificacion = false;
    mostrarSeleccionRol = false;
    ocultarLogin = true;
    roles: any[] = [];
    selectedRole: string = '';

    user = {
        email: '',
        password: '',
    };

    codeVerified = {
        codigoVerificacion: '',
    };

    constructor(private authServices: AuthService, private router: Router, private adminService: AdminService) {}

    ngOnInit(): void {
        this.getRoles();
    }

    getRoles(): void {
        this.adminService.getRoles().subscribe(
            (roles) => {
                this.roles = roles;
            },
            (error) => {}
        );
    }

    getRoleName(id_rol: string | number): string {
        console.log(id_rol);
        const role = this.roles.find((r) => r === id_rol.toString());
        console.log(role);
        return role ? this.getRoleDisplayName(role) : 'N/A';
    }

    getRoleDisplayName(id_rol: string): string {
        switch (id_rol) {
            case '1000':
                return 'Administrador';
            case '1001':
                return 'Secretaría de Comité';
            case '19981':
                return 'Jefatura de División de Ingeniería Electromecánica';
            case '19982':
                return 'Jefatura de División de Ingeniería Industrial';
            case '20041':
                return 'Jefatura de División de Ingeniería Sistemas Computacionales';
            case '20042':
                return 'Jefatura de División de Ingeniería Electrónica';
            case '20043':
                return 'Jefatura de División de Ingeniería Informática';
            case '20201':
                return 'Jefatura de División de Ingeniería Administración';
            default:
                return 'N/A';
        }
    }

    Signin() {
        if (!this.user.email || !this.user.password) {
            Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
            return;
        }

        this.authServices.signIn(this.user).subscribe(
            (res) => {
                if (res.success) {
                    if (res.roles && res.roles.length > 1) {
                        this.roles = res.roles;
                        this.mostrarSeleccionRol = true;
                        this.ocultarLogin = false;
                    } else {
                        sessionStorage.setItem('token', res.token);
                        sessionStorage.setItem('userEmail', this.user.email);
                        this.router.navigate([res.redirect]);
                    }
                } else {
                    Swal.fire('Error', res.error.message || 'Error al registrar', 'error');
                }
            },
            (error) => {
                console.error('Error al resgistro:', error);
                Swal.fire('Error', error.error.message || 'Error al registrar', 'error');

                if (error.error.message === 'Por favor, verifica tu cuenta') {
                    this.mostrarFormularioVerificacion = true;
                    this.ocultarLogin = false;
                }
            }
        );
    }

    confirmRole() {
        this.authServices.confirmRole(this.user.email, this.selectedRole).subscribe(
            (res) => {
                if (res.success) {
                    sessionStorage.setItem('token', res.token);
                    sessionStorage.setItem('userEmail', this.user.email);
                    this.ocultarLogin = true;
                    this.router.navigate([res.redirect]);
                } else {
                    Swal.fire('Error', res.error.message || 'Error al registrar', 'error');
                }
            },
            (error) => {
                this.ocultarLogin = true;
                Swal.fire('Error', error.error.message, 'error');
            }
        );
    }

    verified() {
        if (!this.codeVerified.codigoVerificacion || !this.user.email) {
            Swal.fire('Error', 'Por favor, ingresa tu código de verificación y tu correo electrónico.', 'error');
            return;
        }

        const data = {
            codigoVerificacion: this.codeVerified.codigoVerificacion,
            email: this.user.email,
        };

        this.authServices.verifiedCode(data).subscribe(
            (res) => {
                if (res.success) {
                    Swal.fire('Verificación Exitoso', res.message, 'success').then(() => {
                        sessionStorage.setItem('token', res.token);
                        sessionStorage.setItem('userEmail', this.user.email);
                        this.mostrarFormularioVerificacion = false;
                        this.ocultarLogin = true;
                        this.router.navigate(['/login']);
                    });
                }
            },
            (error) => {
                console.error('Error al resgistro:', error);
                Swal.fire('Error', error.error.message || 'Error al registrar', 'error');

                if (error.error.message === 'Por favor, verifica tu cuenta') {
                    this.mostrarFormularioVerificacion = true;
                }
            }
        );
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
}
