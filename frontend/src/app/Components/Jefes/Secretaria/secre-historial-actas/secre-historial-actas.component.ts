import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../Services/data.service';

@Component({
    selector: 'app-secre-historial-actas',
    templateUrl: './secre-historial-actas.component.html',
    styleUrls: ['./secre-historial-actas.component.css'],
})
export class SecreHistorialActasComponent implements OnInit {
    actas: any[] = [];

    constructor(private actaService: DataService) {}

    ngOnInit(): void {
        this.resetDatosService();
        this.getActas();
    }

    getActas(): void {
        this.actaService.getActas().subscribe(
            (data) => {
                this.actas = data;
                console.log('Actas registradas:', data);
            },
            (error) => {
                console.error('Error al obtener las actas', error);
            }
        );
    }

    viewPDF(id: string): void {
        this.actaService.getActaPDF(id).subscribe(
            (blob) => {
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            },
            (error) => {
                console.error('Error al obtener el PDF', error);
            }
        );
    }

    resetDatosService(): void {
        this.actaService.resetDatos();
    }

    //Metodo para buscar alumno por matricula, carrera, nombre y tipo de caso
    buscarActa(event: Event) {
        const query = (event.target as HTMLInputElement).value.toLowerCase();
        if (query === '') {
            this.getActas();
        } else {
            this.actas = this.actas.filter(
                (alumno) => alumno.number.toString().includes(query) || alumno.ordinal.toLowerCase().includes(query)
            );
        }
    }
}
