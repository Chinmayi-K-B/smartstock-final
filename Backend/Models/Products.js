const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    ProductName: {
        type: String,
        required: true,
    },
    ProductPrice: {
        type: Number,
        required: true,
    },
    ProductBarcode: {
        type: Number,
        required: true,
    },
    // --- ADDED THIS FIELD ---
    ProductQty: {
        type: Number,
        required: true,
    }
});

const Products = mongoose.model("Products", ProductSchema);
module.exports = Products;