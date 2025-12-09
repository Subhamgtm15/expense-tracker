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
    const newTransaction = { amount: amount, type: type, description: description, date:new Date()}
    try{
        const db=getDB();
        const result=await db.collection('transactions').insertOne(newTransaction);
        res.status(201).json({
            message:'successfully created',
            transaction: { ...newTransaction, _id: result.insertedId }
        })
    } catch{
        res.status(500).json({error:'failed to post'})
    } 
})

//delete transactions
app.delete('/api/transactions/:id',async(req,res)=>{
    const id=req.params.id
    try{
        const db=getDB();
        const result=await db.collection('transactions').deleteOne({_id:new ObjectId(id)})
        if(result.deletedCount===0){
            return res.status(404).json({error:'transaction not found'})
        }
        res.status(200).json({message:'successfully deleted',id})
    }catch{
        res.status(500).json({error:'failed to delete'})
    }
})

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
