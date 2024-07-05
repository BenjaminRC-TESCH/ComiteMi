import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../../../Services/data.service';
import { SecretariaTsService } from '../../../../Services/secretaria.ts.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import Swal from 'sweetalert2';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-secre-acta-dos',
    templateUrl: './secre-acta-dos.component.html',
    styleUrls: ['./secre-acta-dos.component.css'],
})
export class SecreActaDosComponent implements OnInit {
    @ViewChild('Text1', { static: true }) Text1: ElementRef;
    @ViewChild('Text2', { static: true }) Text2: ElementRef;
    @ViewChild('Text3', { static: true }) Text3: ElementRef;
    @ViewChild('Text4', { static: true }) Text4: ElementRef;
    @ViewChild('Text5', { static: true }) Text5: ElementRef;
    @ViewChild('Text6', { static: true }) Text6: ElementRef;
    @ViewChild('Text7', { static: true }) Text7: ElementRef;
    @ViewChild('Text8', { static: true }) Text8: ElementRef;
    @ViewChild('Text9', { static: true }) Text9: ElementRef;

    public inputValue: string = '';
    public inputValue1: string = '';
    public inputValue2: string = '';
    public palabras: string = '';
    public romano: string = '';
    public tipoSesion: string = '';

    currentDateAndTime: { date: string; time: string };

    periodo: string = '';
    sesion: string = '';
    DGeneral: string[] = [];
    Solucion: string[] = [];
    participantes: any[] = [];
    asistentesSeleccionados: any[] = [];
    alumnosAceptados: any[] = [];

    constructor(private router: Router, private dataService: DataService, private SecretariaTsService: SecretariaTsService) {
        this.currentDateAndTime = this.getCurrentDateTimeFormatted();
    }

    ngOnInit(): void {
        this.obtenerInformacionActa();
        this.obtenerAlumnosAceptados();
        this.tipoSesion = this.dataService.getTipoSesion();
        this.asistentesSeleccionados = this.dataService.getAsistentesSeleccionados();
        this.DGeneral = this.dataService.getDGeneral();
        this.Solucion = this.dataService.getSolucion();
        this.getAsistentes();
    }

    getAsistentes() {
        this.dataService.getParticipantes().subscribe(
            (participantes) => {
                this.participantes = participantes.map((participante) => ({
                    ...participante,
                    presente: false,
                }));
            },
            (error) => {}
        );
    }

