import { useState, useEffect } from "react"
export default function Main() {
    const [transaction, setTransaction] = useState([]);
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [select, setSelect] = useState('expense')

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
            body: JSON.stringify({ amount: parseFloat(price), type: select, description: description })
        });
        const transaction = await res.json();
        setTransaction(prev => [...prev, transaction.transaction]);
        setPrice('');
        setDescription('');
        setSelect('expense');
    }
    function Description(e) {
        setDescription(e.target.value)
    }

    function Price(e) {
        setPrice(e.target.value)
    }
    function Select(e) {
        setSelect(e.target.value)
    }
    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <form onSubmit={submitTransaction} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Add Transaction</h2>
                <input type="number" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter Price" value={price} onChange={Price} />
                <select onChange={Select} value={select} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
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
                            </div>
                        ))
                        }
                    </div>
                )}
            </div>
        </main>
    )
}