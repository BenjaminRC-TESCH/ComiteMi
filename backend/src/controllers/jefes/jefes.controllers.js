const alumnoCtrl = {};
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

//Importa archivo de constantes
const { Estados, Carreras, IdRoles, Jefes_Mensajes, Subject } = require('../../config/statuses');

const templatesDir = path.resolve(__dirname, '../../templates'); //Exporta los templates para el envio de correos

// Utilizamos promisify para convertir fs.unlink en una función que devuelve una promesa
const unlinkAsync = require('util').promisify(fs.unlink);

//Metodo para mostrar el compendio de casos segun la carrera(jefes)
alumnoCtrl.getAlumnosJefes = async (req, res) => {
    try {
        // Obtener el nombre de la carrera desde los parámetros de la solicitud
        const { token } = req.params;

        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const idCarreraDecoded = tokenDecoded.rol;
        const idCarrera = Array.isArray(idCarreraDecoded) ? idCarreraDecoded[0] : idCarreraDecoded;

        let carrera;

        // Determinar la carrera basada en el rol del usuario
        switch (idCarrera) {
            case IdRoles.ID_ROL_ELECTROMECANICA:
                carrera = Carreras.INGENIERIA_ELECTROMECANICA;
                break;
            case IdRoles.ID_ROL_INDUSTRIAL:
                carrera = Carreras.INGENIERIA_INDUSTRIAL;
                break;
            case IdRoles.ID_ROL_SISTEMAS: //Ingeniería en Sistemas Computacionales
                carrera = Carreras.INGENIERIA_SISTEMAS;
                break;
            case IdRoles.ID_ROL_ELECTRONICA:
                carrera = Carreras.INGENIERIA_ELECTRONICA;
                break;
            case IdRoles.ID_ROL_INFORMATICA:
                carrera = Carreras.INGENIERIA_INFORMATICA;
                break;
            case IdRoles.ID_ROL_ADMINISTRACION:
                carrera = Carreras.INGENIERIA_ADMINISTRACION;
                break;
            default:
                carrera = 'N/A';
        }

        const alumnos = await Comite.find({
            carrera,
            casoEsta: Estados.PENDIENTE,
        });

        if (alumnos.length === 0) {
            return res.status(404).json({ message: Jefes_Mensajes.ERROR_OBTAINING_STUDENTS });
        }

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
                    url: `${req.protocol}://${req.get('host')}/api/alumnos/${alumno._id}/pdf`,
                    fileName: `evidencia_${alumno._id}.pdf`,
                    contentType: alumno.contentType,
                },
                motivoComi: alumno.motivoComi,
            };
        });

        alumnosConEvidencia.sort((a, b) => a.nombreCom.localeCompare(b.nombreCom));

        res.status(200).json(alumnosConEvidencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: Jefes_Mensajes.ERROR_OBTAINING_STUDENTS });
    }
};

//Metodo para aceptar el caso( por los jefes)
alumnoCtrl.aceptarSolicitudJefe = async (req, res) => {
    try {
        const { id } = req.params;

        const alumno = await Comite.findById(id);

        if (!alumno) {
            return res.status(404).json({ message: Jefes_Mensajes.STUDENT_NOT_FOUND });
        }

        if (alumno.casoEsta === Estados.ACEPTADO_JEFA_CARRERA) {
            return res.status(400).json({ message: Jefes_Mensajes.ERROR_REV_SECRE });
        }

        if (alumno.casoEsta === Estados.RECHAZADO_JEFA_CARRERA) {
            return res.status(400).json({ message: Jefes_Mensajes.ERROR_REJECTED_JEFE });
        }

        let jefeNombre, passJefe;

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
                break;
        }

        alumno.casoEsta = Estados.ACEPTADO_JEFA_CARRERA;
        alumno.motivoComi = Estados.ACEPTADO_JEFA_CARRERA;
        await alumno.save();

        // Cargar la plantilla de correo desde el archivo
        const templatePath = path.join(templatesDir, 'email_comite_jefe__accepted.html');
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
        res.status(500).json({ message: 'Server error' });
        console.error(error);
    }
};

