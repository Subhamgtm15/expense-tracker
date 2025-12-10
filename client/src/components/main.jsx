import { useState, useEffect } from "react"
export default function Main() {
    const [transaction, setTransaction] = useState([]);
    const [amount, setAmount] = useState('10');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense')

    useEffect(() => {
        fetch('http://localhost:5000/api/transactions')
            .then(res => res.json())
            .then(data => setTransaction(data));
    }, []);

    async function submitTransaction(e) {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseFloat(amount), type: type, description: description })
        });
        const transaction = await res.json();
        setTransaction(prev => [...prev, transaction.transaction]);
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

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center p-6 gap-4">
            <h1 className="font-bold text-2xl">Finance Tracker</h1>
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mt-6">

                <div className="bg-white rounded-xl shadow p-4 flex flex-col border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm font-medium">Total Income</p>
                    <h2 className="text-2xl font-bold text-green-600 mt-1">
                        NPR {totalIncome()}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-4 flex flex-col border-l-4 border-red-500">
                    <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
                    <h2 className="text-2xl font-bold text-red-600 mt-1">
                        NPR {totalExpenses()}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-4 flex flex-col border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm font-medium">Balance</p>
                    <h2 className={`text-2xl font-bold mt-1 ${totalIncome() - totalExpenses() >= 0
                        ? "text-blue-600"
                        : "text-red-600"
                        }`}>
                        NPR {totalIncome() - totalExpenses()}
                    </h2>
                </div>

            </section>


            <form onSubmit={submitTransaction} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Add Transaction</h2>
                <input type="number" min="10" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter Amount" value={amount} onChange={Amount} />
                <select onChange={Type} value={type} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value='expense'>expense</option>
                    <option value='income'>income</option>
                </select>
                <input type="text" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="description" value={description} onChange={Description} />
                <button type='submit' className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">Add</button>
            </form>

            {/* show transaction */}
            <div className="mt-6 w-full max-w-md bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Transactions</h2>
                {transaction.length === 0 ? (
                    <p className="text-sm text-gray-500">No transactions yet.</p>
                ) : (
                    <div>
                        {transaction.map((item, index) => (
                            <div key={item._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{item.description}</p>
                                    <p className="text-xs text-gray-500">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
                                </div>
                                <div className={`text-sm font-semibold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.amount}
                                </div>
                                <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200" onClick={() => removeTransaction(item._id)}>remove</button>
                            </div>
                        ))
                        }
                    </div>
                )}
            </div>
        </main>
    )
}