import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosCaso } from '../../../Models/datos-caso';
import { Buffer } from 'buffer';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { Carousel } from 'bootstrap';
import { StudentService } from '../../../Services/student.service';

@Component({
    selector: 'app-pag-reg-caso',
    templateUrl: './pag-reg-caso.component.html',
    styleUrls: ['./pag-reg-caso.component.css'],
})
export class PagRegCasoComponent implements OnInit, AfterViewInit {
    datosCaso: DatosCaso = {
        _id: '',
        telefono: 0,
        direccion: '',
        casoEsta: 'Pendiente',
        casoTipo: '',
        semestre: 0,
        motivosAca: '',
        motivosPer: '',
        evidencia: null,
        motivoComi: '',
        pdfPath: '',
        motivoRechazo: '',
        rechazado: false,
        idAlumno: '',
    };

    userToken: string | null = '';
    correosCoinciden: boolean = false;
    confirmarCorreoInput: any;
    casoForm: FormGroup;
    formularioCompleto: boolean = false;
    casos: any[] = [];

    verificarFormularioCompleto() {
        this.formularioCompleto = this.casoForm.valid;
    }

    constructor(private studentService: StudentService, private router: Router, private fb: FormBuilder) {
        this.casoForm = this.fb.group({
            telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
            direccion: ['', Validators.required],
            casoEsta: ['Pendiente', Validators.required],
            casoTipo: ['', Validators.required],
            semestre: ['', Validators.required],
            motivosAca: ['', Validators.required],
            motivosPer: ['', Validators.required],
            evidencia: [null, Validators.required],
        });
    }

    ngOnInit(): void {
        this.confirmarCorreoInput = document.getElementById('confirmarcorreo');
        const myCarousel = document.getElementById('carouselExampleIndicators');
        if (myCarousel) {
            new Carousel(myCarousel, {
                interval: 3000, // Cambio cada 3 segundos
                wrap: true, // Permite que el carrusel vuelva al principio después de llegar al final
            });
        }
        this.casoForm.valueChanges.subscribe(() => {
            this.verificarFormularioCompleto();
        });

        this.userToken = sessionStorage.getItem('token');
        if (!this.userToken) {
            console.error('No se pudo obtener el token del ls');
        } else {
        }
        this.getCasos();
    }

    ngAfterViewInit(): void {
        this.myFunction();
    }

    //funcion para que el menu sea responsivo
    myFunction(): void {
        const x = document.getElementById('myTopnav');
        if (x) {
            if (x.className === 'topnav') {
                x.className += ' responsive';
            } else {
                x.className = 'topnav';
            }
        }
    }

    //limitar longitud
    limitarLongitud(controlName: string, maxLength: number): void {
        const control = this.casoForm.get(controlName);
        if (control?.value.length > maxLength) {
            control?.setValue(control?.value.slice(0, maxLength));
        }
    }

    onFileChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const file = inputElement.files?.[0];

        if (file) {
            if (!file.type.includes('pdf')) {
                console.error('El archivo seleccionado no es un PDF');
                // Aquí puedes mostrar un mensaje al usuario indicando que el archivo debe ser un PDF
            } else {
                const reader = new FileReader();
                reader.onload = () => {
                    // Convierte el ArrayBuffer a un Buffer
                    const buffer = Buffer.from(reader.result as ArrayBuffer);

                    // Actualiza el valor del campo 'evidencia' en casoForm
                    this.casoForm.patchValue({ evidencia: file });

                    // Asigna el buffer a tu objeto datosCaso
                    this.datosCaso.evidencia = buffer;
                };
                reader.readAsArrayBuffer(file);
            }
        }
    }

    async registrarCaso(): Promise<void> {
        if (this.casoForm.valid) {
            const fileInput = this.casoForm.get('evidencia')?.value;
            if (!fileInput || !(fileInput instanceof File)) {
                console.error('No se ha seleccionado un archivo válido.');
                return;
            }

            try {
                const file = fileInput as File;
                const reader = new FileReader();
                reader.onload = async () => {
                    const buffer = Buffer.from(reader.result as ArrayBuffer);

                    const formData = new FormData();
                    formData.append('telefono', this.casoForm.get('telefono')?.value.toString() ?? '');
                    formData.append('direccion', this.casoForm.get('direccion')?.value ?? '');
                    formData.append('casoEsta', this.casoForm.get('casoEsta')?.value ?? '');
                    formData.append('casoTipo', this.casoForm.get('casoTipo')?.value ?? '');
                    formData.append('semestre', this.casoForm.get('semestre')?.value.toString() ?? '');
                    formData.append('motivosAca', this.casoForm.get('motivosAca')?.value ?? '');
                    formData.append('motivosPer', this.casoForm.get('motivosPer')?.value ?? '');
                    formData.append('evidencia', new File([buffer], 'evidencia.pdf'));
                    formData.append('token', this.userToken ?? '12345');

                    // Llama al servicio con los datos del formulario y el archivo adjunto como buffer
                    const response = await this.studentService.registrarCaso(formData, buffer).toPromise();

                    await Swal.fire({
                        icon: 'success',
                        title: '¡Caso registrado exitosamente!',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    this.casoForm.reset();
                    window.location.reload();
                };
                reader.readAsArrayBuffer(file);
            } catch (error) {
                console.error('Error al registrar el caso:', error);
            }
        } else {
        }
    }

    getCasos(): void {
        this.studentService.getCasos().subscribe(
            (casos) => {
                this.casos = casos;
            },
            (error) => {
                // Handle error
            }
        );
    }
}
