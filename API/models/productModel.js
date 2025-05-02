const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    isArchived: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true,
    });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
