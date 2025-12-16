import { useState, useEffect } from "react"
import Piecharts from "./Piecharts";
import Summary from "./summary";
export default function Main() {
    console.log('rendered');
    const [transaction, setTransaction] = useState([]);
    const [amount, setAmount] = useState('10');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense')
    const [editingId, setEditingId] = useState(null);
    const [category, setCategory] = useState('Food')
    const categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'];

    const token = localStorage.getItem('token');

    //get
    useEffect(() => {
        fetch('http://localhost:5000/api/transactions', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setTransaction(data));
    }, []);

    async function submitTransaction(e) {
        e.preventDefault();
        if (!amount || !category || !type || !description) {
            alert("All fields are required!");
            return;
        }

        if (!editingId) {
            const res = await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: parseFloat(amount), type: type, category: category, description: description })
            });
            const transaction = await res.json();
            setTransaction(prev => [...prev, transaction.transaction]);
        } else {
            const res = await fetch(`http://localhost:5000/api/transactions/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: parseFloat(amount), type: type, description: description })
            });
            const updatedTransaction = await res.json();
            const updatedArray = transaction.map((t => t._id === editingId ? updatedTransaction.updated : t))
            setTransaction(updatedArray)
            setEditingId(null);
        }

        setAmount('');
        setDescription('');
        setCategory('Food')
        setType('expense');
    }
    function Description(e) {
        setDescription(e.target.value)
    }

    function Amount(e) {
        setAmount(e.target.value)
    }
    function Type(e) {
        setType(e.target.value)
    }
    function Category(e) {
        setCategory(e.target.value)
    }
    async function removeTransaction(id) {
        const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        // const deletedTransaction=await res.json();
        // const Tid=deletedTransaction.id;
        setTransaction(prev => prev.filter(t => t._id !== id))
    }


    //repeat form filling
    useEffect(() => {
        const refillTransaction = transaction.find(t => t._id === editingId);  //use find for single match, use filter for multiple matches
        if (refillTransaction) {
            setAmount(refillTransaction.amount);
            setDescription(refillTransaction.description)
            setType(refillTransaction.type)
        }
    }, [editingId])


    return (
        <main className=" bg-gray-100 flex flex-col items-center p-4 sm:p-6 gap-6">

            <h1 className="font-bold text-2xl sm:text-3xl">Expense Tracker</h1>
            {/*summary section */}
            <Summary transaction={transaction} />

            {/* Form + Transaction List Container */}
            <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-6">

                {/* Transaction Form */}
                <form onSubmit={submitTransaction} className="w-full lg:w-1/2 bg-white p-6 rounded-2xl shadow-lg space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">{editingId ? "Edit Transaction" : "Add Transaction"}</h2>

                    <div className="flex flex-wrap gap-4">
                        {/* Amount */}
                        <input type="number" min="10" placeholder="Amount"
                            value={amount} onChange={Amount}
                            className="flex-1 min-w-[120px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-700" />

                        {/* Type */}
                        <select
                            value={type}
                            onChange={Type}
                            className="flex-1 min-w-[120px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>

                        {/* Category */}
                        <select
                            value={category}
                            onChange={Category}
                            className="flex-1 min-w-[120px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={Description}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-700"
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                        {editingId ? "Update" : "Add"}
                    </button>
                </form>


                {/* Transaction List */}
                <div className="w-full lg:w-1/2 bg-white p-4 rounded-lg shadow-md ">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Transactions</h2>
                    {transaction.length === 0 ? (
                        <p className="text-sm text-gray-500">No transactions yet.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {transaction.map(item => (
                                <div key={item._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 border-b last:border-b-0 rounded-lg hover:bg-gray-50 transition">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                                        <p className="text-sm font-medium text-gray-800">{item.description}</p>
                                        <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                                        <p className="text-sm text-gray-600">{item.category}</p>
                                    </div>
                                    <div className={`text-sm font-semibold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        NPR {item.amount}
                                    </div>
                                    <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200" onClick={() => {
                                        if (editingId === item._id) {
                                            setEditingId(null);
                                            setAmount('');
                                            setDescription('');
                                            setType('expense');
                                        } else {
                                            setEditingId(item._id);
                                        }
                                    }}>{editingId === item._id ? 'cancel' : 'edit'}</button>
                                    <button
                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
                                        onClick={() => removeTransaction(item._id)}>
                                        Remove
                                    </button>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            <div className="w-full">
                <Piecharts transaction={transaction} />
            </div>
        </main>

    )
}