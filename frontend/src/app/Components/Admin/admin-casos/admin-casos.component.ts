import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../../Services/admin.service';

@Component({
    selector: 'app-admin-casos',
    templateUrl: './admin-casos.component.html',
    styleUrls: ['./admin-casos.component.css'],
})
export class AdminCasosComponent {
    casos: any[] = [];
    selectedCaso: any = null;
    newCaso: any = {
        nombreCaso: '',
    };
    showAddForm: boolean = false;

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.getCasos();
    }

    getCasos(): void {
        this.adminService.getCasos().subscribe(
            (casos) => {
                this.casos = casos;
            },
            (error) => {
                // Handle error
            }
        );
    }

    eliminarCaso(casoId: string): void {
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
                this.adminService.deleteCaso(casoId).subscribe(
                    (response) => {
                        Swal.fire('Éxito', 'Rol eliminado exitosamente', 'success');
                        this.getCasos();
                    },
                    (error) => {
                        Swal.fire('Error', 'Error al eliminar rol', 'error');
                    }
                );
            }
        });
    }

    editarCaso(caso: any): void {
        this.selectedCaso = { ...caso };
    }

    guardarCambios(): void {
        if (this.selectedCaso) {
            this.adminService.updateCaso(this.selectedCaso._id, this.selectedCaso).subscribe(
                (response) => {
                    Swal.fire('Éxito', 'Caso actualizado exitosamente', 'success');
                    this.getCasos();
                    this.cerrarModal();
                },
                (error) => {
                    Swal.fire('Error', error.error.message, 'error');
                }
            );
        }
    }

    cerrarModal(): void {
        this.selectedCaso = null;
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

        this.selectedCaso = null;
    }

    agregarCaso(): void {
        this.adminService.createCaso(this.newCaso).subscribe(
            (response) => {
                Swal.fire('Éxito', 'Caso creado exitosamente', 'success');
                this.getCasos();
                this.newCaso = {
                    nombreCaso: '',
                };
                this.cerrarFormularioAgregar();
            },
            (error) => {
                Swal.fire('Error', error.error.message, 'error');
            }
        );
    }

    cerrarFormularioAgregar(): void {
        this.showAddForm = false;
    }

    mostrarFormularioAgregar(): void {
        this.showAddForm = true;
    }

    cancelarAgregarCaso(): void {
        Swal.fire({
            title: 'Cancelado',
            text: 'La creación de Caso ha sido cancelada',
            icon: 'info',
            confirmButtonText: 'Ok',
            timer: 2000,
        });

        this.showAddForm = false;
        this.newCaso = {
            nombreCaso: '',
        };
    }
}
