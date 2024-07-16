import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../Services/data.service';
import { AuthService } from '../../../../Services/auth.service';
import { SecretariaTsService } from '../../../../Services/secretaria.ts.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-secre-revision-alumno',
    templateUrl: './secre-revision-alumno.component.html',
    styleUrls: ['./secre-revision-alumno.component.css'],
})
export class SecreRevisionAlumnoComponent implements OnInit {
    public palabras: string = '';
    public romano: string = '';
    public tipoSesion: string = '';
    alumnosAceptados: any[] = [];
    DGeneral: { [id: string]: string } = {};
    Solucion: { [id: string]: string } = {};
    alumnoEstados: { [id: string]: number } = {};

    DGeneralData: string[] = [];
    SolucionData: string[] = [];
    EstadosData: { id: string; Estado: number }[] = [];

    private changesInProgress: boolean = false; // Bandera para controlar cambios en progreso

    constructor(private router: Router, private dataService: DataService, private SecretariaTsService: SecretariaTsService) {}

    ngOnInit(): void {
        this.obtenerInformacionActa();
        this.obtenerAlumnosAceptados();
        this.tipoSesion = this.dataService.getTipoSesion();
        this.loadFromLocalStorage();
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

    // Obtiene a la directora general
    getDireccionGeneral(): string | undefined {
        const direccionGeneral = this.dataService.getDirecionGeneral();
        return direccionGeneral ? direccionGeneral.toUpperCase() : undefined;
    }

    obtenerAlumnosAceptados() {
        this.SecretariaTsService.getAlumnosAceptadosComite().subscribe(
            (data: any[]) => {
                this.alumnosAceptados = data;
                console.log(data);
                this.loadFromLocalStorage();
            },
            (error) => {
                console.error('Error al obtener los datos:', error);
            }
        );
    }

    Guardar() {
        Object.keys(this.DGeneral).forEach((id) => {
            localStorage.setItem(`DGeneral_${id}`, this.DGeneral[id]);
        });
        Object.keys(this.Solucion).forEach((id) => {
            localStorage.setItem(`Solucion_${id}`, this.Solucion[id]);
        });

        this.alumnosAceptados.forEach((alumno) => {
            const id = alumno._id;
            const savedDGeneral = localStorage.getItem(`DGeneral_${id}`);
            const savedSolucion = localStorage.getItem(`Solucion_${id}`);
            if (savedDGeneral) {
                this.DGeneralData.push(savedDGeneral);
            }
            if (savedSolucion) {
                this.SolucionData.push(savedSolucion);
            }
        });

        // Guardar estados de alumnos en un array
        this.EstadosData = this.alumnosAceptados.map((alumno) => {
            return {
                id: alumno._id,
                Estado: this.alumnoEstados[alumno._id] || 0,
            };
        });

        localStorage.setItem('EstadosAlumnos', JSON.stringify(this.EstadosData));

        console.log('Datos cargados Dgeneral para servicio:', this.DGeneralData);
        console.log('Datos cargados SolucionData para servicio:', this.SolucionData);
        console.log('Datos cargados EstadosData para servicio:', this.EstadosData);

        this.dataService.setDGeneral(this.DGeneralData);
        this.dataService.setSolucion(this.SolucionData);

        this.router.navigate(['/secretaria-acta-dos']);
    }

    saveToLocalStorage() {
        if (this.changesInProgress) {
            // Si hay cambios en progreso, actualizar localStorage
            this.alumnosAceptados.forEach((alumno) => {
                const id = alumno._id;
                localStorage.setItem(`DGeneral_${id}`, this.DGeneral[id] || '');
                localStorage.setItem(`Solucion_${id}`, this.Solucion[id] || '');
            });

            // Actualizar estados de alumnos en un array
            this.EstadosData = this.alumnosAceptados.map((alumno) => {
                return {
                    id: alumno._id,
                    Estado: this.alumnoEstados[alumno._id] || 0,
                };
            });

            localStorage.setItem('EstadosAlumnos', JSON.stringify(this.EstadosData));

            console.log('Datos guardados en localStorage:', this.DGeneral, this.Solucion, this.EstadosData);
            this.changesInProgress = false; // Reiniciar bandera
        }
    }

    handleInputChange() {
        this.changesInProgress = true; // Marcar cambios en progreso al cambiar el input
    }

    loadFromLocalStorage() {
        this.alumnosAceptados.forEach((alumno) => {
            const id = alumno._id;
            const savedDGeneral = localStorage.getItem(`DGeneral_${id}`);
            const savedSolucion = localStorage.getItem(`Solucion_${id}`);
            if (savedDGeneral) {
                this.DGeneral[id] = savedDGeneral;
            }
            if (savedSolucion) {
                this.Solucion[id] = savedSolucion;
            }
        });

        const savedEstados = localStorage.getItem('EstadosAlumnos');
        if (savedEstados) {
            const estadosArray = JSON.parse(savedEstados);
            estadosArray.forEach((estadoObj: { id: string; Estado: number }) => {
                this.alumnoEstados[estadoObj.id] = estadoObj.Estado;
            });
        }
    }
}
