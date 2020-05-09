const mongoose = require("mongoose");

const WfModelSchema = new mongoose.Schema({
    steps: {
        type: Array
    },
    modeler: {
        type: Object
    },
    description: {
        type: String
    },
    name: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('WfModel', WfModelSchema);