    chunk(arr: any[], size: number) {
        return arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);
    }

    getDGenerals(): string[] {
        return this.DGeneral;
    }

    getSolucion(): string[] {
        return this.Solucion;
    }

    getFormattedAsistentes(): string {
        return this.asistentesSeleccionados
            .map((asistente) => {
                let rolesFormatted = '';
                if (asistente.roles.length > 1) {
                    rolesFormatted = asistente.roles.slice(0, -1).join(', ') + ' y ' + asistente.roles.slice(-1);
                } else {
                    rolesFormatted = asistente.roles[0];
                }
                return `${asistente.name}, ${rolesFormatted}`;
            })
            .join(', ');
    }

    getPresidente(): string | undefined {
        const presidente = this.participantes.find((asistente) => asistente.roles.includes('Presidente del Comité Académico'));

        if (presidente) {
            return `${presidente.name}`;
        } else {
            return 'No se encontró al Presidente del Comité Académico entre los asistentes seleccionados.';
        }
    }

    getSecret(): string | undefined {
        const Secret = this.participantes.find((asistente) => asistente.roles.includes('Secretaria de Comité'));

        if (Secret) {
            return `${Secret.name}`;
        } else {
            return 'No se encontró al secretari@ del Comité Académico entre los asistentes seleccionados.';
        }
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

    //Funcio que retorna Fecha en el siguiente formato 11-agosto-2024
    getFormattedCurrentDateWithYear(): string {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        };
        const date = new Date();
        const formattedDate = date.toLocaleDateString('es-MX', options);

        // Remove the word "de" and replace spaces with hyphens
        const cleanDate = formattedDate.replace(/ de /g, '-');
        return cleanDate;
    }

    getFormattedCurrentDate(): string {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
        };
        const date = new Date();
        const formattedDate = date.toLocaleDateString('es-MX', options);
        return formattedDate;
    }

    getCurrentDate(): Date {
        return new Date();
    }

    obtenerAlumnosAceptados() {
        this.SecretariaTsService.getAlumnosAceptadosComite().subscribe(
            (data: any[]) => {
                this.alumnosAceptados = data;
            },
            (error) => {
                console.error('Error al obtener los datos:', error);
            }
        );
    }

    ReAlumn(): void {
        this.router.navigate(['/secretaria-revision-alumno']);
    }

    generatePDF() {
        Swal.fire({
            title: '¿Deseas generar el PDF con el nuevo número de acta?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, generar PDF',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            this.generatePDF1();
        });
    }

    generatePDF1() {
        const formattedTime = this.getCurrentDateTimeFormatted().time;
        const formatted = this.getCurrentDateTimeFormatted().date;
        const formattedDate = moment().format('DD-MMMM-YYYY');
        const text1 = this.Text1.nativeElement.textContent;
        const text2 = this.Text2.nativeElement.textContent;
        const text3 = this.Text3.nativeElement.textContent;
        const text4 = this.Text4.nativeElement.textContent;
        const text5 = this.Text5.nativeElement.textContent;
        const text6 = this.Text6.nativeElement.textContent;
        const text7 = this.Text7.nativeElement.textContent;
        const text8 = this.Text8.nativeElement.textContent;
        const text9 = this.Text9.nativeElement.textContent;

        const TM = this.inputValue.toUpperCase();
        const tableContent = {
            margin: [0, 0, 0, 0],
            table: {
                headerRows: 1,
                widths: ['20%', '40%', '40%'],
                body: [
                    [
                        {
                            text: 'CASO',
                            bold: true,
                            fillColor: 'black',
                            color: 'white',
                        },
                        {
                            text: 'NOMBRE DEL ESTUDIANTE',
                            bold: true,
                            fillColor: 'black',
                            color: 'white',
                        },
                        {
                            text: 'CARRERA',
                            bold: true,
                            fillColor: 'black',
                            color: 'white',
                        },
                    ],
                    ...this.alumnosAceptados.map((alumno, index) => [{ text: '3.3.' + (index + 1) }, alumno.nombreCom, alumno.carrera]),
                ],
            },
        };

        const asistentesData = this.asistentesSeleccionados.map((asistente) => {
            let rolesFormatted = '';
            if (asistente.roles.length > 1) {
                rolesFormatted = asistente.roles.slice(0, -1).join(', ') + ' y ' + asistente.roles.slice(-1);
            } else {
                rolesFormatted = asistente.roles[0];
            }
            return `${asistente.name.toUpperCase()}\n${rolesFormatted}`;
        });

        const groupedAsistentes = [];

        for (let i = 0; i < asistentesData.length; i += 2) {
            groupedAsistentes.push([asistentesData[i], asistentesData[i + 1] || '']);
        }

        const tableContent3 = {
            table: {
                widths: ['*', '*'],
                body: groupedAsistentes.map((row) => row.map((cell) => ({ text: cell, margin: [0, 100] }))),
            },
            alignment: 'center',
            layout: {
                defaultBorder: false,
            },
        };

        const tableContent2 = this.alumnosAceptados
            .map((alumno, index) => {
                return {
                    margin: [0, 0, 0, 0],
                    table: {
                        headerRows: 1,
                        widths: ['20%', '20%', '20%', '40%'], // Ajusta los anchos de las columnas según sea necesario
                        heights: [20, 20, 20, 20, 20, 20, 20, 20, 20, 90, 20], // Ajusta las alturas de las filas según sea necesario
                        body: [
                            [
                                { text: 'Sesión de Comité:' },
                                { text: this.romano },
                                { text: 'Fecha de la sesión:' },
                                { text: this.getFormattedCurrentDateWithYear() },
                            ],
                            [{ text: 'Número del Caso' }, { text: '3.3.' + (index + 1), colSpan: 3 }],
                            [{ text: 'Carrera de Ingeniería' }, { text: alumno.carrera, colSpan: 3 }],
                            [{ text: 'Nombre del Estudiante' }, { text: alumno.nombreCom, colSpan: 3 }],
                            [
                                {
                                    text: 'Descripción General del Caso:' + '\n' + this.DGeneral[index],
                                    colSpan: 4,
                                },
                            ],
                            [
                                {
                                    text: 'Resolución del Comité Académico:',
                                    colSpan: 4,
                                },
                            ],
                            [
                                {
                                    text: this.Solucion[index],
                                    colSpan: 4,
                                    alignment: 'justify',
                                },
                            ],
                            [
                                {
                                    colSpan: 2,
                                    rowSpan: 2,
                                    text: 'Visto Bueno Director General del TESCHA',
                                    alignment: 'center',
                                },
                                {},
                                { text: 'SI', alignment: 'center' },
                                { text: '(X)', alignment: 'center' },
                            ],
                            [{}, {}, { text: 'NO', alignment: 'center' }, { text: '(X)', alignment: 'center' }],
                            [{ text: '', colSpan: 4, height: 120 }],
                            [
                                {
                                    text: this.getPresidente() + '\nDIRECCIÓN GENERAL' + '\nTESCHA',
                                    colSpan: 4,
                                    alignment: 'center',
                                },
                            ],
                        ],
                    },
                };
            })
            .reduce((acc, curr) => {
                acc.push(curr);
                acc.push({ text: '\n\n', pageBreak: 'after' }); // Salto de línea después de cada tabla
                return acc;
            }, []);

        const docDefinition = {
            content: [
                {
                    table: {
                        body: [
                            [
                                {
                                    text: text1,
                                    fillColor: 'black',
                                    color: 'white',
                                    alignment: 'center',
                                },
                            ],
                        ],
                    },
                },
                { text: '\n' },
                {
                    text: text2,
                    alignment: 'justify',
                },
                { text: '\n\n' },
                { text: 'La sesión se efectuó conforme al siguiente:', alignment: 'justify' },
                { text: '\n\n' },
                { text: 'ORDEN DEL DÍA:', alignment: 'center' },
                { text: '\n' },
                {
                    type: 'none',
                    ol: [
                        {
                            text: '1. Lista de asistencia y declaración de quórum.',
                        },
                        {
                            text: '2. Lectura y aprobación del Orden del día.',
                        },
                        {
                            text: '3. Discusión y resolución de los asuntos para los que fue citado el Comité Académico.',
                        },
                        {
                            text: '',
                            type: 'none',
                            ol: [
                                {
                                    text: '3.1 Presentación y análisis de los casos de estudiantes para los que fue citado el Comité Académico.',
                                },
                            ],
                        },
                    ],
                },
                { text: '\n\n' },

                tableContent,

                { text: '\n' },

                {
                    type: 'none',
                    ol: [
                        { text: '4. Asuntos generales' },
                        { text: '\n' },
                        {
                            text: '',
                            type: 'none',
                            ol: [{ text: '4.1 ' + this.inputValue }],
                        },
                    ],
                },
                { text: '\n' },
                {
                    type: 'none',
                    ol: [
                        {
                            text: '1.LISTA DE ASISTENCIA Y DECLARATORIA DE QUÓRUM.',
                        },
                        {
                            text: '\n',
                        },
                        {
                            text: '',
                            type: 'none',
                            ol: [{ text: text3, alignment: 'justify' }],
                        },
                        {
                            text: '\n\n',
                        },
                        {
                            text: '2. LECTURA Y APROBACIÓN DEL ORDE DEL DÍA.',
                        },
                        {
                            text: '\n',
                        },
                        {
                            text: '',
                            type: 'none',
                            ol: [{ text: text4, alignment: 'justify' }, { text: '\n' }, { text: text5, alignment: 'justify' }],
                        },
                        {
                            text: '\n',
                        },
                        {
                            text: text6,
                        },
                        {
                            text: text7,
                            margin: [146, 0, 0, 0],
                        },
                        {
                            text: '\n',
                        },
                        {
                            text: '3. Discusión y resolución de los asuntos para los que fue citado el Comité Académico.',
                        },
                        {
                            text: '\n',
                        },
                        {
                            text: '',
                            type: 'none',
                            ol: [
                                {
                                    text: '3.1 Presentación y análisis de los casos de estudiantes para los que fue citado el Comité Académico.',
                                },
                            ],
                        },
                        {
                            text: '\n',
                        },
                        {
                            text: text8,
                            alignment: 'justify',
                        },
                        {
                            text: '\n',
                        },
                        {
                            text: text9,
                            alignment: 'justify',
                        },
                    ],
                },
                { text: '\n\n' },
                tableContent2,
                {
                    type: 'none',
                    ol: [
                        {
                            text: '4. ASUNTOS GENERALES.',
                        },
                        {
                            text: '\n',
                        },
                        {
                            text: '',
                            type: 'none',
                            ol: [{ text: '4.1 ' + TM }],
                        },
                        {
                            text: '\n',
                        },
                        {
                            text:
                                'El ' +
                                this.getPresidente() +
                                ' solicito a ' +
                                this.getSecret() +
                                ' informar sobre el periodo de recepción de ' +
                                this.periodo +
                                ' y agendar fecha para celebrar la proxima Sesión ' +
                                this.sesion,
                            alignment: 'justify',
                        },
                        {
                            text: '\n',
                        },
                        {
                            text: 'La ' + this.getSecret() + 'informa lo siguiente:',
                        },
                        {
                            text: '',
                            ul: [{ text: this.inputValue1 }, { text: this.inputValue2 }],
                        },
                        {
                            text: '\n',
                        },
                        {
                            text:
                                'El ' +
                                this.getPresidente() +
                                'preguntó si existen comentarios al respecto. No habiendo comentarios , se da por concluido.',
                        },
                        {
                            text: '\n',
                        },
                        {
                            text:
                                'Una vez agotados los puntos de la ' +
                                this.romano +
                                ' sesión ' +
                                this.tipoSesion +
                                'del Comité Académico del Tecnológico de Estudios Superiores de Chalco, siendo las ' +
                                formattedTime +
                                ' horas, del día ' +
                                formatted +
                                ' se da por concluida',
                            alignment: 'justify',
                        },
                        {
                            text: '\n\n\n',
                        },
                        tableContent3,
                    ],
                },
            ],
        };

        pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
            const formData = new FormData();
            formData.append('file', new Blob([buffer]), 'document.pdf');

            const userToken = sessionStorage.getItem('token');
            if (userToken) {
                formData.append('token', userToken);
            } else {
                console.error('No se pudo obtener el token del sessionStorage');
            }

            this.dataService.createActaNumber(formData).subscribe(
                (response) => {
                    console.log('PDF enviado y almacenado con éxito', response);
                    Swal.fire({
                        title: 'Acta generada correctamente',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'Aceptar',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.router.navigate(['/secretaria-historial-actas']);
                        }
                    });
                },
                (error) => {
                    console.error('Error al enviar el PDF', error);
                }
            );
        });
    }
}
