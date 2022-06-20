const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const apiDataSchema = new Schema({
    apiName: {
        type: String,
        trim: true,
        required: true,
        text: true,
        unique: true
    },
    apiId: {
        type: String,
        trim: true,
        unique: true
    },
    projectName: {
        type: String,
        trim: true,
        required: true,
        text: true,
        unique: true
    },
    projectId: {
        type: String,
        trim: true,
        required: true,
        text: true,
        unique: true
    },
    lastChecked: {
        type: Date
    },
    result: {},
    status: {
        type: String,
        trim: true,
        default: "good"
    }
});
module.exports = mongoose.model('apiData', apiDataSchema);
