const mongoose = require('mongoose');

const courcesSchema = new mongoose.Schema({
    
    serName:{
        type: String,
        required: true,
    },
    cName:{
        type: String,
        required: true,
    },
    cImg:{
        type: String,
        required: true,
    },
    cVideo:{
        type: String,
        required: true,
    },
    cnt:{
        type: Number,
        required: true,
    },

});

module.exports = mongoose.model('cources',courcesSchema);