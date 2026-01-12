const express = require("express");
const router = express.Router();
// IMPORT THE SCHEMA WE JUST CREATED
const products = require("../Models/Products"); 

// 1. INSERT DATA (Matches your Frontend fetch)
router.post("/insertproduct", async (req, res) => {
    // console.log(req.body); // Uncomment to debug
    const { ProductName, ProductPrice, ProductBarcode, ProductQty } = req.body;

    if (!ProductName || !ProductPrice || !ProductBarcode || !ProductQty) {
        return res.status(422).json({ error: "Please fill all fields" });
    }

    try {
        // Check if barcode already exists
        const preproduct = await products.findOne({ ProductBarcode: ProductBarcode });
        
        if (preproduct) {
            return res.status(422).json({ error: "Product with this barcode already exists!" });
        } else {
            const addProduct = new products({
                ProductName, ProductPrice, ProductBarcode, ProductQty
            });
            await addProduct.save();
            res.status(201).json(addProduct);
            console.log("Data Saved Successfully");
        }
    } catch (error) {
        res.status(422).json(error);
    }
});

// 2. GET ALL DATA (For Products Page)
router.get("/products", async (req, res) => {
    try {
        const productdata = await products.find();
        res.status(201).json(productdata);
    } catch (error) {
        res.status(422).json(error);
    }
});

// 3. GET SINGLE PRODUCT (For Update Page)
router.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productindividual = await products.findById({ _id: id });
        res.status(201).json(productindividual);
    } catch (error) {
        res.status(422).json(error);
    }
});

// 4. UPDATE PRODUCT
router.patch("/updateproduct/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedproduct = await products.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.status(201).json(updatedproduct);
    } catch (error) {
        res.status(422).json(error);
    }
});

// 5. DELETE PRODUCT
router.delete("/deleteproduct/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletproduct = await products.findByIdAndDelete({ _id: id });
        res.status(201).json(deletproduct);
    } catch (error) {
        res.status(422).json(error);
    }
});

module.exports = router;