const express = require('express');
const router = express.Router();
const products = require('../Models/Products');
const users = require('../Models/userSchema'); // Import User Model
const bcrypt = require("bcryptjs"); // Import bcrypt for password checking

// ==============================================
// 1. USER AUTHENTICATION ROUTES
// ==============================================

// REGISTER USER
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please fill all fields" });
    }

    try {
        const preuser = await users.findOne({ email: email });

        if (preuser) {
            return res.status(422).json({ error: "Email already exists" });
        } else {
            const finalUser = new users({ name, email, password });
            await finalUser.save();
            res.status(201).json(finalUser);
            console.log("User Registered");
        }
    } catch (error) {
        res.status(422).json(error);
        console.log(error);
    }
});

// LOGIN USER
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please fill all details" });
    }

    try {
        const userValid = await users.findOne({ email: email });

        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);

            if (!isMatch) {
                res.status(422).json({ error: "Invalid Details" });
            } else {
                // Generate Token
                const token = await userValid.generateAuthToken();

                // Send Token as Cookie
                res.cookie("usercookie", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: true
                });

                const result = {
                    userValid,
                    token
                }
                res.status(201).json({ status: 201, result });
            }
        } else {
            res.status(422).json({ error: "Invalid Details" });
        }
    } catch (error) {
        res.status(401).json(error);
        console.log(error);
    }
});


// ==============================================
// 2. PRODUCT MANAGEMENT ROUTES (EXISTING)
// ==============================================

// Inserting (Creating) Data:
router.post("/insertproduct", async (req, res) => {
    const { ProductName, ProductPrice, ProductBarcode, ProductQty } = req.body;

    try {
        const pre = await products.findOne({ ProductBarcode: ProductBarcode })
        console.log(pre);

        if (pre) {
            res.status(422).json("Product is already added.")
        }
        else {
            const addProduct = new products({ 
                ProductName, 
                ProductPrice, 
                ProductBarcode, 
                ProductQty 
            });

            await addProduct.save();
            res.status(201).json(addProduct)
            console.log(addProduct)
        }
    }
    catch (err) {
        console.log(err)
    }
})

// Getting (Reading) All Data:
router.get('/products', async (req, res) => {
    try {
        const getProducts = await products.find({})
        console.log(getProducts);
        res.status(201).json(getProducts);
    }
    catch (err) {
        console.log(err);
    }
})

// Getting (Reading) Individual Data:
router.get('/products/:id', async (req, res) => {
    try {
        const getProduct = await products.findById(req.params.id);
        console.log(getProduct);
        res.status(201).json(getProduct);
    }
    catch (err) {
        console.log(err);
    }
})

// Editing (Updating) Data:
router.put('/updateproduct/:id', async (req, res) => {
    const { ProductName, ProductPrice, ProductBarcode, ProductQty } = req.body;

    try {
        const updateProducts = await products.findByIdAndUpdate(
            req.params.id, 
            { ProductName, ProductPrice, ProductBarcode, ProductQty }, 
            { new: true }
        );
        console.log("Data Updated");
        res.status(201).json(updateProducts);
    }
    catch (err) {
        console.log(err);
    }
})

// Deleting Data:
router.delete('/deleteproduct/:id', async (req, res) => {
    try {
        const deleteProduct = await products.findByIdAndDelete(req.params.id);
        console.log("Data Deleted");
        res.status(201).json(deleteProduct);
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;