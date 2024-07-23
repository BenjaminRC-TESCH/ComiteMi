const actaCtrl = {};
const Acta = require('../../models/Acta.js');
const User = require('../../models/User');
const { Comite, Reciclaje } = require('../../models/Comites.js');
const Roles = require('../../models/Roles.js');
const fs = require('fs');
const Alumno = require('../../models/Students.js');

const PASS_COMI = process.env.PASS_COMI;
const EMAIL_COMI = process.env.EMAIL_COMI;
const path = require('path');
const nodemailer = require('nodemailer');

const { Estados, Subject } = require('../../config/statuses');
const templatesDir = path.resolve(__dirname, '../../templates'); //Exporta los templates para el envio de correos

//Metodo para convertir a ordinales
const convertToWords = (number) => {
    if (number < 1 || number > 100) {
        return 'Número fuera del rango admitido';
    }

    const units = ['', 'PRIMERA', 'SEGUNDA', 'TERCERA', 'CUARTA', 'QUINTA', 'SEXTA', 'SEPTIMA', 'OCTAVA', 'NOVENA'];
    const tens = [
        '',
        'DÉCIMA',
        'VIGÉSIMA',
        'TRIGÉSIMA',
        'CUADRAGÉSIMA',
        'QUINCUAGÉSIMA',
        'SEXAGÉSIMA',
        'SEPTUAGÉSIMA',
        'OCTOGÉSIMA',
        'NONAGÉSIMA',
    ];

    if (number < 10) {
        return units[number];
    } else if (number % 10 === 0) {
        return tens[Math.floor(number / 10)];
    } else {
        return tens[Math.floor(number / 10)] + ' ' + units[number % 10];
    }
};

//Metodo para convertir a numeros romanos
const convertToRoman = (number) => {
    const romanNumerals = [
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
        'X',
        'XI',
        'XII',
        'XIII',
        'XIV',
        'XV',
        'XVI',
        'XVII',
        'XVIII',
        'XIX',
        'XX',
        'XXI',
        'XXII',
        'XXIII',
        'XXIV',
        'XXV',
        'XXVI',
        'XXVII',
        'XXVIII',
        'XXIX',
        'XXX',
        'XXXI',
        'XXXII',
        'XXXIII',
        'XXXIV',
        'XXXV',
        'XXXVI',
        'XXXVII',
        'XXXVIII',
        'XXXIX',
        'XL',
        'XLI',
        'XLII',
        'XLIII',
        'XLIV',
        'XLV',
        'XLVI',
        'XLVII',
        'XLVIII',
        'XLIX',
        'L',
        'LI',
        'LII',
        'LIII',
        'LIV',
        'LV',
        'LVI',
        'LVII',
        'LVIII',
        'LIX',
        'LX',
        'LXI',
        'LXII',
        'LXIII',
        'LXIV',
        'LXV',
        'LXVI',
        'LXVII',
        'LXVIII',
        'LXIX',
        'LXX',
        'LXXI',
        'LXXII',
        'LXXIII',
        'LXXIV',
        'LXXV',
        'LXXVI',
        'LXXVII',
        'LXXVIII',
        'LXXIX',
        'LXXX',
        'LXXXI',
        'LXXXII',
        'LXXXIII',
        'LXXXIV',
        'LXXXV',
        'LXXXVI',
        'LXXXVII',
        'LXXXVIII',
        'LXXXIX',
        'XC',
        'XCI',
        'XCII',
        'XCIII',
        'XCIV',
        'XCV',
        'XCVI',
        'XCVII',
        'XCVIII',
        'XCIX',
        'C',
    ];
    if (number < 1 || number > 100) {
        return 'Número fuera del rango admitido';
    }
    return romanNumerals[number - 1];
};

