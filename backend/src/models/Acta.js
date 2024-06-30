const  {Schema, model} = require('mongoose');

const ActaSchema = new Schema({
    
    number: {type: Number}
});

module.exports = model('Acta', ActaSchema);