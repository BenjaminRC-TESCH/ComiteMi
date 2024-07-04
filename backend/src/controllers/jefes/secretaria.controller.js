const secreCtrl = {};
const { Comite, Reciclaje } = require('../../models/Comites'); // Corrección en esta línea;
const PASS_COMI = process.env.PASS_COMI;
const EMAIL_COMI = process.env.EMAIL_COMI;
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

// Utilizamos promisify para convertir fs.unlink en una función que devuelve una promesa
const unlinkAsync = require('util').promisify(fs.unlink);

//Importa archivo de constantes
const { Estados, Carreras, Roles, IdRoles } = require('../../config/statuses');

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
        res.status(500).json({ message: 'Error al obtener los alumnos.' });
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
            case 'Ingeniería en Sistemas Computacionales':
                jefeNombre = EMAIL_SISTEMAS;
                passJefe = PASS_SISTEMAS;
                break;

            case 'Ingeniería Industrial':
                jefeNombre = EMAIL_INDUSTRIAL;
                passJefe = PASS_INDUSTRIAL;
                break;

            case 'Ingeniería Electromecánica':
                jefeNombre = EMAIL_ELECTROMECANICA;
                passJefe = PASS_ELECTROMECANICA;
                break;

            case 'Ingeniería Informática':
                jefeNombre = EMAIL_INFORMATICA;
                passJefe = PASS_INFORMATICA;
                break;

            case 'Ingeniería Electrónica':
                jefeNombre = EMAIL_ELECTRONICA;
                passJefe = PASS_ELECTRONICA;
                break;

            case 'Ingeniería en Administración':
                jefeNombre = EMAIL_ADMINISTRACION;
                passJefe = PASS_ADMINISTRACION;
                break;

            default:
                jefeNombre = 'Jefe/a de Carrera';
                passJefe = '';
                break;
        }

        if (alumno.casoEsta === 'Aceptado por la jefa de carrera') {
            nuevoEstado = 'Aceptado por la Secretaría del comité académico';
            nuevoMotivo = 'Aceptado por la Secretaría del comité académico';
            asuntoCorreo = 'Tu solicitud ha sido aceptada por la Secretaría del comité académico';
        } else if (alumno.casoEsta === 'Aceptado por la Secretaría del comité académico') {
            nuevoEstado = 'Aceptado por el comité académico';
            nuevoMotivo = 'Aceptado por el comité académico';
            asuntoCorreo = 'Tu solicitud ha sido aceptada por el comité académico';
        } else {
            return res.status(400).json({ message: 'El estado del caso no permite esta acción' });
        }

        alumno.casoEsta = nuevoEstado;
        alumno.motivoComi = nuevoMotivo;

        await alumno.save();

        // Envía correo electrónico de notificación de aceptación
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: jefeNombre,
                pass: passJefe,
            },
        });

        const mailOptions = {
            from: jefeNombre,
            to: alumno.correo,
            subject: 'Comité académico TESCHA',
            text: `Hola ${alumno.nombreCom},\n\n${asuntoCorreo}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json(alumno);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
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
            case 'Ingeniería en Sistemas Computacionales':
                jefeNombre = EMAIL_SISTEMAS;
                passJefe = PASS_SISTEMAS;
                break;

            case 'Ingeniería Industrial':
                jefeNombre = EMAIL_INDUSTRIAL;
                passJefe = PASS_INDUSTRIAL;
                break;

            case 'Ingeniería Electromecánica':
                jefeNombre = EMAIL_ELECTROMECANICA;
                passJefe = PASS_ELECTROMECANICA;
                break;

            case 'Ingeniería Informática':
                jefeNombre = EMAIL_INFORMATICA;
                passJefe = PASS_INFORMATICA;
                break;

            case 'Ingeniería Electrónica':
                jefeNombre = EMAIL_ELECTRONICA;
                passJefe = PASS_ELECTRONICA;
                break;

            case 'Ingeniería en Administración':
                jefeNombre = EMAIL_ADMINISTRACION;
                passJefe = PASS_ADMINISTRACION;
                break;

            default:
                jefeNombre = 'Jefe/a de Carrera';
                passJefe = '';
                break;
        }

        if (alumno.casoEsta === 'Aceptado por la jefa de carrera') {
            nuevoEstado = 'Rechazado por la Secretaría del comité académico';
            nuevoMotivo = motivoRechazo || 'Motivo no especificado';
            asuntoCorreo = 'Solicitud Rechazada por la Secretaría del comité académico';
        } else if (alumno.casoEsta === 'Aceptado por la Secretaría del comité académico') {
            nuevoEstado = 'Rechazado por el comité académico';
            nuevoMotivo = motivoRechazo || 'Motivo no especificado';
            asuntoCorreo = 'Solicitud Rechazada por el comité académico';
        } else {
            return res.status(400).json({ message: 'El estado del caso no permite esta acción' });
        }

        alumno.casoEsta = nuevoEstado;
        alumno.motivoComi = nuevoMotivo;

        await alumno.save();

        // Envía correo electrónico de notificación de rechazo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: jefeNombre,
                pass: passJefe,
            },
        });

        const mailOptions = {
            from: jefeNombre,
            to: alumno.correo,
            subject: 'Comité académico TESCHA',
            text: `Hola ${alumno.nombreCom},\n\n${asuntoCorreo}. El motivo es: ${nuevoMotivo}.\n\nPonte en contacto con el comité académico para más información.\n\nSaludos, ${jefeNombre}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json(alumno);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
        console.error(error);
    }
};

//Metodo para obtener el historial de la secretaria
secreCtrl.getHistorialSecre = async (req, res) => {
    try {
        // Buscar alumnos en la colección Comite con los estados especificados
        const alumnos = await Comite.find({
            $or: [
                { casoEsta: 'Aceptado por el comité académico' },
                { casoEsta: 'Rechazado por el comité académico' },
                { casoEsta: 'Rechazado por la Secretaría del comité académico' },
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
        console.error('Error al obtener el historial de casos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

//Metodo para obtener los alumnos aceptados
secreCtrl.getAlumnosAceptadosComite = async (req, res) => {
    try {
        // Obtener todos los alumnos de la base de datos cuyo casoEsta sea igual a "AceptadoJefes"
        const alumnos = await Comite.find({ casoEsta: Estados.ACEPTADO_COMITE });

        // Obtener todos los reciclajes de la base de datos cuyo casoEsta sea igual a "AceptadoJefes"
        const reciclajes = await Reciclaje.find({ casoEsta: Estados.ACEPTADO_COMITE });

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
            return res.status(404).json({ message: 'No se encontraron alumnos con estado "AceptadoJefes".' });
        }

        res.status(200).json(alumnosConEvidencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los alumnos.' });
    }
};

module.exports = secreCtrl;
module.exports.fileUploadMiddleware = fileUpload;