//Metodo para obtener la ultima acta y mandar el siguiente numero al front
actaCtrl.conversor = async (req, res) => {
    try {
        const lastActa = await Acta.findOne().sort({ number: -1 });

        let number;
        if (!lastActa) {
            number = 74; // Si no hay actas en la base de datos, empezar desde 74
        } else {
            number = lastActa.number + 1; // El siguiente número después del último registrado
        }

        const words = convertToWords(number);
        const roman = convertToRoman(number);
        res.status(200).json({ number, words, roman });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

//Metodo para insertar nueva acta
actaCtrl.Act = async (req, res) => {
    try {
        const { token } = req.body;

        // Decodificar el token
        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const idAlumno = tokenDecoded._id;

        // Verificar si se ha subido un archivo
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha proporcionado un archivo de evidencia.' });
        }

        // Leer el contenido del archivo PDF
        const evidenciaData = fs.readFileSync(req.file.path);
        const evidenciaContentType = req.file.mimetype;

        // Cambiar el tamaño del Buffer de la evidencia si es necesario (opcional)
        // Aquí puedes ajustar el tamaño del Buffer según tus necesidades
        const nuevoTamaño = 10 * 1024 * 1024; // 1 MB en bytes
        const evidenciaDataAjustada = Buffer.alloc(nuevoTamaño);
        evidenciaData.copy(evidenciaDataAjustada);

        const lastActa = await Acta.findOne().sort({ number: -1 });

        let newNumber;
        if (!lastActa) {
            newNumber = 74; // Si no hay actas en la base de datos, empezar desde 74
        } else {
            newNumber = lastActa.number + 1; // El siguiente número después del último registrado
        }

        // Crear el acta con la evidencia como un buffer
        const newActa = new Acta({
            number: newNumber,
            evidencia: { data: evidenciaDataAjustada, contentType: evidenciaContentType },
        });

        await newActa.save();

        // Eliminar el archivo temporal después de leer su contenido (opcional)
        fs.unlinkSync(req.file.path);

        res.status(200).json({ number: newActa.number });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Metodo para obtener los participantes (Excepcion al administrador)
actaCtrl.getPart = async (req, res) => {
    try {
        const users = await User.find({}, 'name email roles');

        const filteredUsers = users.filter((user) => !user.roles.includes('1000'));

        const allRoles = await Roles.find({}, 'id_rol nombreRol');

        const rolesMap = {};
        allRoles.forEach((role) => {
            rolesMap[role.id_rol] = role.nombreRol;
        });

        const usersWithRoles = filteredUsers.map((user) => {
            const userRoles = user.roles.map((roleId) => rolesMap[roleId]);
            return {
                name: user.name,
                email: user.email,
                roles: userRoles,
            };
        });

        res.status(200).json(usersWithRoles);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
        console.error(error);
    }
};

//Metodo para obtener todas las actas
actaCtrl.getAllActas = async (req, res) => {
    try {
        const actas = await Acta.find({}, 'number');
        const actasWithOrdinals = actas.map((acta) => ({
            ...acta.toObject(),
            ordinal: convertToWords(acta.number),
        }));
        res.status(200).json(actasWithOrdinals);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las actas' });
    }
};

///Metodo para obtener los pdf de las actas
actaCtrl.getActaById = async (req, res) => {
    try {
        const acta = await Acta.findById(req.params.id);
        if (!acta) {
            return res.status(404).json({ message: 'Acta no encontrada' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.send(acta.evidencia.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el PDF' });
    }
};

//Metodo para actualizar el estado de los alumnos a Aceptados o rechazados por el comite cuando se genere el pdf
//Y para mandar correos a alumnos que han sido aceptados y para dar aviso a administrativos
actaCtrl.updateAlumnosAceptados = async (req, res) => {
    try {
        const { estadosAlumnos, asistentes, datosActa } = req.body;

        if (!estadosAlumnos || estadosAlumnos.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron estados válidos.' });
        }

        // Configurar el transporte de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_COMI,
                pass: PASS_COMI,
            },
        });

        // Cargar la plantilla de correo para la reunión desde el archivo
        const templateMeeting = path.join(templatesDir, 'email_meeting.html');
        const htmlMeeting = await fs.promises.readFile(templateMeeting, 'utf8');

        const filledMeetingTemplate = htmlMeeting
            .replace('{{numeroWord}}', datosActa.numeroWord)
            .replace('{{numeroRomano}}', datosActa.numeroRomano)
            .replace('{{tipoSesion}}', datosActa.tipoSesion)
            .replace('{{dia}}', datosActa.dia)
            .replace('{{mes}}', datosActa.mes)
            .replace('{{anio}}', datosActa.anio)
            .replace('{{hora}}', datosActa.hora)
            .replace('{{minutos}}', datosActa.minutos);

        // Enviar correos a los asistentes
        if (asistentes && asistentes.length > 0) {
            for (const asistente of asistentes) {
                const mailPart = {
                    from: EMAIL_COMI,
                    to: asistente.email,
                    subject: Subject.SUBJECT_COMITE_MEETING,
                    html: filledMeetingTemplate,
                };

                await transporter.sendMail(mailPart);
            }
        }

        // Iterar sobre cada estado recibido para los alumnos
        for (const estado of estadosAlumnos) {
            const { id, Estado } = estado;

            // Buscar el correo del alumno por su ID
            const alumno = await Comite.findById(id);
            if (!alumno) {
                console.warn(`No se encontró un alumno con el ID ${id}`);
                continue;
            }

            let templatePath;
            let subjectMail;

            // Seleccionar la plantilla y el asunto según el estado
            if (Estado === '1') {
                templatePath = path.join(templatesDir, 'email_comite_comi_accepted.html');
                subjectMail = Subject.SUBJECT_COMITE_ACCEPTED;
            } else if (Estado === '0') {
                templatePath = path.join(templatesDir, 'email_comite_comi_rejected.html');
                subjectMail = Subject.SUBJECT_COMITE_REJECTED; // Asegúrate de tener un mensaje para rechazo
            } else {
                console.warn(`Estado inválido recibido para el alumno con ID ${id}: ${Estado}`);
                continue;
            }

            // Cargar la plantilla de correo desde el archivo
            const htmlTemplate = await fs.promises.readFile(templatePath, 'utf8');

            // Reemplazar placeholders en la plantilla
            const filledTemplate = htmlTemplate.replace('{{nombre}}', alumno.nombreCom);

            // Enviar correo al alumno
            const mailAlum = {
                from: EMAIL_COMI,
                to: alumno.correo,
                subject: subjectMail,
                html: filledTemplate, // Usar el contenido HTML rellenado
            };

            await transporter.sendMail(mailAlum);

            // Actualizar el estado del alumno en la base de datos
            const nuevoEstado = Estado === '1' ? Estados.ACEPTADO_COMITE : Estados.RECHAZADO_COMITE;
            await Comite.findOneAndUpdate({ _id: id }, { casoEsta: nuevoEstado }, { new: true });
            await Reciclaje.findOneAndUpdate({ _id: id }, { casoEsta: nuevoEstado }, { new: true });
        }

        res.status(200).json({ message: 'Estados actualizados exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar estados:', error);
        res.status(500).json({ message: 'Error al actualizar estados de los alumnos.' });
    }
};

module.exports = actaCtrl;