//Metodo para rechazar caso por el jefe de carrera
alumnoCtrl.rechazarSolicitudJefe = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivoRechazo } = req.body;

        const alumno = await Comite.findById(id);

        if (alumno.casoEsta === Estados.ACEPTADO_JEFA_CARRERA) {
            return res.status(400).json({ message: Jefes_Mensajes.ERROR_REV_SECRE });
        }

        if (alumno.casoEsta === Estados.RECHAZADO_JEFA_CARRERA) {
            return res.status(400).json({ message: Jefes_Mensajes.ERROR_REJECTED_JEFE });
        }

        if (!alumno) {
            return res.status(404).json(`Alumno with id ${id} not found`);
        }

        let jefeNombre, passJefe;

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
                break;
        }

        // Actualizar el estado del caso y el motivo de rechazo
        alumno.casoEsta = Estados.RECHAZADO_JEFA_CARRERA;
        alumno.motivoComi = motivoRechazo || 'Motivo no especificado';
        await alumno.save();

        // Cargar la plantilla de correo desde el archivo
        const templatePath = path.join(templatesDir, 'email_comite_jefe__rejected.html');
        const html = await fs.promises.readFile(templatePath, 'utf8');

        // Envía correo electrónico de notificación de rechazo
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
        res.status(500).json({ message: 'Server error' });
        console.error(error);
    }
};

// Método para mover el caso a la papelera según el id del alumno (jefes)
alumnoCtrl.moverReciclajeJefe = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener la información del alumno antes de moverlo a reciclaje
        const alumnoExistente = await Comite.findById(id);

        if (alumnoExistente.casoEsta === Estados.ACEPTADO_JEFA_CARRERA) {
            return res.status(400).json({ message: Jefes_Mensajes.ERROR_REV_SECRE });
        }

        if (alumnoExistente.casoEsta === Estados.RECHAZADO_JEFA_CARRERA) {
            return res.status(400).json({ message: Jefes_Mensajes.ERROR_REJECTED_JEFE });
        }

        // Verificar si el alumno existe
        if (!alumnoExistente) {
            return res.status(404).json({ message: Jefes_Mensajes.STUDENT_NOT_FOUND });
        }

        // Crear un nuevo documento en la colección de reciclaje con los datos del alumno
        const alumnoReciclado = await Reciclaje.create(alumnoExistente.toObject());

        // Eliminar el alumno de la colección principal
        await Comite.findByIdAndDelete(id);

        res.status(200).json({ message: 'Alumno movido a reciclaje', data: alumnoReciclado });
    } catch (error) {
        console.error('Error moviendo alumno a reciclaje:', error);
        res.status(500).json({ message: 'Error del servidor', error });
    }
};

//Metodo para mostrar la papelera de reciclaje segun la carrera(jefes)
alumnoCtrl.getReciclajefe = async (req, res) => {
    try {
        // Obtener el nombre de la carrera desde los parámetros de la solicitud
        const { token } = req.params;

        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const idCarreraDecoded = tokenDecoded.rol;
        const idCarrera = Array.isArray(idCarreraDecoded) ? idCarreraDecoded[0] : idCarreraDecoded;
        console.log(idCarrera);

        let carrera;

        switch (idCarrera) {
            case '1000':
                carrera = 'Administrador';
                break;
            case '1001':
                carrera = 'Secretaría de Comité';
                break;
            case IdRoles.ID_ROL_ELECTROMECANICA:
                carrera = Carreras.INGENIERIA_ELECTROMECANICA;
                break;
            case IdRoles.ID_ROL_INDUSTRIAL:
                carrera = Carreras.INGENIERIA_INDUSTRIAL;
                break;
            case IdRoles.ID_ROL_SISTEMAS:
                carrera = Carreras.INGENIERIA_SISTEMAS;
                break;
            case IdRoles.ID_ROL_ELECTRONICA:
                carrera = Carreras.INGENIERIA_ELECTRONICA;
                break;
            case IdRoles.ID_ROL_INFORMATICA:
                carrera = Carreras.INGENIERIA_INFORMATICA;
                break;
            case IdRoles.ID_ROL_ADMINISTRACION:
                carrera = Carreras.INGENIERIA_ADMINISTRACION;
                break;
            default:
                carrera = 'N/A';
        }

        // Buscar todos los reciclajes de la base de datos que pertenecen a la carrera especificada
        const reciclajes = await Reciclaje.find({ carrera });

        // Verificar si se encontraron reciclajes para esa carrera
        if (reciclajes.length === 0) {
            return res.status(404).json({ message: Jefes_Mensajes.ERROR_OBTAINING_CARRERA });
        }

        // Mapear los reciclajes para ajustar la respuesta
        const reciclajesConEvidencia = reciclajes.map((reciclaje) => {
            return {
                _id: reciclaje._id,
                matricula: reciclaje.matricula,
                nombreCom: reciclaje.nombreCom,
                telefono: reciclaje.telefono,
                casoEsta: reciclaje.casoEsta,
                direccion: reciclaje.direccion,
                carrera: reciclaje.carrera,
                casoTipo: reciclaje.casoTipo,
                semestre: reciclaje.semestre,
                correo: reciclaje.correo,
                motivosAca: reciclaje.motivosAca,
                motivosPer: reciclaje.motivosPer,
                evidencia: {
                    url: `${req.protocol}://${req.get('host')}/api/alumnos/${reciclaje._id}/pdf`, // Ruta para ver el PDF del alumno
                    fileName: `evidencia_${reciclaje._id}.pdf`, // Nombre del archivo
                    contentType: reciclaje.contentType, // Tipo de contenido
                },
                motivoComi: reciclaje.motivoComi,
                updatedAt: reciclaje.updatedAt,
            };
        });

        // Ordenar los reciclajes por algún criterio si es necesario
        // reciclajesConEvidencia.sort((a, b) => a.fecha - b.fecha); // Ejemplo de ordenación por fecha

        res.status(200).json(reciclajesConEvidencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: Jefes_Mensajes.ERROR_OBTAINING_RECYCLING });
    }
};

