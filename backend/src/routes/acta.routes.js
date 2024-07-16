const { Router } = require('express');
const router = Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { conversor, Act, getPart, getAllActas, getActaById, updateAlumnosAceptados } = require('../controllers/jefes/acta.controllers');

router.get('/get/participantes/acta', getPart);
router.get('/get/acta/number', conversor);
router.post('/create/acta/number', upload.single('file'), Act);

/*Aqui deben ir las rutas*/
router.get('/actas', getAllActas);
router.get('/actas/:id/pdf', getActaById);
router.put('/estados-alumnos', updateAlumnosAceptados);

module.exports = router;
