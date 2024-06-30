const { Schema, model } = require('mongoose');

const rolesSchema = new Schema(
    {
        id_rol: { type: Number, required: true },
        nombreRol: { type: String, required: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Roles = model('roles', rolesSchema);

module.exports = Roles;
