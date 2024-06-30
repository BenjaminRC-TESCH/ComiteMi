const carrerasCtrl = {};
const Carreras = require('../../models/Carrera');

carrerasCtrl.getCarreras = async (req, res) => {
    try {
        const carreras = await Carreras.find();
        res.status(200).json(carreras);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

carrerasCtrl.createCarreras = async (req, res) => {
    try {
        const { nombreCarrera } = req.body;

        if (!nombreCarrera) {
            return res.status(400).json({ message: 'Por favor completa todos los campos.' });
        }

        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s.'\-]+$/;
        if (!nameRegex.test(nombreCarrera)) {
            return res.status(400).json({ message: 'Por favor ingresa un nombre válido.' });
        }

        try {
            const validateCarrera = await Carreras.findOne({ nombreCarrera });
            if (validateCarrera) {
                return res.status(409).json({ message: 'El nombre ya está en uso.' });
            }

            const carrera = new Carreras({
                nombreCarrera: nombreCarrera,
            });

            const newCarrera = await carrera.save();
            res.status(201).json({ message: 'carrera Registrado' });
        } catch (error) {
            res.status(400).json({ message: 'Error del servidor' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

carrerasCtrl.updateCarreras = async (req, res) => {
    try {
        const { nombreCarrera } = req.body;
        const { id } = req.params;

        if (!nombreCarrera) {
            return res.status(400).json({ message: 'Por favor completa todos los campos.' });
        }

        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s.'\-]+$/;
        if (!nameRegex.test(nombreCarrera)) {
            return res.status(400).json({ message: 'Por favor ingresa un nombre válido.' });
        }

        try {
            let updateCarrera = {
                nombreCarrera,
            };

            const carrera = await Carreras.findByIdAndUpdate(id, updateCarrera, { new: true });

            if (!carrera) {
                return res.status(404).json({ message: 'carrera no encontrado' });
            }

            res.status(200).json({ message: 'carrera actualizado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar:' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

carrerasCtrl.deleteCarreras = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Id no encontrado' });
        }

        const result = await Carreras.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Carrera noo encontrada` });
        }

        res.status(200).json({ message: `Carrera eliminada` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = carrerasCtrl;
