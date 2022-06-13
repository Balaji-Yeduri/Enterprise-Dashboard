const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    projectId: {
        type: String,
        trim: true,
        required: true
    },
    projectName: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    fteDetails: {
        fteCount: {
            type: Number,
            required: true
        },
        fteCost: {
            type: Number,
            required: true
        }
    },
    alias: {
        type: String,
        trim: true
    },
    operationalStatus: {
        type: String,
        trim: true,
        required: true,
        default: 'good'
    },
    dependenciesAvailable: {
        type: Boolean,
        default: false,
        required: true
    },
    dependencyList: [{
        projectName: {
            type: String
        },
        projectId: {
            type: String
        },
        criticalityLevel: {
            type: String,
            default: 'good'
        },
        requiredForOperation: {
            type: Boolean,
            default: true
        },
        subDependentsAvailable: {
            type: Boolean,
            default: true
        }
    }],
    downStreamList: [{
        projectName: {
            type: String
        },
        projectId: {
            type: String
        }
    }],
    monitoringType: {
        type: String
    },
    sysId:{
        type: String
    },
    apiDetails: {
        apiType: {
            type: String
        },
        apiUrl: {
            type: String
        },
        apiMethod: {
            type: String
        },
        authentication: {},
        apiBody: {},
        apiHeaders: {},
        apiQueryParams: {}
    },
    monitoringFrequency: {
        type: Number
    },
    monitoringID : {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    emailDL: [{
        email: {
            type: String
        },
        emailId: {
            type: String,
            trim: true
        }
    }],
    seniorPOC: {
        email: {
            type: String
        },
        name: {
            type: String
        }
    },
    secondaryPOC: {
        email: {
            type: String
        },
        name: {
            type: String
        }
    },
    slaCriteria: {
        p1: {
            type: Number
        },
        p2: {
            type: Number
        },
        p3: {
            type: Number
        },
        p4: {
            type: Number
        },
        p5: {
            type: Number
        }
    },
    outageOn: {
        type: Boolean,
        default: true
    },
    tickets: [],
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    other: {}
});

module.exports = mongoose.model('Project', ProjectSchema);