const { Schema, model } = require('mongoose');

const casosSchema = new Schema(
    {
        nombreCaso: { type: String, require: true },
    },
    {
        timestamps: true,
    }
);

const Casos = model('casos', casosSchema);

module.exports = Casos;
