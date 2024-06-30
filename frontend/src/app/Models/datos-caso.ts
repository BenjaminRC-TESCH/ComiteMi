import { Buffer } from 'buffer';

export interface DatosCaso {
    _id: string;
    //matricula: number;
    //nombreCom: string;
    telefono: number;
    casoEsta: string;
    direccion: string;
    //carrera: string;
    casoTipo: string;
    semestre: number;
    //correo: string;
    motivosAca: string;
    motivosPer: string;
    evidencia: Buffer | null;
    motivoComi: string;
    pdfPath: string;
    motivoRechazo: string;
    rechazado: boolean;
    idAlumno: string;
}
