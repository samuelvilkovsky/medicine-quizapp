const mongoose = require('mongoose');

const TestResultSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    correctCount: {
        type: Number,
        required: true
    },
    wrongCount: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TestResult', TestResultSchema);
