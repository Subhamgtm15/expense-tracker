const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./db');
const { ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();


// Simple test route
app.get('/', (req, res) => {
    res.send('Finance Tracker API running...');
});

// Example: Get all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const db = getDB();
        const transactions = await db.collection('transactions').find().toArray();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});


//post transactions

app.post('/api/transactions', async (req, res) => {
    const { amount, type, description } = req.body;
    const newTransaction = { amount: amount, type: type, description: description, date: new Date() }
    try {
        const db = getDB();
        const result = await db.collection('transactions').insertOne(newTransaction);
        res.status(201).json({
            message: 'successfully created',
            transaction: { ...newTransaction, _id: result.insertedId }
        })
    } catch {
        res.status(500).json({ error: 'failed to post' })
    }
})

//delete transactions
app.delete('/api/transactions/:id', async (req, res) => {
    const id = req.params.id
    try {
        const db = getDB();
        const result = await db.collection('transactions').deleteOne({ _id: new ObjectId(id) })
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'transaction not found' })
        }
        res.status(200).json({ message: 'successfully deleted', id })
    } catch {
        res.status(500).json({ error: 'failed to delete' })
    }
})

//update transactions
app.put('/api/transactions/:id', async (req, res) => {
    const id = req.params.id
    const { amount, type, description } = req.body;
    try {
        const db = getDB();
        const result = await db.collection('transactions').updateOne(
            { _id: new ObjectId(id) },
            { $set: { amount: amount, type: type, description: description, } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        return res.status(200).json({
            message: 'Transaction updated successfully',
            updated: { id, amount, type, description }
        });
    } catch {
        res.status(500).json({ error: 'failed to update' })
    }
})


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
