import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../Services/auth.service';
import { JefesService } from '../../../../Services/jefes.service';
import { HttpErrorResponse } from '@angular/common/http';
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
        url: string;
    };
    motivoRechazo: string;
    rechazado: boolean;
    pdfPath: string;
}

@Component({
    selector: 'app-jefes-compendio',
    templateUrl: './jefes-compendio.component.html',
    styleUrls: ['./jefes-compendio.component.css'],
})
export class JefesCompendioComponent implements OnInit {
    Alumno: Alumno[] = [];
    userEmail: string | null = '';
    carreraSeleccionada: string = '';
    userToken: string | null = '';

    constructor(private authService: AuthService, private jefesService: JefesService) {}

    ngOnInit() {
        this.userToken = sessionStorage.getItem('token');
        this.getAlumnosJefes(this.userToken);
    }

    verPDF(pdfPath: string) {
        window.open(pdfPath, '_blank');
    }

    getAlumnosJefes(token: string) {
        this.jefesService.getAlumnosJefes(token).subscribe(
            (data: Alumno[]) => {
                console.log('Datos de alumnos jefes:', data);

                this.Alumno = data.map((alumno) => {
                    return {
                        ...alumno,
                        pdfPath: `${alumno.evidencia.url}`,
                    };
                });
            },
            (error) => {
                console.error('Error obteniendo alumnos jefes', error);
            }
        );
    }

    aceptarAlumnoJefe(id: string, nombreCom: string): void {
        Swal.fire({
            title: 'Confirmación',
            text: `¿Estás seguro de que deseas aceptar al alumno ${nombreCom}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.jefesService.aceptarAlumnoJefe(id).subscribe(
                    (response) => {
                        Swal.fire('Éxito', 'El alumno ha sido aceptado exitosamente', 'success');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    },
                    (error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error.error.message || 'Hubo un error al aceptar al alumno.',
                        });
                        console.error('Error al aceptar alumno jefe:', error);
                    }
                );
            }
        });
    }

    rechazarSolicitudAlumno(id: string, nombreCom: string): void {
        Swal.fire({
            title: 'Motivo de Rechazo',
            input: 'text',
            inputLabel: 'Ingrese el motivo de rechazo',
            inputValidator: (value) => {
                if (!value) {
                    return 'El motivo de rechazo es requerido';
                }
                return null;
            },
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Rechazar',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `Estás a punto de rechazar al alumno ${nombreCom}. ¿Estás seguro de continuar?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, rechazar',
                    cancelButtonText: 'Cancelar',
                }).then((confirmResult) => {
                    if (confirmResult.isConfirmed) {
                        const motivoRechazo = result.value;

                        this.jefesService.rechazarSolicitudAlumno(id, motivoRechazo).subscribe(
                            (response) => {
                                console.log('Solicitud rechazada con éxito', response);

                                Swal.fire('Éxito', 'Solicitud rechazada con éxito', 'success');
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                            },
                            (error) => {
                                console.error('Error al rechazar la solicitud', error);
                                Swal.fire('Error', error.error.message || 'Error al rechazar la solicitud', 'error');
                            }
                        );
                    }
                });
            }
        });
    }

    moverAlumnoAlReciclaje(alumnoId: string): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Estás a punto de mover al alumno a la papelera. ¿Estás seguro de continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, mover a la papelera',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.jefesService.moverAlumnoReciclaje(alumnoId).subscribe(
                    (data) => {
                        Swal.fire('Éxito', 'Alumno movido a la papelera', 'success');

                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    },
                    (error) => {
                        console.error('Error moviendo alumno al reciclaje:', error);

                        if (error instanceof HttpErrorResponse) {
                            console.error('Estado del error:', error.status);
                            console.error('Mensaje del error:', error.error);
                        }

                        Swal.fire('Error', error.error.message, 'error');
                    }
                );
            }
        });
    }

    mostrarInformacion(alumno: Alumno): void {
        Swal.fire({
            title: `Motivos de ${alumno.nombreCom}`,
            html: `<p><strong>Motivos Académicos:</strong> ${alumno.motivosAca}</p><p><strong>Motivos Personales:</strong> ${alumno.motivosPer}</p>`,
            icon: 'info',
        });
    }

    buscarPorMatricula(event: Event) {
        const matricula = (event.target as HTMLInputElement).value;
        if (matricula === '') {
            this.getAlumnosJefes(this.carreraSeleccionada);
        } else {
            this.Alumno = this.Alumno.filter((alumno) => alumno.matricula.toString().includes(matricula));
        }
    }
}
