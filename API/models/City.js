const mongoose = require('mongoose');

const capitalizeFirstLetter = (value) => {
    if (typeof value !== 'string') return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

const CitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        set: capitalizeFirstLetter,
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
