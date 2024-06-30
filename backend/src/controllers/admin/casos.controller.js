const casosCtrl = {};
const Casos = require('../../models/Casos');

casosCtrl.getCasos = async (req, res) => {
    try {
        const casos = await Casos.find();
        res.status(200).json(casos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

casosCtrl.createCaso = async (req, res) => {
    try {
        const { nombreCaso } = req.body;

        if (!nombreCaso) {
            return res.status(400).json({ message: 'Por favor completa todos los campos.' });
        }

        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s.'\-]+$/;
        if (!nameRegex.test(nombreCaso)) {
            return res.status(400).json({ message: 'Por favor ingresa un nombre válido.' });
        }

        try {
            const validateCaso = await Casos.findOne({ nombreCaso });
            if (validateCaso) {
                return res.status(409).json({ message: 'El nombre del caso ya está en uso.' });
            }

            const caso = new Casos({
                nombreCaso: nombreCaso,
            });

            const newCaso = await caso.save();
            res.status(201).json({ message: 'Caso Registrado' });
        } catch (error) {
            res.status(400).json({ message: 'Error del servidor' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

casosCtrl.updateCaso = async (req, res) => {
    try {
        const { nombreCaso } = req.body;
        const { id } = req.params;

        if (!nombreCaso) {
            return res.status(400).json({ message: 'Por favor completa todos los campos.' });
        }

        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s.'\-]+$/;
        if (!nameRegex.test(nombreCaso)) {
            return res.status(400).json({ message: 'Por favor ingresa un nombre válido.' });
        }

        try {
            let updatecaso = {
                nombreCaso,
            };

            const caso = await Casos.findByIdAndUpdate(id, updatecaso, { new: true });

            if (!caso) {
                return res.status(404).json({ message: 'caso no encontrado' });
            }

            res.status(200).json({ message: 'Caso actualizado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar Caso:' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

casosCtrl.deleteCaso = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Id no encontrado' });
        }

        const result = await Casos.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Caso con _id ${id} no encontrado` });
        }

        res.status(200).json({ message: `Caso con _id ${id} eliminado exitosamente` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = casosCtrl;
