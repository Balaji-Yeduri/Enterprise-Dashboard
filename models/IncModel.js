const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incSchema = new Schema({
    Inc_Number: {
        type: String,
        trim: true,
        required: true
        //unique: true
    },
    Outage_Flag :{
        type: Boolean,
        default: false,
        required: true
    },
    Inc_State:{
        type: Number,
        required: true
    },
    Business_Service: {
        type: String,
        required: true,
    },
    Opened_Time: {
        type: String,
        required: true,
    },
    Priority:{
        type: Number,
        required: true
    }

});



module.exports = mongoose.model('Incident', incSchema);