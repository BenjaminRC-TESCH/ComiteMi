const { Router } = require('express');
const router = Router();
const {
    createComite,
    getComiteStudent,
    getPdfStudent,
    getStudentProfile,
    updateStudentProfile,
    getCasos,
} = require('../controllers/students/students.controller');

const multer = require('multer');
// Middleware para gestionar la subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage });

router.post('/create/alumno', upload.single('evidencia'), createComite); //Ruta para crear el comite del alumno
router.get('/get/comite/alumno/:id', getComiteStudent); //Ruta para obtener el historia del alumno
router.get('/get/alumno/:id/pdf', getPdfStudent); //Ruta para obtener el pdf del alumno
router.get('/get/alumno/profile/:id', getStudentProfile); //Ruta oara obtener los datos en el perfil del alumno logeado
router.put('/update/alumno/profile', updateStudentProfile);

router.get('/get/casos/nombres', getCasos);

module.exports = router;
