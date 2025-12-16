const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('../db')
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const router = require('express').Router();
require('dotenv').config();


app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();


//registe username

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "either field is empty" })
        }
        const db = getDB();
        const exist = await db.collection('users').findOne({ username: username })
        if (exist) {
            return res.status(409).json({ error: 'Username already exists' });

        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = { username: username, password: hashedPassword }

        const result = await db.collection('users').insertOne(newUser)
        res.status(201).json({ message: 'successfully created', username: username, id: result.insertedId })
    }
    catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ error: "Something went wrong", details: err.message });
    }
});

//login user

router.post('/login', async (req, res) => {
    //authenticate user
    try {
        const { username, password } = req.body;
        const db = getDB();
        if (!username || !password) {
            return res.status(400).json({ message: 'either field is empty' })
        }
        const userExist = await db.collection('users').findOne({ username: username })
        // console.log(userExist);
        if (!userExist) {
            return res.status(404).json({ message: 'user not found' })
        }
        const passwordMatch = await bcrypt.compare(password, userExist.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Password didn’t match' });
        }

        const accessToken = jwt.sign({ id: userExist._id},process.env.JWT_SECRET);
        console.log(accessToken);  //accesstoken has 3 parts, header,payload and signature

        res.status(200).json({ message: 'Login successful', accessToken });

    } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
}
})
module.exports = router;