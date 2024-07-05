import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*Logeo*/
import { EstRegistroComponent } from './Components/Auth/est-registro/est-registro.component';
import { PagLogInComponent } from './Components/Auth/pag-log-in/pag-log-in.component';

/*Estudiantes*/
import { PagInicioComponent } from './Components/Estudiantes/pag-inicio/pag-inicio.component';
import { EstPerfilComponent } from './Components/Estudiantes/est-perfil/est-perfil.component';
import { EstHistorialComponent } from './Components/Estudiantes/est-historial/est-historial.component';
import { PagRegCasoComponent } from './Components/Estudiantes/pag-reg-caso/pag-reg-caso.component';

/*Administrador*/
import { AdminCarrerasComponent } from './Components/Admin/admin-carreras/admin-carreras.component';
import { AdminCasosComponent } from './Components/Admin/admin-casos/admin-casos.component';
import { AdminEstudiantesComponent } from './Components/Admin/admin-estudiantes/admin-estudiantes.component';
import { AdminRolesComponent } from './Components/Admin/admin-roles/admin-roles.component';
import { AdministradorComponent } from './Components/Admin/administrador/administrador.component';

/*Autorizacion*/
import { authGuard } from './Guards/auth.guard';
import { noAuthGuard } from './Guards/no-auth-guard.guard';

/*Jefes*/
import { JefesAceptadosComponent } from './Components/Jefes/Jefes/jefes-aceptados/jefes-aceptados.component';
import { JefesCompendioComponent } from './Components/Jefes/Jefes/jefes-compendio/jefes-compendio.component';
import { JefesHistorialComponent } from './Components/Jefes/Jefes/jefes-historial/jefes-historial.component';
import { JefesPapeleraComponent } from './Components/Jefes/Jefes/jefes-papelera/jefes-papelera.component';

/*Secretaria*/
import { SecreAceptadosComponent } from './Components/Jefes/Secretaria/secre-aceptados/secre-aceptados.component';
import { SecreActaDosComponent } from './Components/Jefes/Secretaria/secre-acta-dos/secre-acta-dos.component';
import { SecreActaUnoComponent } from './Components/Jefes/Secretaria/secre-acta-uno/secre-acta-uno.component';
import { SecreHistorialComponent } from './Components/Jefes/Secretaria/secre-historial/secre-historial.component';
import { SecreRevisionAlumnoComponent } from './Components/Jefes/Secretaria/secre-revision-alumno/secre-revision-alumno.component';
import { SecreHistorialActasComponent } from './Components/Jefes/Secretaria/secre-historial-actas/secre-historial-actas.component';

const routes: Routes = [
    /* Rutas que cualquiera puede ver */
    {
        path: 'inicio',
        component: PagInicioComponent,
        canActivate: [noAuthGuard],
    },
    {
        path: 'registro-estudiantes',
        component: EstRegistroComponent,
        canActivate: [noAuthGuard],
    },
    {
        path: 'login',
        component: PagLogInComponent,
        canActivate: [noAuthGuard],
    },
    {
        path: '',
        component: PagInicioComponent,
        canActivate: [noAuthGuard],
    },

    /*Rutas para Estudiantes*/
    {
        path: 'estudiantes-historial',
        component: EstHistorialComponent,
        canActivate: [authGuard],
        data: { expectedRole: ['Estudiante'] },
    },
    {
        path: 'regcaso',
        component: PagRegCasoComponent,
        canActivate: [authGuard],
        data: { expectedRole: ['Estudiante'] },
    },
    {
        path: 'perfil-estudiante',
        component: EstPerfilComponent,
        canActivate: [authGuard],
        data: { expectedRole: ['Estudiante'] },
    },

    /*Rutas para Administradores*/
    {
        path: 'administrador',
        component: AdministradorComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['1000'],
        },
    },
    {
        path: 'admin-estudiantes',
        component: AdminEstudiantesComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['1000'],
        },
    },
    {
        path: 'admin-roles',
        component: AdminRolesComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['1000'],
        },
    },
    {
        path: 'admin-casos',
        component: AdminCasosComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['1000'],
        },
    },
    {
        path: 'admin-carreras',
        component: AdminCarrerasComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['1000'],
        },
    },

    /*Rutas para Jefes*/
    {
        path: 'jefes-aceptados',
        component: JefesAceptadosComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['20041', '19981', '19982', '20042', '20043', '20201'],
        },
    },
    {
        path: 'jefes-compendio',
        component: JefesCompendioComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['20041', '19981', '19982', '20042', '20043', '20201'],
        },
    },
    {
        path: 'jefes-historial',
        component: JefesHistorialComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['20041', '19981', '19982', '20042', '20043', '20201'],
        },
    },
    {
        path: 'jefes-papelera',
        component: JefesPapeleraComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['20041', '19981', '19982', '20042', '20043', '20201'],
        },
    },
    /*Rutas para la secretaria*/
    {
        path: 'secretaria-aceptados',
        component: SecreAceptadosComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['1001'],
        },
    },
    {
        path: 'secretaria-acta-dos',
        component: SecreActaDosComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['1001'],
        },
    },
    {
        path: 'secretaria-acta-uno',
        component: SecreActaUnoComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['1001'],
        },
    },
    {
        path: 'secretaria-historial',
        component: SecreHistorialComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['1001'],
        },
    },
    {
        path: 'secretaria-revision-alumno',
        component: SecreRevisionAlumnoComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['1001'],
        },
    },
    {
        path: 'secretaria-historial-actas',
        component: SecreHistorialActasComponent,
        canActivate: [authGuard],
        data: {
            expectedRole: ['1001'],
        },
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
