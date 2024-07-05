import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from './Services/auth.service';
import { DataService } from './Services/data.service';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

import { PagLogInComponent } from './Components/Auth/pag-log-in/pag-log-in.component';
import { EstRegistroComponent } from './Components/Auth/est-registro/est-registro.component';

import { PagInicioComponent } from './Components/Estudiantes/pag-inicio/pag-inicio.component';
import { PagRegCasoComponent } from './Components/Estudiantes/pag-reg-caso/pag-reg-caso.component';

import { EstPerfilComponent } from './Components/Estudiantes/est-perfil/est-perfil.component';
import { EstHistorialComponent } from './Components/Estudiantes/est-historial/est-historial.component';

import { NavEstudianteComponent } from './Components/Navigation/nav-estudiante/nav-estudiante.component';
import { NavAdministradorComponent } from './Components/Navigation/nav-administrador/nav-administrador.component';
import { NavJefesComponent } from './Components/Navigation/nav-jefes/nav-jefes.component';
import { NavSecretariaComponent } from './Components/Navigation/nav-secretaria/nav-secretaria.component';
import { FooterComponent } from './Components/Navigation/footer/footer.component';

import { AdministradorComponent } from './Components/Admin/administrador/administrador.component';
import { AdminEstudiantesComponent } from './Components/Admin/admin-estudiantes/admin-estudiantes.component';
import { AdminRolesComponent } from './Components/Admin/admin-roles/admin-roles.component';
import { AdminCasosComponent } from './Components/Admin/admin-casos/admin-casos.component';
import { AdminCarrerasComponent } from './Components/Admin/admin-carreras/admin-carreras.component';

import { JefesCompendioComponent } from './Components/Jefes/Jefes/jefes-compendio/jefes-compendio.component';
import { JefesAceptadosComponent } from './Components/Jefes/Jefes/jefes-aceptados/jefes-aceptados.component';
import { JefesPapeleraComponent } from './Components/Jefes/Jefes/jefes-papelera/jefes-papelera.component';
import { JefesHistorialComponent } from './Components/Jefes/Jefes/jefes-historial/jefes-historial.component';

import { SecreAceptadosComponent } from './Components/Jefes/Secretaria/secre-aceptados/secre-aceptados.component';
import { SecreHistorialComponent } from './Components/Jefes/Secretaria/secre-historial/secre-historial.component';
import { SecreActaUnoComponent } from './Components/Jefes/Secretaria/secre-acta-uno/secre-acta-uno.component';
import { SecreActaDosComponent } from './Components/Jefes/Secretaria/secre-acta-dos/secre-acta-dos.component';
import { SecreRevisionAlumnoComponent } from './Components/Jefes/Secretaria/secre-revision-alumno/secre-revision-alumno.component';
import { SecreHistorialActasComponent } from './Components/Jefes/Secretaria/secre-historial-actas/secre-historial-actas.component';

@NgModule({
    declarations: [
        AppComponent,
        PagInicioComponent,
        PagRegCasoComponent,
        PagLogInComponent,
        AdministradorComponent,
        EstHistorialComponent,
        EstRegistroComponent,
        EstPerfilComponent,
        NavEstudianteComponent,
        NavAdministradorComponent,
        NavJefesComponent,
        NavSecretariaComponent,
        FooterComponent,
        AdminEstudiantesComponent,
        AdminRolesComponent,
        AdminCasosComponent,
        AdminCarrerasComponent,
        JefesCompendioComponent,
        JefesAceptadosComponent,
        JefesPapeleraComponent,
        JefesHistorialComponent,
        SecreAceptadosComponent,
        SecreHistorialComponent,
        SecreActaUnoComponent,
        SecreActaDosComponent,
        SecreRevisionAlumnoComponent,
        SecreHistorialActasComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        PdfViewerModule,
        SweetAlert2Module,
        BrowserAnimationsModule,
        MatButtonModule,
        FormsModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        MatCheckboxModule,
    ],
    providers: [AuthService, DataService],
    bootstrap: [AppComponent],
})
export class AppModule {}
