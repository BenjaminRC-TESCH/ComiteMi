const studentCtrl = {};
const Student = require('../../models/Students');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Comite, Reciclaje } = require('../../models/Comites');
const Casos = require('../../models/Casos');
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const mongoose = require('mongoose');
const { createSolutionBuilderWithWatch } = require('typescript');
const unlinkAsync = require('util').promisify(fs.unlink);
const path = require('path');

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

const { Carreras, Subject, Students_Messages } = require('../../config/statuses');

const templatesDir = path.resolve(__dirname, '../../templates'); //Exporta los templates para el envio de correos

//Metodo para crear el comite del alumno
studentCtrl.createComite = async (req, res) => {
    try {
        const { telefono, casoEsta, direccion, casoTipo, semestre, motivosAca, motivosPer, motivoComi, token } = req.body;

        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

        const idAlumno = tokenDecoded._id;

        //console.log(idAlumno);

        // Buscar al estudiante en la base de datos usando el idAlumno
        const student = await Student.findById(idAlumno).exec();

        if (!student) {
            return res.status(404).json({ message: Students_Messages.STUDENT_NOT_FOUND });
        }

        // Guardar la información del estudiante
        const { nombre, aPaterno, aMaterno, matricula, carrera, correo } = student;

        //console.log(nombre, aPaterno, aMaterno, matricula, carrera, correo);

        let jefeNombre, passJefe;

        switch (carrera) {
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

        // Verificar si se ha subido un archivo
        if (!req.file) {
            return res.status(400).json({ message: Students_Messages.EVIDENCE_NOT_FOUND });
        }

        // Leer el contenido del archivo PDF
        const evidenciaData = fs.readFileSync(req.file.path);
        const evidenciaContentType = req.file.mimetype;

        // Cambiar el tamaño del Buffer de la evidencia si es necesario (opcional)
        // Aquí puedes ajustar el tamaño del Buffer según tus necesidades
        const nuevoTamaño = 10 * 1024 * 1024; // 1 MB en bytes
        const evidenciaDataAjustada = Buffer.alloc(nuevoTamaño);
        evidenciaData.copy(evidenciaDataAjustada);

        // Crear el alumno con la evidencia como un buffer
        const newAlumno = await Comite.create({
            matricula,
            nombreCom: nombre + ' ' + aPaterno + ' ' + aMaterno,
            telefono,
            casoEsta,
            direccion,
            carrera,
            casoTipo,
            semestre,
            correo,
            motivosAca,
            motivosPer,
            evidencia: { data: evidenciaDataAjustada, contentType: evidenciaContentType },
            motivoComi: '', // Agrega un campo vacío para el motivo de rechazo
            idAlumno,
        });

        // Eliminar el archivo temporal después de leer su contenido (opcional)
        fs.unlinkSync(req.file.path);

        // Cargar la plantilla de correo desde el archivo
        const templatePath = path.join(templatesDir, 'email_comite_student.html');
        const html = await fs.promises.readFile(templatePath, 'utf8');

        // Configuración del transporte para nodemailer (ajustar según tu proveedor de correo)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: jefeNombre, // Cambia esto por tu correo electrónico
                pass: passJefe, // Cambia esto por tu contraseña
            },
        });

        // Reemplazar variables en la plantilla con los datos del estudiante
        const filledTemplate = html.replace('{{nombre}}', nombre).replace('{{aPaterno}}', aPaterno).replace('{{aMaterno}}', aMaterno);

        // Contenido del correo electrónico
        const mailOptions = {
            from: jefeNombre, // Cambia esto por tu correo electrónico
            to: correo,
            subject: Subject.SUBJECT_REQUEST_RECEIVED,
            html: filledTemplate,
        };

        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);

        res.status(201).json(newAlumno);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: Students_Messages.ERROR_CREATING_STUDENT });
    }
};

//Metodo para obtener el historial de comite segun el id del alumno
studentCtrl.getComiteStudent = async (req, res) => {
    try {
        const { id } = req.params; //Recibe token

        //decodificacion del token
        const tokenDecoded = JSON.parse(Buffer.from(id.split('.')[1], 'base64').toString());

        const idAlumnoDecoded = tokenDecoded._id;

        //console.log('Este es el token:' + idAlumnoDecoded);

        const alumnos = await Comite.find({ idAlumno: idAlumnoDecoded });

        // Verificar si se encontraron alumnos para esa carrera
        if (alumnos.length === 0) {
            return res.status(404).json({ message: Students_Messages.NO_STUDENTS_FOUND });
        }

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
                    url: `${req.protocol}://${req.get('host')}/api/alumnos/${alumno._id}/pdf`,
                    fileName: `evidencia_${alumno._id}.pdf`,
                    contentType: alumno.contentType,
                },
                motivoComi: alumno.motivoComi,
            };
        });

        // Ordenar los alumnos por nombreCom (nombre completo) de forma ascendente
        alumnosConEvidencia.sort((a, b) => a.nombreCom.localeCompare(b.nombreCom));

        res.status(200).json(alumnosConEvidencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: Students_Messages.ERROR_OBTAINING_STUDENTS });
    }
};

