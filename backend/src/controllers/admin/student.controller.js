const studentCtrl = {};
const bcrypt = require('bcryptjs');
const Student = require('../../models/Students'); // Asegúrate de que la ruta es correcta
const fileUpload = require('express-fileupload');
const fs = require('fs');
const mongoose = require('mongoose');
const { createSolutionBuilderWithWatch } = require('typescript');
const unlinkAsync = require('util').promisify(fs.unlink);
const path = require('path');

// Obtener todos los estudiantes
studentCtrl.getEstudiantes = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un estudiante
studentCtrl.updateEstudiante = async (req, res) => {
    const { id } = req.params;
    const { password, nombre, aPaterno, aMaterno, matricula, carrera } = req.body;
    try {
        if (!nombre || !aPaterno || !aMaterno || !matricula || !carrera) {
            return res.status(400).json({ message: 'Por favor completa todos los campos.' });
        }

        // Expresión regular para validar que el nombre y apellidos contengan solo letras
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
        if (!nameRegex.test(nombre)) {
            return res.status(400).json({ message: 'Por favor ingresa un nombre válido.' });
        }

        if (!nameRegex.test(aPaterno)) {
            return res.status(400).json({ message: 'Por favor ingresa un apellido paterno válido.' });
        }

        if (!nameRegex.test(aMaterno)) {
            return res.status(400).json({ message: 'Por favor ingresa un apellido materno válido.' });
        }

        // Verificar longitud y caracteres especiales de la contraseña
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,12})/;
        if (password && !passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'La contraseña debe tener entre 8 y 12 caracteres, al menos una letra mayúscula y un carácter especial.',
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
        const student = await Student.findByIdAndUpdate(id, updateStudent, { new: true });

        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        // Enviar la respuesta con el estudiante actualizado
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

studentCtrl.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: `Estudiante con _id ${id} no encontrado` });
        }

        // Utilizamos deleteOne en lugar de remove
        const result = await Student.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Categoria con _id ${id} no encontrado` });
        }

        res.status(200).json({ message: `Studiante con _id ${id} eliminado exitosamente` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = studentCtrl;
