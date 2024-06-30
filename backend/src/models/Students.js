const { Schema, model } = require('mongoose');
const bycrypt = require('bcrypt');

const StudentSchema = new Schema(
    {
        nombre: { type: String, required: true },
        aPaterno: { type: String, required: true },
        aMaterno: { type: String, required: true },
        matricula: { type: String, required: true, unique: true },
        carrera: { type: String, required: true },
        correo: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        rol: { type: String, required: true, default: 'Estudiante' },
        code: { type: String, require: true, unique: true },
        status: { type: String, require: true, default: 'UNVERIFIED' },
    },
    {
        timestams: true,
    }
);

StudentSchema.methods.encryptPasswords = async (password) => {
    const salt = await bycrypt.genSalt(10);
    return await bycrypt.hash(password, salt);
};

StudentSchema.methods.matchPassword = async function (password) {
    return await bycrypt.compare(password, this.password);
};

module.exports = model('estudiantes', StudentSchema);
