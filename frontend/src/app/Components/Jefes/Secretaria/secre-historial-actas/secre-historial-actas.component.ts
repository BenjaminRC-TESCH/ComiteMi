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
}
