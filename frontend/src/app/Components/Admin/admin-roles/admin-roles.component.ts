import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../../Services/admin.service';

@Component({
    selector: 'app-admin-roles',
    templateUrl: './admin-roles.component.html',
    styleUrls: ['./admin-roles.component.css'],
})
export class AdminRolesComponent implements OnInit {
    roles: any[] = [];
    selectedRole: any = null;
    newRole: any = {
        id_rol: null,
        nombreRol: '',
    };
    showAddForm: boolean = false;

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.getRoles();
    }

    getRoles(): void {
        this.adminService.getRoles().subscribe(
            (roles) => {
                this.roles = roles;
            },
            (error) => {
                // Handle error
            }
        );
    }

    eliminarRol(roleId: string): void {
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
                this.adminService.deleteRol(roleId).subscribe(
                    (response) => {
                        Swal.fire('Éxito', 'Rol eliminado exitosamente', 'success');
                        this.getRoles();
                    },
                    (error) => {
                        Swal.fire('Error', 'Error al eliminar rol', 'error');
                    }
                );
            }
        });
    }

    editarRol(role: any): void {
        this.selectedRole = { ...role };
    }

    guardarCambios(): void {
        if (this.selectedRole) {
            this.adminService.updateRol(this.selectedRole._id, this.selectedRole).subscribe(
                (response) => {
                    Swal.fire('Éxito', 'Rol actualizado exitosamente', 'success');
                    this.getRoles();
                    this.cerrarModal();
                },
                (error) => {
                    Swal.fire('Error', 'Error al actualizar rol', 'error');
                }
            );
        }
    }

    cerrarModal(): void {
        this.selectedRole = null;
    }

    cancelarEdicion(): void {
        Swal.fire({
            title: 'Cancelado',
            text: 'La edición ha sido cancelada',
            icon: 'info',
            confirmButtonText: 'Ok',
            timer: 2000,
            timerProgressBar: true,
        });

        this.selectedRole = null;
    }

    agregarRol(): void {
        this.adminService.createRol(this.newRole).subscribe(
            (response) => {
                Swal.fire('Éxito', 'Rol creado exitosamente', 'success');
                this.getRoles();
                this.newRole = {
                    id_rol: null,
                    nombreRol: '',
                };
                this.cerrarFormularioAgregar();
            },
            (error) => {
                Swal.fire('Error', 'Error al crear rol', 'error');
            }
        );
    }

    cerrarFormularioAgregar(): void {
        this.showAddForm = false;
    }

    mostrarFormularioAgregar(): void {
        this.showAddForm = true;
    }

    cancelarAgregarRol(): void {
        Swal.fire({
            title: 'Cancelado',
            text: 'La creación de rol ha sido cancelada',
            icon: 'info',
            confirmButtonText: 'Ok',
            timer: 2000,
        });

        this.showAddForm = false;
        this.newRole = {
            id_rol: null,
            nombreRol: '',
        };
    }
}
