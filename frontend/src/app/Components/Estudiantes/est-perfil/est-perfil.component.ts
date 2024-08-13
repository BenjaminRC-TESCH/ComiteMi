import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { StudentService } from '../../../Services/student.service';
import { NgForm } from '@angular/forms';

interface Student {
    _id: string;
    nombre: string;
    aPaterno: string;
    aMaterno: string;
    matricula: string;
    carrera: string;
    correo: string;
    password: string;
}

@Component({
    selector: 'app-est-perfil',
    templateUrl: './est-perfil.component.html',
    styleUrls: ['./est-perfil.component.css'],
})
export class EstPerfilComponent implements OnInit {
    student: Student | null = null;
    userToken: string | null = '';
    enablePassword: boolean = false; // Variable para controlar el estado del checkbox
    password: string = ''; // Variable para mantener el valor del campo de contraseña
    isEditing: boolean = false; // Variable para controlar el modo de edición
    showPassword: boolean = false; // Variable para controlar la visibilidad de la contraseña

    constructor(private authService: AuthService, private studentService: StudentService) {}

    ngOnInit(): void {
        this.userToken = sessionStorage.getItem('token');
        if (this.userToken) {
            this.getStudentProfile(this.userToken);
        }
    }

    // Metodo para obtener los datos del alumno
    getStudentProfile(token: string) {
        this.studentService.getStudentProfile(token).subscribe(
            (data: Student) => {
                this.student = data;
            },
            (error) => {
                console.error('Error al obtener el perfil del estudiante', error);
            }
        );
    }

    // Metodo para actualizar los datos del alumno
    updateStudentProfile(form: NgForm) {
        if (form.valid && this.student && this.userToken) {
            const updateData = {
                token: this.userToken,
                nombre: this.student.nombre,
                aPaterno: this.student.aPaterno,
                aMaterno: this.student.aMaterno,
                matricula: this.student.matricula,
                carrera: this.student.carrera,
                password: this.enablePassword ? this.password : undefined,
            };

            this.studentService.updateStudentProfile(updateData).subscribe(
                (response) => {
                    Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
                    this.isEditing = false;
                },
                (error) => {
                    console.error('Error al resgistro:', error);
                    Swal.fire('Error', error.error.message || 'Error al registrar', 'error');
                }
            );
        }
    }

    // Metodo para manejar el checkbox y el campo de contraseña
    togglePassword() {
        this.enablePassword = !this.enablePassword;
        this.password = '';
        this.showPassword = false;
    }

    // Metodo para cambiar entre modo vista y edición
    //toggleEdit() {
    //this.isEditing = !this.isEditing;
    //}

    toggleEdit() {
        if (this.isEditing) {
            // Si estaba en modo de edición y se cancela, recargar la página
            window.location.reload();
        } else {
            this.isEditing = true;
        }
    }

    // Metodo para cambiar la visibilidad de la contraseña
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
}
