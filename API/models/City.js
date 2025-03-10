const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true,
    },
    isarchived: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('City', CitySchema);
