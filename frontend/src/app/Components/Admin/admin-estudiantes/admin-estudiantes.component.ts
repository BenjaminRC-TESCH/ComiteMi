import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../../Services/admin.service';
import { NgForm } from '@angular/forms';

interface Student {
    _id: string;
    nombre: string;
    aPaterno: string;
    aMaterno: string;
    matricula: string;
    carrera: string;
    correo: string;
    password?: string;
}

@Component({
    selector: 'app-admin-estudiantes',
    templateUrl: './admin-estudiantes.component.html',
    styleUrls: ['./admin-estudiantes.component.css'],
})
export class AdminEstudiantesComponent implements OnInit {
    students: Student[] = [];
    selectedStudent: Student | null = null;
    enablePassword: boolean = false;
    password: string = '';
    isEditing: boolean = false;
    showPassword: boolean = false;

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.getStudents();
    }

    // Metodo para obtener los datos de los estudiantes
    getStudents() {
        this.adminService.getStudents().subscribe(
            (data: Student[]) => {
                this.students = data;
            },
            (error) => {
                console.error('Error al obtener los estudiantes', error);
            }
        );
    }

    // Metodo para seleccionar un estudiante para editar
    selectStudent(student: Student) {
        this.selectedStudent = { ...student };
        this.isEditing = true;
        this.enablePassword = false;
        this.password = '';
    }

    // Metodo para actualizar los datos del estudiante
    updateStudent(form: NgForm) {
        if (form.valid && this.selectedStudent) {
            const updateData = {
                nombre: this.selectedStudent.nombre,
                aPaterno: this.selectedStudent.aPaterno,
                aMaterno: this.selectedStudent.aMaterno,
                matricula: this.selectedStudent.matricula,
                carrera: this.selectedStudent.carrera,
                password: this.enablePassword ? this.password : undefined,
            };

            this.adminService.updateStudent(this.selectedStudent._id, updateData).subscribe(
                (response) => {
                    Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
                    this.isEditing = false;
                    window.location.reload();
                    this.getStudents();
                },
                (error) => {
                    console.error('Error al actualizar el perfil del estudiante:', error);
                    Swal.fire('Error', error.error.message || 'Error al actualizar el perfil del estudiante', 'error');
                }
            );
        }
    }

    // Metodo para eliminar un estudiante
    deleteStudent(studentId: string) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede revertir',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.adminService.deleteStudent(studentId).subscribe(
                    () => {
                        Swal.fire('Eliminado', 'El estudiante ha sido eliminado', 'success');
                        this.getStudents();
                    },
                    (error) => {
                        console.error('Error al eliminar el estudiante:', error);
                        Swal.fire('Error', 'No se pudo eliminar al estudiante', 'error');
                    }
                );
            }
        });
    }

    // Metodo para manejar el checkbox y el campo de contraseña
    togglePassword() {
        this.enablePassword = !this.enablePassword;
        this.password = '';
        this.showPassword = false;
    }

    // Metodo para cambiar entre modo vista y edición
    toggleEdit() {
        Swal.fire({
            title: 'Cancelado',
            text: 'La edición ha sido cancelada',
            icon: 'info',
            confirmButtonText: 'Ok',
            timer: 2000,
            timerProgressBar: true,
        });
        this.isEditing = !this.isEditing;
        this.selectedStudent = null;
    }

    // Metodo para cambiar la visibilidad de la contraseña
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
}
