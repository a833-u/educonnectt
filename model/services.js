const mongoose = require('mongoose');

const serSchema = new mongoose.Schema({
    
    serName:{
        type: String,
        required: true,
    },
    serImg:{
        type: String,
        required: true,
    },


});

module.exports = mongoose.model('services',serSchema);