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

const Secretary_Mensajes = {
    SUCCESS_ACEPT_SECRE: 'Tu solicitud ha sido aceptada por la Secretaría del comité académico',
    SUCCESS_ACEPT_COMI: 'Tu solicitud ha sido aceptada por el comité académico',
    REJECTED_SECRE: 'Solicitud Rechazada por la Secretaría del comité académico',
    ERROR_REV_COMITE: 'El caso está en revisión por el comité académico.',
    ERROR_REV_SECRE: 'El caso está en revisión por la secretaria del comité académico.',
    ERROR_REJECTED_JEFE: 'El caso ya ha sido rechazado.',
    STUDENT_NOT_FOUND: 'Estudiante no encontrado',
    EVIDENCE_NOT_FOUND: 'No se ha proporcionado un archivo de evidencia',
    STATUS_ERROR: 'El estado del caso no permite esta acción',
    SERVER_ERROR: 'Error del servidor',
    ERROR_OBTAINING_CASOS: 'Error al obtener el historial de casos',

    ERROR_CREATING_STUDENTS_ACEPT: 'No se encontraron alumnos con estado "AceptadoJefes',
    ERROR_OBTAINING_STUDENTS: 'Error al obtener los alumnos',
};

const Jefes_Mensajes = {
    SUCCESS_ACEPT_SECRE: 'Tu solicitud ha sido aceptada por la Secretaría del comité académico',
    SUCCESS_ACEPT_COMI: 'Tu solicitud ha sido aceptada por el comité académico',
    REJECTED_SECRE: 'Solicitud Rechazada por la Secretaría del comité académico',
    STUDENT_NOT_FOUND: 'Estudiante no encontrado',
    EVIDENCE_NOT_FOUND: 'No se ha proporcionado un archivo de evidencia',
    STATUS_ERROR: 'El estado del caso no permite esta acción',
    SERVER_ERROR: 'Error del servidor',
    ERROR_OBTAINING_CASOS: 'Error al obtener el historial de casos',
    ERROR_CREATING_STUDENTS_ACEPT: 'No se encontraron alumnos con estado "AceptadoJefes',
    ERROR_OBTAINING_STUDENTS: 'Error al obtener los alumnos',
    ERROR_OBTAINING_CARRERA: 'No se encontraron alumnos para esta carrera',
    ERROR_OBTAINING_RECYCLING: 'Error al obtener los reciclajes',
    ERROR_REV_COMITE: 'El caso está en revisión por el comité académico.',
    ERROR_REV_SECRE: 'El caso está en revisión por la secretaria del comité académico.',
    ERROR_REJECTED_JEFE: 'El caso ya ha sido rechazado.',
    ERROR_OBTAINING_JEFE_HISTORY: 'Error al obtener el historial del jefe',
    ERROR_OBTAINING_STUDENTS: 'Error al obtener los alumnos.',
    ERROR_OBTAINING_EVIDENCE: 'No hay evidencia adjunta para este alumno',
    DELETE_STUDENT: 'Alumno eliminado correctamente.',
};

const Students_Messages = {
    STUDENT_NOT_FOUND: 'Estudiante no encontrado',
    EVIDENCE_NOT_FOUND: 'Evidencia no encontrada',
    ERROR_CREATING_STUDENT: 'Error al crear el alumno.',
    ERROR_OBTAINING_STUDENTS: 'Error al obtener los alumnos.',
    NO_STUDENTS_FOUND: 'No se encontraron alumnos para esta carrera.',
    ALUMNO_NOT_FOUND: 'Alumno no encontrado.',
    NO_EVIDENCE_FOUND: 'No hay evidencia adjunta para este alumno.',
    ERROR_OBTAINING_PDF: 'Error al obtener el archivo PDF del alumno.',
    ERROR_OBTAINING_PROFILE: 'Error al obtener el perfil del estudiante',
    ERROR_UPDATING_PROFILE: 'Error al actualizar el perfil del estudiante',
    INVALID_NAME: 'Por favor ingresa un nombre válido.',
    INVALID_PATERNAL_SURNAME: 'Por favor ingresa un apellido paterno válido.',
    INVALID_MATERNAL_SURNAME: 'Por favor ingresa un apellido materno válido.',
    INVALID_MATRICULA: 'La matrícula debe tener exactamente 9 dígitos.',
    INVALID_EMAIL_DOMAIN: 'El correo electrónico debe ser de dominio @tesch.edu.mx.',
    INVALID_PASSWORD: 'La contraseña debe tener entre 8 y 12 caracteres, al menos una letra mayúscula y un carácter especial.',
    SERVER_ERROR: 'Error del servidor',
    UPDATE_NOT_ALLOWED: 'Solo puedes actualizar tu perfil cada 30 días. Ponte en contacto con el administrador de ser necesario.',
};

const Passport_Messages = {
    VERIFIED_ACCOUNT: 'Por favor, verifica tu cuenta',
    WRONG_PASSWORD: 'Contraseña incorrecta',
    USER_NOT_FOUND: 'Usuario no encontrado',
};

const Auth_Messages = {
    COMPLETE_FIELDS: 'Por favor completa todos los campos.',
    INVALID_NAME: 'Por favor ingresa un nombre válido.',
    INVALID_PATERNAL_SURNAME: 'Por favor ingresa un apellido paterno válido.',
    INVALID_MATERNAL_SURNAME: 'Por favor ingresa un apellido materno válido.',
    INVALID_MATRICULA: 'La matrícula debe tener exactamente 9 dígitos.',
    INVALID_EMAIL_DOMAIN: 'El correo electrónico debe ser de dominio @tesch.edu.mx.',
    PASSWORDS_NOT_MATCH: 'Las contraseñas no coinciden',
    INVALID_PASSWORD: 'La contraseña debe tener entre 8 y 12 caracteres, al menos una letra mayúscula y un carácter especial.',
    EMAIL_IN_USE: 'El correo electrónico ya está en uso.',
    MATRICULA_IN_USE: 'La matrícula ya está en uso.',
    SERVER_ERROR: 'Error del servidor',
    USER_NOT_FOUND: 'Usuario no encontrado',
    INVALID_ROLE: 'Rol no válido',
    VERIFIED_CODE_ERROR: 'Algo salió mal.',
    INVALID_VERIFICATION_CODE: 'Código erróneo. Ingresa el código correctamente.',
    ACCOUNT_VERIFIED: 'Código verificado correctamente. Tu cuenta ha sido verificada.',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    NO_ROL: 'No tienes acceso >:C',
};

const Subject = {
    SUBJECT_CODE_VALIDATION: 'Código de verificación - Comité académico',
    SUBJECT_REQUEST_RECEIVED: 'Solicitud recibida',
    SUBJECT_COMITE: 'Comité académico TESCHA',
    SUBJECT_COMITE_MEETING: 'Comité académico TESCHA - Aviso de Convocatoria',
    SUBJECT_COMITE_ACCEPTED: 'Tu solicitud ha sido aceptada por el comité académico',
    SUBJECT_COMITE_REJECTED: 'Tu solicitud ha sido rechazada por el comité académico',
};

const Auth_Routes = {
    JEFE_COMPENDIO: '/jefes-compendio',
    SECRETARIA_ACEPTADOS: '/secretaria-aceptados',
    ADMINISTRADOR: '/administrador',
    OTRA_RUTA: '/otra-ruta',
};

module.exports = {
    Estados,
    Carreras,
    Roles,
    IdRoles,
    Secretary_Mensajes,
    Jefes_Mensajes,
    Subject,
    Students_Messages,
    Auth_Messages,
    Auth_Routes,
    Passport_Messages,
};
