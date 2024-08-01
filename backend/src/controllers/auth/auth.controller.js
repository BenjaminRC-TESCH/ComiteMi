const authCtrl = {};
const passport = require('passport');
const User = require('../../models/User');
const Student = require('../../models/Students');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

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

const { Carreras, IdRoles, Subject, Auth_Messages, Auth_Routes } = require('../../config/statuses');

//const templatesDir = path.resolve(__dirname, '../../email_templates');
const templatesDir = path.resolve(__dirname, '../../templates'); //Exporta los templates para el envio de correos

//Registro para estudiantes
authCtrl.signupStudent = async (req, res) => {
    const { nombre, aPaterno, aMaterno, matricula, carrera, correo, password, confirmPassword } = req.body;

    if (!nombre || !aPaterno || !aMaterno || !matricula || !carrera || !correo || !password) {
        return res.status(400).json({ message: Auth_Messages.COMPLETE_FIELDS });
    }

    // Expresión regular para validar que el nombre y apellidos contengan solo letras
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    if (!nameRegex.test(nombre)) {
        return res.status(400).json({ message: Auth_Messages.INVALID_NAME });
    }

    if (!nameRegex.test(aPaterno)) {
        return res.status(400).json({ message: Auth_Messages.INVALID_PATERNAL_SURNAME });
    }

    if (!nameRegex.test(aMaterno)) {
        return res.status(400).json({ message: Auth_Messages.INVALID_MATERNAL_SURNAME });
    }

    const parsedMatricula = parseInt(matricula, 10);
    if (isNaN(parsedMatricula) || parsedMatricula.toString().length !== 9) {
        return res.status(400).json({ message: Auth_Messages.INVALID_MATRICULA });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@tesch\.edu\.mx$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ message: Auth_Messages.INVALID_EMAIL_DOMAIN });
    }

    if (confirmPassword != password) {
        return res.status(400).json({ message: Auth_Messages.PASSWORDS_NOT_MATCH });
    }

    // Verificar longitud y caracteres especiales de la contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,12})/;
    if (password && !passwordRegex.test(password)) {
        return res.status(400).json({
            message: Auth_Messages.INVALID_PASSWORD,
        });
    }

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

    try {
        const validateEmail = await Student.findOne({ correo: correo });
        if (validateEmail) {
            return res.status(409).json({ message: Auth_Messages.EMAIL_IN_USE });
        }

        const validateMatricula = await Student.findOne({ matricula: matricula });
        if (validateMatricula) {
            return res.status(409).json({ message: Auth_Messages.MATRICULA_IN_USE });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const code = Math.floor(10000000 + Math.random() * 90000000);

        const newStudent = new Student({
            nombre: nombre,
            aPaterno: aPaterno,
            aMaterno: aMaterno,
            matricula: matricula,
            carrera: carrera,
            correo: correo,
            password: hashedPassword,
            code: code,
        });

        // Cargar la plantilla de correo desde el archivo
        const templatePath = path.join(templatesDir, 'email_validation.html');
        const html = await fs.readFile(templatePath, 'utf8');

        // Configuración del transporte para nodemailer (ajustar según tu proveedor de correo)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: jefeNombre,
                pass: passJefe,
            },
        });

        // Reemplazar variables en la plantilla con los datos del estudiante
        const filledTemplate = html
            .replace('{{nombre}}', nombre)
            .replace('{{aPaterno}}', aPaterno)
            .replace('{{aMaterno}}', aMaterno)
            .replace('{{code}}', code);

        // Contenido del correo electrónico
        const mailOptions = {
            from: jefeNombre,
            to: correo,
            subject: Subject.SUBJECT_CODE_VALIDATION,
            html: filledTemplate,
        };

        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);

        await newStudent.save();

        const token = jwt.sign({ _id: newStudent._id }, 'secretkey');

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: Auth_Messages.SERVER_ERROR + error });
    }
};

//Login para administrativos y estudiantes
authCtrl.signin = async (req, res) => {
    passport.authenticate('local', async (err, userObject, info) => {
        try {
            if (err) {
                return res.status(500).json({ message: Auth_Messages.INTERNAL_SERVER_ERROR });
            }

            if (!userObject) {
                return res.status(401).json({ message: info.message });
            }

            let token;
            if (userObject.student) {
                token = userObject.token;
                return res.status(200).json({ success: true, token, redirect: '/regcaso' });
            }

            const foundUser = userObject;
            token = userObject.token;

            if (foundUser.roles.length > 1) {
                return res.status(200).json({ success: true, roles: foundUser.roles });
            }

            const redirectUrl = determineRedirectUrl(foundUser.roles[0]);
            return res.status(200).json({ success: true, token, redirect: redirectUrl });
        } catch (error) {
            return res.status(500).json({ message: Auth_Messages.SERVER_ERROR });
        }
    })(req, res);
};

authCtrl.confirmRole = async (req, res) => {
    const { email, role } = req.body;

    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.status(404).json({ message: Auth_Messages.USER_NOT_FOUND });
        }

        if (!foundUser.roles.includes(role)) {
            return res.status(400).json({ message: Auth_Messages.INVALID_ROLE });
        }

        const token = jwt.sign({ _id: foundUser._id, rol: role }, 'secretkey');
        const redirectUrl = determineRedirectUrl(role);

        return res.status(200).json({ success: true, token, redirect: redirectUrl });
    } catch (error) {
        return res.status(500).json({ message: Auth_Messages.SERVER_ERROR });
    }
};

const determineRedirectUrl = (role) => {
    if (
        role === IdRoles.ID_ROL_ELECTROMECANICA ||
        role === IdRoles.ID_ROL_INDUSTRIAL ||
        role === IdRoles.ID_ROL_SISTEMAS ||
        role === IdRoles.ID_ROL_ELECTRONICA ||
        role === IdRoles.ID_ROL_INFORMATICA ||
        role === IdRoles.ID_ROL_ADMINISTRACION
    ) {
        return Auth_Routes.JEFE_COMPENDIO;
    } else if (role === IdRoles.ID_ROL_SECRETARIA) {
        return Auth_Routes.SECRETARIA_ACEPTADOS;
    } else if (role === IdRoles.ID_ROL_ADMINISTRADOR) {
        return Auth_Routes.ADMINISTRADOR;
    } else {
        return res.status(500).json({ message: Auth_Messages.NO_ROL });
    }
};

//Metodo para verificar cuenta de estudiantes
authCtrl.verifiedCode = async (req, res) => {
    try {
        const { codigoVerificacion, email } = req.body;

        const foundStudent = await Student.findOne({ correo: email });

        if (!foundStudent) {
            return res.status(401).json({ message: Auth_Messages.VERIFIED_CODE_ERROR });
        } else {
            const foundCode = await Student.findOne({ code: codigoVerificacion });

            if (!foundCode) {
                return res.status(401).json({ message: Auth_Messages.INVALID_VERIFICATION_CODE });
            } else {
                await Student.findOneAndUpdate({ correo: email }, { $set: { status: 'VERIFIED' } });

                return res.status(200).json({
                    success: true,
                    message: Auth_Messages.ACCOUNT_VERIFIED,
                });
            }
        }
    } catch (error) {
        res.status(400).json({ message: 'Error del servidor' });
    }
};

module.exports = authCtrl;
