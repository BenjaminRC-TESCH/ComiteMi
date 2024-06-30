import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../../Services/admin.service';

@Component({
    selector: 'app-admin-carreras',
    templateUrl: './admin-carreras.component.html',
    styleUrls: ['./admin-carreras.component.css'],
})
export class AdminCarrerasComponent {
    carreras: any[] = [];
    selectedCarrera: any = null;
    newCarrera: any = {
        nombreCarrera: '',
    };
    showAddForm: boolean = false;

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.getCarreras();
    }

    getCarreras(): void {
        this.adminService.getCarreras().subscribe(
            (carreras) => {
                this.carreras = carreras;
            },
            (error) => {
                // Handle error
            }
        );
    }

    eliminarCarrera(carreraId: string): void {
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
                this.adminService.deleteCarrera(carreraId).subscribe(
                    (response) => {
                        Swal.fire('Éxito', 'Carrera eliminada exitosamente', 'success');
                        this.getCarreras();
                    },
                    (error) => {
                        Swal.fire('Error', 'Error al eliminar carrera', 'error');
                    }
                );
            }
        });
    }

    editarCarrera(carrera: any): void {
        this.selectedCarrera = { ...carrera };
    }

    guardarCambios(): void {
        if (this.selectedCarrera) {
            this.adminService.updateCarrera(this.selectedCarrera._id, this.selectedCarrera).subscribe(
                (response) => {
                    Swal.fire('Éxito', 'Caso actualizado exitosamente', 'success');
                    this.getCarreras();
                    this.cerrarModal();
                },
                (error) => {
                    Swal.fire('Error', error.error.message, 'error');
                }
            );
        }
    }

    cerrarModal(): void {
        this.selectedCarrera = null;
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

        this.selectedCarrera = null;
    }

    agregarCaso(): void {
        this.adminService.createCarrera(this.newCarrera).subscribe(
            (response) => {
                Swal.fire('Éxito', 'Caso creado exitosamente', 'success');
                this.getCarreras();
                this.newCarrera = {
                    nombreCarrera: '',
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
        this.newCarrera = {
            nombreCarrera: '',
        };
    }
}
