const secreCtrl = {};
const { Comite, Reciclaje } = require('../../models/Comites'); // Corrección en esta línea;
const EMAIL_ELECTRONICA = process.env.EMAIL_ELECTRONICA;
const PASS_ELECTRONICA = process.env.PASS_ELECTRONICA;
const EMAIL_INDUSTRIAL = process.env.EMAIL_INDUSTRIAL;
const PASS_INDUSTRIAL = process.env.PASS_INDUSTRIAL;
const EMAIL_SISTEMAS = process.env.EMAIL_SISTEMAS;
const PASS_SISTEMAS = process.env.PASS_SISTEMAS;
const EMAIL_ELECTROMECANICA = process.env.EMAIL_ELECTROMECANICA;
const PASS_ELECTROMECANICA = process.env.PASS_ELECTROMECANICA;
const EMAIL_INFORMATICA = process.env.EMAIL_INFORMATICA;
const PASS_INFORMATICA = process.env.PASS_INFORMATICA;
const EMAIL_ADMINISTRACION = process.env.EMAIL_ADMINISTRACION;
const PASS_ADMINISTRACION = process.env.PASS_ADMINISTRACION;
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

// Utilizamos promisify para convertir fs.unlink en una función que devuelve una promesa
const unlinkAsync = require('util').promisify(fs.unlink);

const templatesDir = path.resolve(__dirname, '../../templates'); //Exporta los templates para el envio de correos

//Importa archivo de constantes
const { Estados, Carreras, Secretary_Mensajes, Subject } = require('../../config/statuses');

// Método para obtener los alumnos aceptados
secreCtrl.getAceptadosSecretaria = async (req, res) => {
    try {
        // Definir los estados aceptados
        const estadosAceptados = [Estados.ACEPTADO_JEFA_CARRERA, Estados.ACEPTADO_SECRETARIA];

        // Obtener todos los alumnos de la base de datos cuyo casoEsta esté en los estados aceptados
        const alumnos = await Comite.find({ casoEsta: { $in: estadosAceptados } });

        // Mapear los alumnos para ajustar la respuesta
        const alumnosConEvidencia = alumnos.map((alumno) => {
            return {
                _id: alumno._id,
                matricula: alumno.matricula,
                nombreCom: alumno.nombreCom,
                telefono: alumno.telefono,
                casoEsta: alumno.casoEsta,
                direccion: alumno.direccion,
                carrera: alumno.carrera,
                casoTipo: alumno.casoTipo,
                semestre: alumno.semestre,
                correo: alumno.correo,
                motivosAca: alumno.motivosAca,
                motivosPer: alumno.motivosPer,
                evidencia: {
                    url: `${req.protocol}://${req.get('host')}/api/alumnos/${alumno._id}/pdf`, // Ruta para ver el PDF del alumno
                    fileName: `evidencia_${alumno._id}.pdf`, // Nombre del archivo
                    contentType: alumno.contentType, // Tipo de contenido
                },
                motivoComi: alumno.motivoComi,
                createdAt: alumno.createdAt, // Incluir el campo createdAt
            };
        });

        res.status(200).json(alumnosConEvidencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: Secretary_Mensajes.ERROR_OBTAINING_STUDENTS });
    }
};

