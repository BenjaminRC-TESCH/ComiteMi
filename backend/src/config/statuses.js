const Estados = {
    PENDIENTE: 'Pendiente',
    ACEPTADO_JEFA_CARRERA: 'Aceptado por la jefa de carrera',
    RECHAZADO_JEFA_CARRERA: 'Rechazado por la jefa de carrera',
    ACEPTADO_SECRETARIA: 'Aceptado por la Secretaría del comité académico',
    RECHAZADO_SECRETARIA: 'Rechazado por la Secretaría del comité académico',
    ACEPTADO_COMITE: 'Aceptado por el comité académico',
    RECHAZADO_COMITE: 'Rechazado por el comité académico',
};

const Carreras = {
    INGENIERIA_SISTEMAS: 'Ingeniería en Sistemas Computacionales',
    INGENIERIA_INDUSTRIAL: 'Ingeniería Industrial',
    INGENIERIA_ELECTROMECANICA: 'Ingeniería Electromecánica',
    INGENIERIA_INFORMATICA: 'Ingeniería Informática',
    INGENIERIA_ELECTRONICA: 'Ingeniería Electrónica',
    INGENIERIA_ADMINISTRACION: 'Ingeniería en Administración',
};

const Roles = {
    JEFATURA_SISTEMAS: 'Jefatura de División de Ingeniería Sistemas Computacionales',
    JEFATURA_INDUSTRIAL: 'Jefatura de División de Ingeniería Industrial',
    JEFATURA_ELECTROMECANICA: 'Jefatura de División de Ingeniería Electromecánica',
    JEFATURA_INFORMATICA: 'Jefatura de División de Ingeniería Informática',
    JEFATURA_ELECTRONICA: 'Jefatura de División de Ingeniería Electrónica',
    JEFATURA_ADMINISTRACION: 'Jefatura de División de Ingeniería Administración',
    ADMINISTRADOR: 'Administrador',
    SECRETARIA: 'Secretaría de Comité',
};

const IdRoles = {
    ID_ROL_ELECTROMECANICA: '19981',
    ID_ROL_INDUSTRIAL: '19982',
    ID_ROL_SISTEMAS: '20041',
    ID_ROL_ELECTRONICA: '20042',
    ID_ROL_INFORMATICA: '20043',
    ID_ROL_ADMINISTRACION: '20201',
    ID_ROL_ADMINISTRADOR: '1000',
    ID_ROL_SECRETARIA: '1001',
};

const Mensajes = {
    SUCCESS_ACEPT_SECRE: 'Tu solicitud ha sido aceptada por la Secretaría del comité académico',
    REJECTED_SECRE: 'Solicitud Rechazada por la Secretaría del comité académico',
    ERROR_REV_COMITE: 'El caso está en revisión por el comité académico.',
    ERROR_REV_SECRE: 'El caso está en revisión por la secretaria del comité académico.',
    ERROR_REJECTED_JEFE: 'El caso ya ha sido rechazado.',
};

module.exports = { Estados, Carreras, Roles, IdRoles, Mensajes };
