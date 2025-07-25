const { Schema, model } = require('mongoose');

const carreraSchema = new Schema(
    {
        nombreCarrera: { type: String, require: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Carrera = model('carreras', carreraSchema);

module.exports = Carrera;
