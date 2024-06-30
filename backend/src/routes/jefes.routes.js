const { Router } = require('express');
const router = Router();
const {
    getAlumnosJefes,
    aceptarSolicitudJefe,
    rechazarSolicitudJefe,
    moverReciclajeJefe,
    getAlumno,
    deleteReciclajeJefe,
    restaurarReciclaJefe,
    getAlumnosAceptados,
    historialJefe,
    getAlumnoPdf,
    getReciclajefe,
} = require('../controllers/jefes/jefes.controllers');

const { aceptarSecre, rechazarSecre, getHistorialSecre, getAceptadosSecretaria } = require('../controllers/jefes/secretaria.controller');

router.get('/get/alumno/:matricula', getAlumno); //ruta para obtener los alumno segun la matricula
router.get('/alumnos/:id/pdf', getAlumnoPdf); //Ruta para mostrar el pdf del caso segun el alumno

/**********************************/
/*Rutas para los jefes de carrera*/
/********************************/
router.get('/get/jefes/comites/:token', getAlumnosJefes); //Obtener alumnos por matricula
router.put('/aceptar/jefes/comite/:id', aceptarSolicitudJefe); //Aceptar alumnos por ele jefe de carrera
router.put('/rechazar/jefes/comite/:id', rechazarSolicitudJefe); //Rechazar alumno por el jefe de carrera
router.post('/mover/reciclaje/jefes/comite/:id', moverReciclajeJefe); //Mover alumno a reciclaje por jefe de carrera
router.get('/get/reciclaje/jefes/comite/:token', getReciclajefe); //Obtener de papelera de reciclaje
router.post('/restaurar/reciclaje/jefes/comite/:id', restaurarReciclaJefe); //Metodo para restaurar de papelera
router.delete('/delete/reciclaje/jefes/alumno/:id', deleteReciclajeJefe); //Ruta par eliminar algun caso de la papelera por el id del alumno(jefes)
router.get('/historial/jefes/comite/:token', historialJefe); //Ruta para ver el historial de casos
router.get('/get/jefes/comite/aceptados/:token', getAlumnosAceptados); //Ruta para obtener los alumnos

/********************************/
/***Rutas para la secretaria****/
/******************************/
router.get('/get/secretaria/comite/aceptados', getAceptadosSecretaria); //Ruta para obtener los alumnos
router.put('/aceptar/secretaria/comite/:id', aceptarSecre); //Aceptar los casos por la secretaria
router.put('/rechazar/secretaria/comite/:id', rechazarSecre); //Rechazar los casos por las secretaria
router.get('/historial/secretaria/comite', getHistorialSecre); //Obtener el historial de casos aceptados

module.exports = router;
