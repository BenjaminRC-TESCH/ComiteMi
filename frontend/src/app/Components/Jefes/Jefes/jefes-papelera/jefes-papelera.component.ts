import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../Services/auth.service';
import { JefesService } from '../../../../Services/jefes.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

interface Alumno {
    _id: string;
    matricula: number;
    nombreCom: string;
    telefono: number;
    casoEsta: string;
    direccion: string;
    carrera: string;
    casoTipo: string;
    semestre: number;
    correo: string;
    motivosAca: string;
    motivosPer: string;
    evidencia: {
        contentType: string;
        fileName: string;
        url: string; // Agregar la propiedad url al tipo evidencia
    };
    motivoRechazo: string;
    rechazado: boolean;
    pdfPath: string; // Propiedad pdfPath para mantener la ruta del PDF
    updatedAt: Date;
}

@Component({
    selector: 'app-jefes-papelera',
    templateUrl: './jefes-papelera.component.html',
    styleUrls: ['./jefes-papelera.component.css'],
})
export class JefesPapeleraComponent implements OnInit {
    alumnosReciclaje: Alumno[] = [];
    userEmail: string | null = '';
    showLogoutOption: boolean = false;
    carreraSeleccionada: string = ''; // Variable para almacenar la carrera asociada al usuario
    userToken: string | null = '';

    constructor(private authService: AuthService, private jefesService: JefesService, private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.userToken = sessionStorage.getItem('token');
        this.getAlumnosReciclaje(this.userToken);
    }

    getAlumnosReciclaje(carrera: string) {
        this.jefesService.getReciclajeAlumnos(carrera).subscribe(
            (data: Alumno[]) => {
                console.log('Datos de alumnos jefes:', data);

                this.alumnosReciclaje = data.map((alumno) => {
                    return {
                        ...alumno,
                        pdfPath: `${alumno.evidencia.url}`, // Si no necesitas pdfPath, puedes eliminar esta línea
                    };
                });
            },
            (error) => {
                console.error('Error obteniendo alumnos jefes', error);
            }
        );
    }

    restablecerAlumno(alumnoId: string): void {
        if (alumnoId) {
            // Mostrar alerta de confirmación antes de restaurar al alumno
            Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Deseas restablecer a este alumno?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, restablecer',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Si el usuario confirma, se procede con la restauración del alumno
                    this.jefesService.restaurarAlumno(alumnoId).subscribe(
                        () => {
                            // Mostrar mensaje de éxito con SweetAlert2 y cerrar después de 3 segundos
                            Swal.fire({
                                title: 'Éxito',
                                text: 'Alumno restaurado correctamente',
                                icon: 'success',
                                timer: 2000, // 3 segundos
                                timerProgressBar: true,
                            });

                            // Vuelve a cargar la lista de alumnos reciclados después de restaurar
                            this.getAlumnosReciclaje(this.carreraSeleccionada);
                            window.location.reload();
                        },
                        (error) => {
                            console.error('Error al restaurar alumno', error);

                            // Mostrar mensaje de error con SweetAlert2 y cerrar después de 3 segundos
                            Swal.fire({
                                title: 'Error',
                                text: 'Error al restaurar el alumno',
                                icon: 'error',
                                timer: 1000, // 3 segundos
                                timerProgressBar: true,
                            });
                        }
                    );
                }
            });
        } else {
            console.error('ID de alumno no válido');
        }
    }

    eliminarAlumnoReciclado(alumnoId: string): void {
        if (alumnoId) {
            // Mostrar alerta de confirmación antes de eliminar
            Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Seguro que quieres eliminar este registro?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Si el usuario confirma la eliminación, llama al servicio para eliminar el registro
                    this.jefesService.eliminarAlumnoReciclado(alumnoId).subscribe(
                        () => {
                            // Mostrar mensaje de éxito con SweetAlert2 y cerrar después de 3 segundos
                            Swal.fire({
                                title: 'Éxito',
                                text: 'Alumno eliminado de la papelera correctamente',
                                icon: 'success',
                                timer: 2000, // 3 segundos
                                timerProgressBar: true,
                            });

                            // Vuelve a cargar la lista de alumnos reciclados después de eliminar
                            this.getAlumnosReciclaje(this.carreraSeleccionada);
                        },
                        (error) => {
                            console.error('Error al eliminar alumno de la papelera', error);

                            // Mostrar mensaje de error con SweetAlert2 y cerrar después de 3 segundos
                            Swal.fire({
                                title: 'Error',
                                text: 'Error al eliminar el alumno de la papelera',
                                icon: 'error',
                                timer: 1000, // 3 segundos
                                timerProgressBar: true,
                            });
                        }
                    );
                }
            });
        } else {
            console.error('ID de alumno no válido');
        }
    }
}
