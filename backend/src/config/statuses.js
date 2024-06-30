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

module.exports = { Estados, Carreras, Roles, IdRoles };