// Método para aceptar por la secretaria
secreCtrl.aceptarSecre = async (req, res) => {
    try {
        const { id } = req.params;

        const alumno = await Comite.findById(id);

        if (!alumno) {
            return res.status(404).json({ message: `Alumno con id ${id} no encontrado` });
        }

        let jefeNombre, passJefe, nuevoEstado, nuevoMotivo, asuntoCorreo;

        switch (alumno.carrera) {
            case Carreras.INGENIERIA_SISTEMAS:
                jefeNombre = EMAIL_SISTEMAS;
                passJefe = PASS_SISTEMAS;
                break;

            case Carreras.INGENIERIA_INDUSTRIAL:
                jefeNombre = EMAIL_INDUSTRIAL;
                passJefe = PASS_INDUSTRIAL;
                break;

            case Carreras.INGENIERIA_ELECTROMECANICA:
                jefeNombre = EMAIL_ELECTROMECANICA;
                passJefe = PASS_ELECTROMECANICA;
                break;

            case Carreras.INGENIERIA_INFORMATICA:
                jefeNombre = EMAIL_INFORMATICA;
                passJefe = PASS_INFORMATICA;
                break;

            case Carreras.INGENIERIA_ELECTRONICA:
                jefeNombre = EMAIL_ELECTRONICA;
                passJefe = PASS_ELECTRONICA;
                break;

            case Carreras.INGENIERIA_ADMINISTRACION:
                jefeNombre = EMAIL_ADMINISTRACION;
                passJefe = PASS_ADMINISTRACION;
                break;

            default:
                jefeNombre = 'Jefe/a de Carrera';
                passJefe = '';
                break;
        }

        if (alumno.casoEsta === Estados.ACEPTADO_JEFA_CARRERA) {
            nuevoEstado = Estados.ACEPTADO_SECRETARIA;
            nuevoMotivo = Estados.ACEPTADO_SECRETARIA;
            asuntoCorreo = Secretary_Mensajes.SUCCESS_ACEPT_SECRE;
        } else if (alumno.casoEsta === Estados.ACEPTADO_SECRETARIA) {
            return res.status(400).json({ message: Secretary_Mensajes.ERROR_REV_COMITE });
        } else {
            return res.status(400).json({ message: Secretary_Mensajes.STATUS_ERROR });
        }

        alumno.casoEsta = nuevoEstado;
        alumno.motivoComi = nuevoMotivo;

        await alumno.save();

        // Cargar la plantilla de correo desde el archivo
        const templatePath = path.join(templatesDir, 'email_comite_secretary_accepted.html');
        const html = await fs.promises.readFile(templatePath, 'utf8');

        // Envía correo electrónico de notificación de aceptación
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: jefeNombre,
                pass: passJefe,
            },
        });

        // Reemplazar variables en la plantilla con los datos del estudiante
        const filledTemplate = html.replace('{{nombre}}', alumno.nombreCom);

        const mailOptions = {
            from: jefeNombre,
            to: alumno.correo,
            subject: Subject.SUBJECT_COMITE,
            html: filledTemplate,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json(alumno);
    } catch (error) {
        res.status(500).json({ message: Secretary_Mensajes.SERVER_ERROR });
        console.error(error);
    }
};

// Método para rechazar por la secretaria
secreCtrl.rechazarSecre = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivoRechazo } = req.body;

        const alumno = await Comite.findById(id);

        if (!alumno) {
            return res.status(404).json({ message: `Alumno con id ${id} no encontrado` });
        }

        let jefeNombre, passJefe, nuevoEstado, nuevoMotivo, asuntoCorreo;

        switch (alumno.carrera) {
            case Carreras.INGENIERIA_SISTEMAS:
                jefeNombre = EMAIL_SISTEMAS;
                passJefe = PASS_SISTEMAS;
                break;

            case Carreras.INGENIERIA_INDUSTRIAL:
                jefeNombre = EMAIL_INDUSTRIAL;
                passJefe = PASS_INDUSTRIAL;
                break;

            case Carreras.INGENIERIA_ELECTROMECANICA:
                jefeNombre = EMAIL_ELECTROMECANICA;
                passJefe = PASS_ELECTROMECANICA;
                break;

            case Carreras.INGENIERIA_INFORMATICA:
                jefeNombre = EMAIL_INFORMATICA;
                passJefe = PASS_INFORMATICA;
                break;

            case Carreras.INGENIERIA_ELECTRONICA:
                jefeNombre = EMAIL_ELECTRONICA;
                passJefe = PASS_ELECTRONICA;
                break;

            case Carreras.INGENIERIA_ADMINISTRACION:
                jefeNombre = EMAIL_ADMINISTRACION;
                passJefe = PASS_ADMINISTRACION;
                break;

            default:
                jefeNombre = 'Jefe/a de Carrera';
                passJefe = '';
                break;
        }

        if (alumno.casoEsta === Estados.ACEPTADO_JEFA_CARRERA) {
            nuevoEstado = Estados.RECHAZADO_SECRETARIA;
            nuevoMotivo = motivoRechazo || 'Motivo no especificado';
            asuntoCorreo = Secretary_Mensajes.REJECTED_SECRE;
        } else if (alumno.casoEsta === Estados.ACEPTADO_SECRETARIA) {
            return res.status(400).json({ message: Secretary_Mensajes.ERROR_REV_COMITE });
        } else {
            return res.status(400).json({ message: Secretary_Mensajes.STATUS_ERROR });
        }

        alumno.casoEsta = nuevoEstado;
        alumno.motivoComi = nuevoMotivo;

        await alumno.save();

        // Cargar la plantilla de correo desde el archivo
        const templatePath = path.join(templatesDir, 'email_comite_secretary_rejected.html');
        const html = await fs.promises.readFile(templatePath, 'utf8');

        // Envía correo electrónico de notificación de aceptación
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: jefeNombre,
                pass: passJefe,
            },
        });

        // Reemplazar variables en la plantilla con los datos del estudiante
        const filledTemplate = html.replace('{{nombre}}', alumno.nombreCom).replace('{{motivoComi}}', alumno.motivoComi);

        const mailOptions = {
            from: jefeNombre,
            to: alumno.correo,
            subject: Subject.SUBJECT_COMITE,
            html: filledTemplate,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json(alumno);
    } catch (error) {
        res.status(500).json({ message: Secretary_Mensajes.SERVER_ERROR });
        console.error(error);
    }
};

