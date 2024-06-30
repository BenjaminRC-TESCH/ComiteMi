import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { AdminService } from '../../../Services/admin.service';
import { User } from '../../../Models/users';

@Component({
    selector: 'app-administrador',
    templateUrl: './administrador.component.html',
    styleUrls: ['./administrador.component.css'],
})
export class AdministradorComponent implements OnInit {
    roles: any[] = [];
    users: User[] = [];
    selectedUser: User | null = null;
    newUser: User = {
        _id: '',
        name: '',
        email: '',
        password: '',
        roles: [],
    };
    showAddForm: boolean = false;
    userEmail: string | null = '';
    showLogoutOption: boolean = false;

    enablePassword: boolean = false;
    password: string = '';
    isEditing: boolean = false;
    showPassword: boolean = false;
    enableRoles: boolean = false;

    constructor(private authService: AuthService, private adminService: AdminService) {}

    ngOnInit(): void {
        this.getAllUsers();
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

    getAllUsers(): void {
        this.adminService.getAllUsers().subscribe(
            (data: User[]) => {
                this.users = data;
            },
            (error) => {
                //console.error('Error al obtener usuarios:', error);
            }
        );
    }

    getRoleName(id_rol: string | number): string {
        const role = this.roles.find((r) => r.id_rol === +id_rol);
        return role ? role.nombreRol : 'N/A';
    }

    eliminarUsuario(userId: string): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede revertir',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.adminService.deleteUser(userId).subscribe(
                    (response) => {
                        Swal.fire('Éxito', 'Usuario eliminado exitosamente', 'success');
                        this.getAllUsers();
                    },
                    (error) => {
                        Swal.fire('Error', 'Error al eliminar usuario', 'error');
                    }
                );
            }
        });
    }

    editarUsuario(user: User): void {
        this.selectedUser = { ...user };
        this.showAddForm = false;
        this.enablePassword = false;
        this.password = '';
        this.enableRoles = false;
    }

    guardarCambios(): void {
        if (this.selectedUser) {
            const updatedUser = {
                ...this.selectedUser,
                roles: this.enableRoles ? this.selectedUser.roles : undefined,
                password: this.enablePassword ? this.password : undefined,
            };
            this.adminService.updateUsuario(updatedUser._id, updatedUser).subscribe(
                (response) => {
                    Swal.fire('Éxito', 'Usuario actualizado exitosamente', 'success');
                    this.cancelarEdicion();
                    this.getAllUsers();
                },
                (error) => {
                    Swal.fire('Error', error.error.message, 'error');
                }
            );
        }
    }

    cancelarEdicion(): void {
        this.selectedUser = null;
        this.password = '';
        this.enablePassword = false;
        this.enableRoles = false;
    }

    mostrarFormularioAgregar(): void {
        this.showAddForm = true;
        this.selectedUser = null;
        this.newUser = {
            _id: '',
            name: '',
            email: '',
            password: '',
            roles: [],
        };
    }

    agregarUsuario(): void {
        this.adminService.createUser(this.newUser).subscribe(
            (response) => {
                Swal.fire('Éxito', 'Usuario agregado exitosamente', 'success');
                this.cancelarAgregarUsuario();
                this.getAllUsers();
            },
            (error) => {
                Swal.fire('Error', 'Error al agregar usuario', 'error');
            }
        );
    }

    cancelarAgregarUsuario(): void {
        this.showAddForm = false;

        Swal.fire({
            title: 'Cancelado',
            text: 'La creación ha sido cancelada',
            icon: 'info',
            confirmButtonText: 'Ok',
            timer: 2000,
            timerProgressBar: true,
        });
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    togglePassword() {
        this.enablePassword = !this.enablePassword;
        this.password = '';
    }

    agregarRol(): void {
        if (this.selectedUser) {
            this.selectedUser.roles.push('');
        }
    }

    quitarRol(index: number): void {
        if (this.selectedUser) {
            this.selectedUser.roles.splice(index, 1);
        }
    }
}
