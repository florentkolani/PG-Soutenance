const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        set: (value) => value.toUpperCase(),
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    phoneLength: {
        type: Number,
        required: true,
    },
    isarchived: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Country', CountrySchema);
