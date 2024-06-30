const { Schema, model } = require('mongoose');

const comitesSchema = new Schema(
    {
        matricula: { type: Number, required: [true, 'matricula is required'] },
        nombreCom: { type: String, required: [true, 'nombreCom is required'] },
        telefono: { type: Number, required: [true, 'telefono is required'] },
        casoEsta: { type: String, required: [true, 'casoEsta is required'] },
        direccion: { type: String, required: [true, 'direccion is required'] },
        carrera: { type: String, required: [true, 'carrera is required'] },
        casoTipo: { type: String, required: [true, 'casoTipo is required'] },
        semestre: { type: Number, required: [true, 'semestre is required'] },
        correo: { type: String, required: [true, 'correo is required'] },
        motivosAca: { type: String, required: [true, 'motivosAca is required'] },
        motivosPer: { type: String, required: [true, 'MotivosPer is required'] },
        evidencia: { data: Buffer, contentType: String },
        motivoComi: { type: String },
        idAlumno: { type: String, require: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Comite = model('Comites', comitesSchema);

const Reciclaje = model('Reciclaje', comitesSchema);

module.exports = { Comite, Reciclaje };
