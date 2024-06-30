const rolesCtrl = {};
const Roles = require('../../models/Roles');

rolesCtrl.createRol = async (req, res) => {
    const { id_rol, nombreRol } = req.body;

    if (!nombreRol || !id_rol) {
        return res.status(400).json({ message: 'Por favor completa todos los campos.' });
    }

    // Expresión regular para validar que el nombre y apellidos contengan solo letras
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s.'\-]+$/;
    if (!nameRegex.test(nombreRol)) {
        return res.status(400).json({ message: 'Por favor ingresa un nombre válido.' });
    }

    try {
        const validateRol = await Roles.findOne({ nombreRol: nombreRol });
        if (validateRol) {
            return res.status(409).json({ message: 'El nombre del Rol ya está en uso.' });
        }

        const rol = new Roles({
            id_rol: id_rol,
            nombreRol: nombreRol,
        });

        const newRol = await rol.save();
        res.status(201).json({ message: 'Rol Registrado' });
    } catch (error) {
        res.status(400).json({ message: 'Error del servidor' });
    }
};

rolesCtrl.getRoles = async (req, res) => {
    try {
        const roles = await Roles.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

rolesCtrl.getRolId = async (req, res) => {
    try {
        const rol = await Roles.findById(req.params.id);
        if (!rol) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }
        res.status(200).json(rol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

rolesCtrl.updateRol = async (req, res) => {
    try {
        const { nombreRol } = req.body;
        const { id } = req.params;

        if (!nombreRol || !id) {
            return res.status(400).json({ message: 'Por favor completa todos los campos.' });
        }

        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s.'\-]+$/;
        if (!nameRegex.test(nombreRol)) {
            return res.status(400).json({ message: 'Por favor ingresa un nombre válido.' });
        }

        // Crear objeto de actualización del administrador
        let updateRol = {
            nombreRol,
        };

        // Actualizar el administrador en la base de datos
        const rol = await Roles.findByIdAndUpdate(id, updateRol, { new: true });

        if (!rol) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        // Enviar la respuesta con el administrador actualizado
        res.status(200).json({ message: 'Rol actualizada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la Rol:' });
    }
};

rolesCtrl.deleteRol = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Por favor completa todos los campos.' });
        }

        // Utilizamos deleteOne en lugar de remove
        const result = await Roles.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Rol con _id ${id} no encontrado` });
        }

        res.status(200).json({ message: `Rol con _id ${id} eliminado exitosamente` });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = rolesCtrl;
