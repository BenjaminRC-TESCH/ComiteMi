import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from '../../../../Services/data.service';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-secre-acta-uno',
    templateUrl: './secre-acta-uno.component.html',
    styleUrls: ['./secre-acta-uno.component.css'],
})
export class SecreActaUnoComponent implements OnInit {
    currentDateAndTime: { date: string; time: string };
    tipoSesion: string = '';
    public palabras: string = '';
    public romano: string = '';
    participantes: any[] = [];

    constructor(private router: Router, private dataService: DataService) {
        this.currentDateAndTime = this.getCurrentDateTimeFormatted();
    }

    ngOnInit(): void {
        this.obtenerInformacionActa();
        this.getAsistentes();
    }

    getAsistentes() {
        this.dataService.getParticipantes().subscribe(
            (participantes) => {
                this.participantes = participantes.map((participante) => ({
                    ...participante,
                    presente: false,
                }));
                console.log(this.participantes);
            },
            (error) => {
                console.error(error);
            }
        );
    }

    obtenerInformacionActa() {
        this.dataService.obtenerInformacionActa().subscribe(
            (data) => {
                this.palabras = data.words;
                this.romano = data.roman;
            },
            (error) => {
                console.error('Error al obtener la información del acta:', error);
            }
        );
    }

    getCurrentDateTimeFormatted(): { date: string; time: string } {
        const optionsDate: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        };

        const optionsTime: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
        };

        const date = new Date();
        const formattedDate = date.toLocaleDateString('es-MX', optionsDate);
        const formattedTime = date.toLocaleTimeString('es-MX', optionsTime);

        return { date: formattedDate, time: formattedTime };
    }

    getCurrentDate(): Date {
        return new Date();
    }

    Pdatos(): void {
        const asistentePresidente = this.participantes.find((asistente) => asistente.roles.includes('Presidente del Comité Académico'));
        const asistenteSecretaria = this.participantes.find((asistente) => asistente.roles.includes('Secretaria de Comité'));

        console.log('Presidente:' + asistentePresidente, 'Secretaria: ' + asistenteSecretaria);

        if (!asistentePresidente || !asistentePresidente.presente || !asistenteSecretaria || !asistenteSecretaria.presente) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes marcar la casilla de asistencia del Director Académico y Secretaria de Comité Académico antes de continuar.',
            });
        } else if (!this.tipoSesion) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes seleccionar el tipo de sesión.',
            });
        } else {
            const asistentesSeleccionados = this.participantes.filter((asistente) => asistente.presente);
            this.dataService.setAsistentesSeleccionados(asistentesSeleccionados);
            this.dataService.setTipoSesion(this.tipoSesion);

            // Realizar la navegación solo si la condición se cumple
            this.router.navigate(['/secretaria-acta-dos']);
        }
    }
}
