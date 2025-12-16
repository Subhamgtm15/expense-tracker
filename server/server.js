const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./db');
const { ObjectId } = require('mongodb');
const auth=require('./middlewares/auth')

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

//routes
const authRoutes = require('./models/User');

// Simple test route
app.get('/',auth, (req, res) => {
    res.send('Finance Tracker API running...');
});

// Example: Get all transactions
app.get('/api/transactions',auth, async (req, res) => {
    try {
        const db = getDB();
        const transactions = await db.collection('transactions').find({userId:req.user.id}).toArray();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});


//post transactions

app.post('/api/transactions',auth, async (req, res) => {
    const { amount, type,category, description } = req.body;
    const newTransaction = { amount: amount, type: type,category:category, description: description, date: new Date(),userId:req.user.id } //req.user is the object containing id, look at the auth.js middleware, decoded variable
    try {
        const db = getDB();
        const result = await db.collection('transactions').insertOne(newTransaction);
        res.status(201).json({
            message: 'successfully created',
            transaction: { ...newTransaction, _id: result.insertedId } //insertedid is the transaction id
        })
    } catch {
        res.status(500).json({ error: 'failed to post' })
    }
})

//delete transactions
app.delete('/api/transactions/:id',auth, async (req, res) => {
    const id = req.params.id
    try {
        const db = getDB();
        const result = await db.collection('transactions').deleteOne({ _id: new ObjectId(id), userId:req.user.id })
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'transaction not found' })
        }
        res.status(200).json({ message: 'successfully deleted', id })
    } catch {
        res.status(500).json({ error: 'failed to delete' })
    }
})

//update transactions
app.put('/api/transactions/:id',auth, async (req, res) => {
    const id = req.params.id
    const userId=req.user.id;
    const { amount, type,category, description } = req.body;
    try {
        const db = getDB();
        const result = await db.collection('transactions').updateOne(
            { _id: new ObjectId(id), userId:userId },
            { $set: { amount: amount, type: type,category:category, description: description} }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        return res.status(200).json({
            message: 'Transaction updated successfully',
            updated: { id, amount, type,category, description,userId }
        });
    } catch {
        res.status(500).json({ error: 'failed to update' })
    }
})

//register 
app.use('/api/auth', authRoutes);

//login
app.use('/api/auth',authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
