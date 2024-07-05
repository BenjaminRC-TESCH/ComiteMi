const actaCtrl = {};
const Acta = require('../../models/Acta.js');
const User = require('../../models/User');
const Roles = require('../../models/Roles.js');
const fs = require('fs');

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
        const users = await User.find({}, 'name roles');

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

module.exports = actaCtrl;