//Metodo para restaurar de papelera a compendio de casos segun el id del alumno(jefes)
alumnoCtrl.restaurarReciclaJefe = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el ID es null o no es un ObjectId válido
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID provided' });
        }

        // Obtener la información del alumno antes de restaurarlo desde reciclaje
        const alumnoReciclado = await Reciclaje.findById(id);

        // Verificar si el alumno existe en reciclaje
        if (!alumnoReciclado) {
            return res.status(404).json({ message: Jefes_Mensajes.STUDENT_NOT_FOUND });
        }

        // Obtener el nombre del archivo
        const evidencia = alumnoReciclado.evidencia;

        // No mover ni copiar el archivo, mantenerlo en la carpeta uploads
        // Puedes agregar aquí lógica adicional si es necesario

        // Eliminar el alumno de la colección de reciclaje
        await Reciclaje.findByIdAndDelete(id);

        // Crear un nuevo documento en la colección de Alumno con los datos del alumno reciclado
        const alumnoRestaurado = await Comite.create(alumnoReciclado.toObject());

        res.status(200).json(alumnoRestaurado);
    } catch (error) {
        res.status(500).json({ message: Jefes_Mensajes.SERVER_ERROR, error });
        console.error(error);
    }
};

//Ruta par eliminar algun caso de la papelera por el id del alumno(jefes)
alumnoCtrl.deleteReciclajeJefe = async (req, res) => {
    try {
        const alumnoId = req.params.id; // Suponiendo que recibes el ID del alumno a eliminar como parámetro en la URL

        // Verificar si el alumno existe
        const alumno = await Reciclaje.findById(alumnoId);
        if (!alumno) {
            return res.status(404).json({ message: Jefes_Mensajes.STUDENT_NOT_FOUND });
        }

        // Eliminar el alumno de la base de datos
        await Reciclaje.findByIdAndDelete(alumnoId);

        // Envía una respuesta de éxito
        res.status(200).json({ message: Jefes_Mensajes.DELETE_STUDENT });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: Jefes_Mensajes.SERVER_ERROR });
    }
};

