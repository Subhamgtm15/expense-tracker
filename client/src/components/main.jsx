import { useState, useEffect } from "react"
export default function Main() {
    const [transaction, setTransaction] = useState([]);
    const [amount, setAmount] = useState('10');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense')
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/transactions')
            .then(res => res.json())
            .then(data => setTransaction(data));
    }, []);

    async function submitTransaction(e) {
        e.preventDefault();
        if (!editingId) {
            const res = await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(amount), type: type, description: description })
            });
            const transaction = await res.json();
            setTransaction(prev => [...prev, transaction.transaction]);
        } else {
            const res = await fetch(`http://localhost:5000/api/transactions/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(amount), type: type, description: description })
            });
            const updatedTransaction = await res.json();
            const updatedArray = transaction.map((t => t._id === editingId ? updatedTransaction.updated : t))
            setTransaction(updatedArray)
            setEditingId(null);
        }

        setAmount('');
        setDescription('');
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

    async function removeTransaction(id) {
        const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
            method: 'DELETE',
        });
        // const deletedTransaction=await res.json();
        // const Tid=deletedTransaction.id;
        setTransaction(prev => prev.filter(t => t._id !== id))
    }

    function totalExpenses() {
        const ExpenseTransactions = transaction.filter(t => t.type === 'expense');
        const totalEx = ExpenseTransactions.reduce((accumulator, current) => {  //t is each element
            return accumulator + current.amount;
        }, 0)
        return totalEx;
    }

    function totalIncome() {
        const IncomeTransactions = transaction.filter(t => t.type === 'income');
        const totalIn = IncomeTransactions.reduce((accumulator, current) => {
            return accumulator + current.amount;
        }, 0)
        return totalIn;
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

            {/* Summary Section */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
                {/* Total Income */}
                <div className="bg-white rounded-xl shadow p-4 flex flex-col border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm font-medium">Total Income</p>
                    <h2 className="text-2xl font-bold text-green-600 mt-1">
                        NPR {totalIncome()}
                    </h2>
                </div>

                {/* Total Expenses */}
                <div className="bg-white rounded-xl shadow p-4 flex flex-col border-l-4 border-red-500">
                    <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
                    <h2 className="text-2xl font-bold text-red-600 mt-1">
                        NPR {totalExpenses()}
                    </h2>
                </div>

                {/* Balance */}
                <div className="bg-white rounded-xl shadow p-4 flex flex-col border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm font-medium">Balance</p>
                    <h2 className={`text-2xl font-bold mt-1 ${totalIncome() - totalExpenses() >= 0 ? "text-blue-600" : "text-red-600"}`}>
                        NPR {totalIncome() - totalExpenses()}
                    </h2>
                </div>
            </section>

            {/* Form + Transaction List Container */}
            <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-6">

                {/* Transaction Form */}
                <form onSubmit={submitTransaction} className="flex-1 bg-white p-6 rounded-lg shadow-md space-y-4">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Add Transaction</h2>
                    <input type="number" min="10" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter Amount" value={amount} onChange={Amount} />
                    <select onChange={Type} value={type} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value='expense'>expense</option>
                        <option value='income'>income</option>
                    </select>
                    <input type="text" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Description" value={description} onChange={Description} />
                    <button type='submit' className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">{editingId ? "Update" : "Add"}</button>
                </form>

                {/* Transaction List */}
                <div className="flex-1 bg-white p-4 rounded-lg shadow-md max-h-[500px] ">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Transactions</h2>
                    {transaction.length === 0 ? (
                        <p className="text-sm text-gray-500">No transactions yet.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {transaction.map(item => (
                                <div key={item._id} className="flex justify-between items-center py-2 px-2 border-b last:border-b-0 rounded hover:bg-gray-50 transition">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{item.description}</p>
                                        <p className="text-xs text-gray-500">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
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
                                    }}>{editingId===item._id ? 'cancel' : 'edit'}</button>
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
        </main>

    )
}