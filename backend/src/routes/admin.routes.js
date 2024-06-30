const { Router } = require('express');
const router = Router();
const { signup, createUser, getAllUsers, getUserByEmail, updateUser, deleteUser } = require('../controllers/admin/users.controller');
const { createRol, getRoles, getRolId, updateRol, deleteRol } = require('../controllers/admin/roles.controllers');
const { getEstudiantes, updateEstudiante, deleteStudent } = require('../controllers/admin/student.controller');
const { createCaso, getCasos, getCasoId, updateCaso, deleteCaso } = require('../controllers/admin/casos.controller');
const { createCarreras, getCarreras, updateCarreras, deleteCarreras } = require('../controllers/admin/carreras.controller');

/*Rutas para usuarios*/
router.post('/users/signup', signup);
router.post('/users/create', createUser); //Ruta para crear usuarios(administrativos)
router.get('/users/get', getAllUsers); //Ruta para obtener todos usuarios(administrativos)
router.get('/user/get/:email', getUserByEmail); //Ruta para obtener usuarios por email(administrativos)
router.put('/users/update/:id', updateUser); //Ruta para acutalizar usuarios(administrativos)
router.delete('/users/delete/:id', deleteUser); //Ruta par eliminar usuarios(administrativos)

/*Rutas para Estudiantes*/
router.get('/students/get', getEstudiantes); // Ruta para obtener todos los estudiantes
router.put('/students/update/:id', updateEstudiante); // Ruta para actualizar estudiantes
router.delete('/students/delete/:id', deleteStudent);

/*Rutas para roles*/
router.post('/roles/create', createRol);
router.get('/roles/get', getRoles);
router.get('/roles/get/:id', getRolId);
router.put('/roles/update/:id', updateRol);
router.delete('/roles/delete/:id', deleteRol);

/*Rutas para casos*/
router.post('/caso/create', createCaso);
router.get('/casos/get', getCasos);
router.put('/caso/update/:id', updateCaso);
router.delete('/caso/delete/:id', deleteCaso);

/*Rutas para carreras*/
router.post('/carrera/create', createCarreras);
router.get('/carreras/get', getCarreras);
router.put('/carrera/update/:id', updateCarreras);
router.delete('/carrera/delete/:id', deleteCarreras);

module.exports = router;