//Metodo para obtener el historial de la secretaria
secreCtrl.getHistorialSecre = async (req, res) => {
    try {
        // Buscar alumnos en la colección Comite con los estados especificados
        const alumnos = await Comite.find({
            $or: [
                { casoEsta: Estados.ACEPTADO_COMITE },
                { casoEsta: Estados.RECHAZADO_COMITE },
                { casoEsta: Estados.RECHAZADO_SECRETARIA },
            ],
        });

        // Crear un array con los alumnos y su información
        const alumnosConEvidencia = alumnos.map((alumno) => ({
            _id: alumno._id,
            matricula: alumno.matricula,
            nombreCom: alumno.nombreCom,
            telefono: alumno.telefono,
            casoEsta: alumno.casoEsta,
            direccion: alumno.direccion,
            carrera: alumno.carrera,
            casoTipo: alumno.casoTipo,
            semestre: alumno.semestre,
            correo: alumno.correo,
            motivosAca: alumno.motivosAca,
            motivosPer: alumno.motivosPer,
            evidencia: {
                url: `${req.protocol}://${req.get('host')}/api/alumnos/${alumno._id}/pdf`,
                fileName: `evidencia_${alumno._id}.pdf`,
                contentType: alumno.contentType,
            },
            motivoRechazo: alumno.motivoRechazo,
            rechazado: alumno.rechazado,
            pdfPath: `${req.protocol}://${req.get('host')}/api/alumnos/${alumno._id}/pdf`,
            updatedAt: alumno.updatedAt,
        }));

        // Ordenar los alumnos por nombre
        alumnosConEvidencia.sort((a, b) => a.nombreCom.localeCompare(b.nombreCom));

        // Enviar la respuesta con el historial de casos
        res.status(200).json({ historialJefe: alumnosConEvidencia });
    } catch (error) {
        console.error(Secretary_Mensajes.ERROR_OBTAINING_CASOS, error);
        res.status(500).json({ message: Secretary_Mensajes.SERVER_ERROR });
    }
};

//Metodo para obtener los alumnos aceptados
secreCtrl.getAlumnosAceptadosComite = async (req, res) => {
    try {
        const alumnos = await Comite.find({ casoEsta: Estados.ACEPTADO_SECRETARIA });

        const reciclajes = await Reciclaje.find({ casoEsta: Estados.ACEPTADO_SECRETARIA });

        // Combinar los resultados de ambas consultas
        const todosLosAlumnos = [...alumnos, ...reciclajes];

        // Mapear los alumnos para ajustar la respuesta
        const alumnosConEvidencia = todosLosAlumnos.map((alumno) => {
            return {
                _id: alumno._id,
                matricula: alumno.matricula,
                nombreCom: alumno.nombreCom,
                telefono: alumno.telefono,
                casoEsta: alumno.casoEsta,
                direccion: alumno.direccion,
                carrera: alumno.carrera,
                casoTipo: alumno.casoTipo,
                semestre: alumno.semestre,
                correo: alumno.correo,
                motivosAca: alumno.motivosAca,
                motivosPer: alumno.motivosPer,
                evidencia: {
                    url: `${req.protocol}://${req.get('host')}/api/alumnos/${alumno._id}/pdf`, // Ruta para ver el PDF del alumno
                    fileName: `evidencia_${alumno._id}.pdf`, // Nombre del archivo
                    contentType: alumno.contentType, // Tipo de contenido
                },
                motivoComi: alumno.motivoComi,
                createdAt: alumno.createdAt, // Incluir el campo createdAt
            };
        });

        // Verificar si se encontraron alumnos con el estado "AceptadoJefes" en alguna de las colecciones
        if (alumnosConEvidencia.length === 0) {
            return res.status(404).json({ message: Secretary_Mensajes.ERROR_CREATING_STUDENTS_ACEPT });
        }

        res.status(200).json(alumnosConEvidencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: Secretary_Mensajes.ERROR_OBTAINING_STUDENTS });
    }
};

secreCtrl.get;

module.exports = secreCtrl;
module.exports.fileUploadMiddleware = fileUpload;
