const { Schema, model } = require('mongoose');

const ActaSchema = new Schema(
    {
        number: { type: Number },
        evidencia: { data: Buffer, contentType: String },
    },
    {
        timestams: true,
    }
);

module.exports = model('Acta', ActaSchema);