//Metodo para ver el historial de casos
alumnoCtrl.historialJefe = async (req, res) => {
    try {
        // Obtener el nombre de la carrera desde los parámetros de la solicitud
        const { token } = req.params;

        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const idCarreraDecoded = tokenDecoded.rol;
        const idCarrera = Array.isArray(idCarreraDecoded) ? idCarreraDecoded[0] : idCarreraDecoded;
        console.log(idCarrera);

        let carrera;

        switch (idCarrera) {
            case IdRoles.ID_ROL_ELECTROMECANICA:
                carrera = Carreras.INGENIERIA_ELECTROMECANICA;
                break;
            case IdRoles.ID_ROL_INDUSTRIAL:
                carrera = Carreras.INGENIERIA_INDUSTRIAL;
                break;
            case IdRoles.ID_ROL_SISTEMAS:
                carrera = Carreras.INGENIERIA_SISTEMAS;
                break;
            case IdRoles.ID_ROL_ELECTRONICA:
                carrera = Carreras.INGENIERIA_ELECTRONICA;
                break;
            case IdRoles.ID_ROL_INFORMATICA:
                carrera = Carreras.INGENIERIA_INFORMATICA;
                break;
            case IdRoles.ID_ROL_ADMINISTRACION:
                carrera = Carreras.INGENIERIA_ADMINISTRACION;
                break;
            default:
                carrera = 'N/A';
        }

        // Definir los estados aceptados
        const estadosAceptados = [
            Estados.ACEPTADO_COMITE,
            Estados.RECHAZADO_COMITE,
            Estados.RECHAZADO_SECRETARIA,
            Estados.ACEPTADO_SECRETARIA,
        ];

        // Obtener todos los alumnos de la base de datos cuyo casoEsta esté en los estados aceptados y carrera seleccionada
        const alumnos = await Comite.find({
            casoEsta: { $in: estadosAceptados },
            carrera: carrera,
        });
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
                    url: `${req.protocol}://${req.get('host')}/api/alumnos/${alumno._id}/pdf`,
                    fileName: `evidencia_${alumno._id}.pdf`,
                    contentType: alumno.contentType,
                },
                motivoRechazo: alumno.motivoRechazo,
                rechazado: alumno.rechazado,
                pdfPath: `${req.protocol}://${req.get('host')}/api/alumnos/${alumno._id}/pdf`, // Agregar pdfPath
                updatedAt: alumno.updatedAt,
            };
        });

        res.status(200).json({ historialJefe: alumnosConEvidencia });
    } catch (error) {
        console.error(Jefes_Mensajes.ERROR_OBTAINING_JEFE_HISTORY, error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Metodo para obtener los alumnos aceptados
alumnoCtrl.getAlumnosAceptados = async (req, res) => {
    try {
        const { token } = req.params;

        // Decodificar el token para obtener el rol del usuario
        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const idCarreraDecoded = tokenDecoded.rol;
        const idCarrera = Array.isArray(idCarreraDecoded) ? idCarreraDecoded[0] : idCarreraDecoded;

        let carrera;

        // Determinar la carrera basada en el rol del usuario
        switch (idCarrera) {
            case IdRoles.ID_ROL_ELECTROMECANICA:
                carrera = Carreras.INGENIERIA_ELECTROMECANICA;
                break;
            case IdRoles.ID_ROL_INDUSTRIAL:
                carrera = Carreras.INGENIERIA_INDUSTRIAL;
                break;
            case IdRoles.ID_ROL_SISTEMAS: //Ingeniería en Sistemas Computacionales
                carrera = Carreras.INGENIERIA_SISTEMAS;
                break;
            case IdRoles.ID_ROL_ELECTRONICA:
                carrera = Carreras.INGENIERIA_ELECTRONICA;
                break;
            case IdRoles.ID_ROL_INFORMATICA:
                carrera = Carreras.INGENIERIA_INFORMATICA;
                break;
            case IdRoles.ID_ROL_ADMINISTRACION:
                carrera = Carreras.INGENIERIA_ADMINISTRACION;
                break;
            default:
                carrera = 'N/A';
        }

        // Definir los estados que queremos buscar
        const estadosBuscados = [Estados.ACEPTADO_JEFA_CARRERA, Estados.ACEPTADO_SECRETARIA, Estados.ACEPTADO_COMITE];

        // Buscar en la colección Comite
        const alumnos = await Comite.find({ carrera, casoEsta: { $in: estadosBuscados } });

        // Buscar en la colección Reciclaje
        const reciclajes = await Reciclaje.find({ casoEsta: { $in: estadosBuscados } });

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

        // Verificar si se encontraron alumnos con los estados especificados en alguna de las colecciones
        if (alumnosConEvidencia.length === 0) {
            return res.status(404).json({ message: 'No se encontraron alumnos con los estados especificados.' });
        }

        res.status(200).json(alumnosConEvidencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: Jefes_Mensajes.ERROR_OBTAINING_STUDENTS });
    }
};

/*************/
/*************/

//Metodo para obtener los alumno segun la matricula
alumnoCtrl.getAlumno = async (req, res) => {
    try {
        const { matricula } = req.params;
        const alumno = await Comite.findOne({ matricula: matricula });

        if (!alumno) {
            return res.status(404).json({ message: Jefes_Mensajes.STUDENT_NOT_FOUND });
        }

        res.status(200).json(alumno);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.error(error);
    }
};

//metodo para mostrar el pdf del caso segun el alumno(jefes)
alumnoCtrl.getAlumnoPdf = async (req, res) => {
    try {
        const alumno = await Comite.findById(req.params.id);

        // Verificar si el alumno existe
        if (!alumno) {
            return res.status(404).json({ message: Jefes_Mensajes.STUDENT_NOT_FOUND });
        }

        // Verificar si hay evidencia adjunta
        if (!alumno.evidencia || !alumno.evidencia.data) {
            return res.status(404).json({ message: Jefes_Mensajes.ERROR_OBTAINING_EVIDENCE });
        }

        // Establecer encabezados para indicar que se está enviando un archivo PDF
        res.setHeader('Content-Type', 'application/pdf');

        // Enviar el archivo PDF como respuesta
        res.send(alumno.evidencia.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el archivo PDF del alumno.' });
    }
};

module.exports = alumnoCtrl;
module.exports.fileUploadMiddleware = fileUpload;
