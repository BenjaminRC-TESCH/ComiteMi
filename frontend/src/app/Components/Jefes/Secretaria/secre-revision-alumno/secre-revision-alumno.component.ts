import { Component } from '@angular/core';
import { DataService } from '../../../../Services/data.service';
import { AuthService } from '../../../../Services/auth.service';
import { SecretariaTsService } from '../../../../Services/secretaria.ts.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-secre-revision-alumno',
    templateUrl: './secre-revision-alumno.component.html',
    styleUrls: ['./secre-revision-alumno.component.css'],
})
export class SecreRevisionAlumnoComponent {
    public palabras: string = '';
    public romano: string = '';
    public tipoSesion: string = '';
    alumnosAceptados: any[] = [];
    DGeneral: string[] = [];
    Solucion: string[] = [];

    constructor(private router: Router, private dataService: DataService, private SecretariaTsService: SecretariaTsService) {}

    ngOnInit(): void {
        this.obtenerInformacionActa();
        this.obtenerAlumnosAceptados();
        this.tipoSesion = this.dataService.getTipoSesion();
        this.DGeneral = new Array(this.alumnosAceptados.length).fill('');
        this.Solucion = new Array(this.alumnosAceptados.length).fill('');
        this.getDireccionGeneral;
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

    //Obtiene a la directora general
    getDireccionGeneral(): string | undefined {
        const direccionGeneral = this.dataService.getDirecionGeneral();
        return direccionGeneral ? direccionGeneral.toUpperCase() : undefined;
    }

    obtenerAlumnosAceptados() {
        this.SecretariaTsService.getAlumnosAceptadosComite().subscribe(
            (data: any[]) => {
                this.alumnosAceptados = data;
                console.log(data);
            },
            (error) => {
                console.error('Error al obtener los datos:', error);
            }
        );
    }

    Guardar() {
        this.dataService.setDGeneral(this.DGeneral);
        this.dataService.setSolucion(this.Solucion);
        console.log(this.DGeneral);
        console.log(this.Solucion);
        this.router.navigate(['/secretaria-acta-dos']);
    }
}
