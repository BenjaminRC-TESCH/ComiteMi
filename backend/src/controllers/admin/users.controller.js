const adminCtrl = {};
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { IdRoles } = require('../../config/statuses');

adminCtrl.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({ _id: newUser._id }, 'secretkey');
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error al guardar el usuario:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Crear un nuevo usuario
adminCtrl.createUser = async (req, res) => {
    const { name, email, password, roles } = req.body;

    try {
        if (!name || !email || !roles) {
            return res.status(400).json({ message: 'Por favor completa todos los campos.' });
        }

        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s.'\-]+$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({ message: 'Por favor ingresa un nombre válido.' });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,12})/;
        if (password && !passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'La contraseña debe tener entre 8 y 12 caracteres, al menos una letra mayúscula y un carácter especial.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            roles: roles,
        });

        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'Error del servidor' });
        console.error(error);
    }
};

// Obtener todos los usuarios
//adminCtrl.getAllUsers = async (req, res) => {
//try {
//const users = await User.find();
//res.status(200).json(users);
//} catch (error) {
//res.status(500).json({ message: 'Error del servidor' });
//console.error(error);
// }
//};

// Obtener todos los usuarios
adminCtrl.getAllUsers = async (req, res) => {
    try {
        // Definir los estados aceptados
        const users = await User.find({ roles: { $ne: IdRoles.ID_ROL_ADMINISTRADOR } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
        console.error(error);
    }
};

// Obtener un usuario por email
adminCtrl.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json(`Usuario con email ${email} no encontrado`);
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
        console.error(error);
    }
};

// Actualizar un usuario por _id
adminCtrl.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, roles } = req.body;

        console.log(name, email, password, roles);

        if (!name || !email) {
            return res.status(400).json({ message: 'Por favor completa todos los campos.' });
        }

        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s.'\-]+$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({ message: 'Por favor ingresa un nombre válido.' });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,12})/;
        if (password && !passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'La contraseña debe tener entre 8 y 12 caracteres, al menos una letra mayúscula y un carácter especial.',
            });
        }

        let updateUser = {
            name,
            email,
        };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateUser.password = hashedPassword;
        }

        if (roles) {
            // Filtrar roles vacíos
            const filteredRoles = roles.filter((role) => role.trim() !== '');
            if (filteredRoles.length === 0) {
                return res.status(400).json({ message: 'Los roles no pueden estar vacíos.' });
            }
            updateUser.roles = filteredRoles;
        }

        const user = await User.findByIdAndUpdate(id, updateUser, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error del servidor' });
    }
};

// Borrar un usuario por _id
adminCtrl.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Utilizamos deleteOne en lugar de remove
        const result = await User.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json(`Usuario con _id ${id} no encontrado`);
        }

        res.status(200).json({ message: `Usuario con _id ${id} eliminado exitosamente` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = adminCtrl;
