import { useState, useEffect } from "react"
import Piecharts from "./Piecharts";
import Summary from "./summary";
import { apiRequest } from "../api/api";
export default function Main({ onLogout }) {
    console.log('rendered');
    const [transaction, setTransaction] = useState([]);
    const [amount, setAmount] = useState('10');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense')
    const [editingId, setEditingId] = useState(null);
    const [category, setCategory] = useState('Food')
    const categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'];

    //get username from token
    const [menuOpen, setMenuOpen] = useState(false);

    let token = localStorage.getItem('token');

    let username = "User";

    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        username = payload.username;
    }

    //get 
    useEffect(() => {
        apiRequest("GET", "/api/transactions", null, onLogout)
            .then(data => {
                if (data) {
                    setTransaction(data);
                }
            });
    }, []);


    async function submitTransaction(e) {
        e.preventDefault();
        if (!amount || !category || !type || !description) {
            alert("All fields are required!");
            return;
        }
        // const res = await fetch('http://localhost:5000/api/transactions', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${token}`
        //         },
        //         body: JSON.stringify({ amount: parseFloat(amount), type: type, category: category, description: description })
        //     });
        //     if (handleAuthFail(res)) return;
        //     const data = await res.json();

        if (!editingId) {
            const data = await apiRequest("POST", "/api/transactions", { amount: parseFloat(amount), type: type, category: category, description: description }, onLogout);

            setTransaction(prev => [...prev, data.transaction]);
        } else {
            const data = await apiRequest("PUT", `/api/transactions/${editingId}`, { amount: parseFloat(amount), type: type, category: category, description: description }, onLogout);

            setTransaction(transaction.map(t => t._id === editingId ? data.updated : t));
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

    //delete
    async function removeTransaction(id) {
        apiRequest("DELETE", `/api/transactions/${id}`, null, onLogout)
        // const deletedTransaction=await res.json();
        // const Tid=deletedTransaction.id;

        setTransaction(prev => prev.filter(t => t._id !== id));
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
            <div className="flex justify-between items-center relative w-full">
                <h1 className="font-bold text-2xl sm:text-3xl">Expense Tracker</h1>

                <div className="relative">
                    {/* Avatar button */}
                    <button
                        onClick={() => setMenuOpen(prev => !prev)}
                        className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center"
                    >
                        {username?.[0]?.toUpperCase() || "U"}
                    </button>

                    {/* Dropdown */}
                    {menuOpen && (
                        <div className="absolute right-0 mt-0 w-48 bg-white rounded-xl shadow-lg p-3 z-50">
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-semibold">{username}</span>
                            </p>

                            <button
                                onClick={onLogout}
                                className="w-full text-left text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>


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
