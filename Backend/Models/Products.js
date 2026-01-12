const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    ProductName: { type: String, required: true },
    ProductPrice: { type: Number, required: true },
    ProductBarcode: { type: Number, required: true },
    ProductQty: { type: Number, required: true }
});

const products = new mongoose.model("products", productSchema);

module.exports = products;