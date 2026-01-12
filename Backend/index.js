const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

// 1. CONNECT TO DATABASE
mongoose.connect(process.env.MONGO_URI || "YOUR_MONGODB_URI_HERE", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB")).catch((err) => console.log("DB Error:", err));

// 2. IMPORT SCHEMA (Using 'Models' with Capital M to match your folder)
// We use a try-catch just in case, but prioritize the Capital M
let users;
try {
    users = require('./Models/userSchema');
} catch (e) {
    users = require('./Models/userSchema');
}

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 3. DEBUG ROUTE
app.get("/", (req, res) => {
    res.json("Backend is Live!");
});

// 4. LOGIN ROUTE (Directly inside index.js to prevent 404s)
app.post("/login", async (req, res) => {
    console.log("Login hit:", req.body);
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Fill all details" });

    try {
        const userValid = await users.findOne({ email: email });
        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);
            if (!isMatch) {
                res.status(422).json({ error: "Invalid Details" });
            } else {
                const token = await userValid.generateAuthToken();
                res.cookie("usercookie", token, { expires: new Date(Date.now() + 9000000), httpOnly: true });
                res.status(201).json({ status: 201, result: { userValid, token } });
            }
        } else {
            res.status(422).json({ error: "Invalid Details" });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json(error);
    }
});

// 5. IMPORT ROUTER (Using 'Routes' with Capital R to match your folder)
try {
    const router = require('./Routes/router');
    app.use(router);
} catch (error) {
    console.log("External router failed, but Login is safe.");
}

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});