studentCtrl.getPdfStudent = async (req, res) => {
    try {
        const alumno = await Comite.findById(req.params.id);

        // Verificar si el alumno existe
        if (!alumno) {
            return res.status(404).json({ message: Students_Messages.ALUMNO_NOT_FOUND });
        }

        // Verificar si hay evidencia adjunta
        if (!alumno.evidencia || !alumno.evidencia.data) {
            return res.status(404).json({ message: Students_Messages.NO_EVIDENCE_FOUND });
        }

        // Establecer encabezados para indicar que se está enviando un archivo PDF
        res.setHeader('Content-Type', 'application/pdf');

        // Enviar el archivo PDF como respuesta
        res.send(alumno.evidencia.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: Students_Messages.ERROR_OBTAINING_PDF });
    }
};

//este sera el componente para el perfil del alumno
studentCtrl.getStudentProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const tokenDecoded = JSON.parse(Buffer.from(id.split('.')[1], 'base64').toString());

        const idAlumnoDecoded = tokenDecoded._id;

        const student = await Student.findById(idAlumnoDecoded).exec();

        if (!student) {
            return res.status(404).json({ message: Students_Messages.STUDENT_NOT_FOUND });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error(Students_Messages.ERROR_OBTAINING_PROFILE, error);
        res.status(500).json({ message: Students_Messages.ERROR_OBTAINING_PROFILE });
    }
};

//Metodo para actualizar el usuario
studentCtrl.updateStudentProfile = async (req, res) => {
    try {
        const { token, password, nombre, aPaterno, aMaterno, matricula, carrera } = req.body;

        // Decodificar el token para obtener el ID del alumno
        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const idAlumnoDecoded = tokenDecoded._id;

        // Buscar el estudiante en la base de datos
        const student = await Student.findById(idAlumnoDecoded);
        if (!student) {
            return res.status(404).json({ message: Students_Messages.STUDENT_NOT_FOUND });
        }

        // Verificar si han pasado 30 días desde la última actualización
        const lastUpdate = new Date(student.updatedAt);
        const now = new Date();
        const daysDifference = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

        if (daysDifference < 30) {
            return res.status(400).json({ message: Students_Messages.UPDATE_NOT_ALLOWED });
        }

        // Expresión regular para validar que el nombre y apellidos contengan solo letras
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
        if (!nameRegex.test(nombre)) {
            return res.status(400).json({ message: Students_Messages.INVALID_NAME });
        }

        if (!nameRegex.test(aPaterno)) {
            return res.status(400).json({ message: Students_Messages.INVALID_PATERNAL_SURNAME });
        }

        if (!nameRegex.test(aMaterno)) {
            return res.status(400).json({ message: Students_Messages.INVALID_MATERNAL_SURNAME });
        }

        const parsedMatricula = parseInt(matricula, 10);
        if (isNaN(parsedMatricula) || parsedMatricula.toString().length !== 9) {
            return res.status(400).json({ message: Students_Messages.INVALID_MATRICULA });
        }

        // Verificar longitud y caracteres especiales de la contraseña
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,12})/;
        if (password && !passwordRegex.test(password)) {
            return res.status(400).json({
                message: Students_Messages.INVALID_PASSWORD,
            });
        }

        // Crear objeto de actualización del usuario
        let updateStudent = {
            nombre,
            aPaterno,
            aMaterno,
            matricula,
            carrera,
        };

        // Si la contraseña está presente y cumple con los requisitos, encriptarla
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateStudent.password = hashedPassword;
        }

        // Actualizar el estudiante en la base de datos
        const updatedStudent = await Student.findByIdAndUpdate(idAlumnoDecoded, updateStudent, { new: true });

        // Enviar la respuesta con el estudiante actualizado
        res.status(200).json(updatedStudent);
    } catch (error) {
        console.error(Students_Messages.ERROR_UPDATING_PROFILE, error);
        res.status(500).json({ message: Students_Messages.ERROR_UPDATING_PROFILE });
    }
};

studentCtrl.getCasos = async (req, res) => {
    try {
        const casos = await Casos.find();
        res.status(200).json(casos);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' + error });
    }
};

module.exports = studentCtrl;
