const { Schema, model } = require('mongoose');

const ActaSchema = new Schema(
    {
        number: { type: Number },
        evidencia: { data: Buffer, contentType: String },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model('Acta', ActaSchema);
