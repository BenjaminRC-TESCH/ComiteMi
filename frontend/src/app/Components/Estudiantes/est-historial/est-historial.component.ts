import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { StudentService } from '../../../Services/student.service';

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
    pdfPath: string; // Propiedad pdfPath para mantener la ruta del PDF
}

@Component({
    selector: 'app-est-historial',
    templateUrl: './est-historial.component.html',
    styleUrls: ['./est-historial.component.css'],
})
export class EstHistorialComponent implements OnInit {
    Alumno: Alumno[] = [];
    paginatedAlumnos: Alumno[] = [];
    userToken: string | null = '';

    // Paginación
    currentPage: number = 0;
    pageSize: number = 5;
    totalPages: number = 0;
    totalPagesArray: number[] = [];

    constructor(private authService: AuthService, private studentService: StudentService) {}

    ngOnInit(): void {
        this.userToken = sessionStorage.getItem('token'); // Cambiar por token
        this.getComiteAlumno(this.userToken);
    }

    // Método para obtener el historial de comite
    getComiteAlumno(id: string) {
        this.studentService.getComiteAlumno(id).subscribe(
            (data: Alumno[]) => {
                this.Alumno = data.map((alumno) => {
                    return {
                        ...alumno,
                        pdfPath: `${alumno.evidencia.url}`, // Ahora usamos la propiedad url
                    };
                });
                this.setupPagination();
            },
            (error) => {
                console.error('Error al obtener el historial de comites', error);
            }
        );
    }

    setupPagination() {
        this.totalPages = Math.ceil(this.Alumno.length / this.pageSize);
        this.totalPagesArray = new Array(this.totalPages);
        this.paginate();
    }

    paginate() {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedAlumnos = this.Alumno.slice(startIndex, endIndex);
    }

    goToPage(page: number) {
        this.currentPage = page;
        this.paginate();
    }

    prevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.paginate();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.paginate();
        }
    }

    verPDF(pdfPath: string) {
        // Abrir una nueva ventana para mostrar el PDF
        window.open(pdfPath, '_blank');
    }

    mostrarInformacion(alumno: Alumno): void {
        Swal.fire({
            title: `Motivos de ${alumno.nombreCom}`,
            html: `<p><strong>Motivos Académicos:</strong> ${alumno.motivosAca}</p>
                   <p><strong>Motivos Personales:</strong> ${alumno.motivosPer}</p>`,
            icon: 'info',
        });
    }
}
