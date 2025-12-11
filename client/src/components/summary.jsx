import { useMemo } from "react";
export default function Summary(props){
        const totalExpenses=useMemo(()=> {
            console.log('rendered total expenses');
            const ExpenseTransactions = props.transaction.filter(t => t.type === 'expense');
            const totalEx = ExpenseTransactions.reduce((accumulator, current) => {  //t is each element
                return accumulator + current.amount;
            }, 0)
            return totalEx;
        },[props.transaction])
    
        const totalIncome=useMemo(()=> {
            const IncomeTransactions = props.transaction.filter(t => t.type === 'income');
            const totalIn = IncomeTransactions.reduce((accumulator, current) => {
                return accumulator + current.amount;
            }, 0)
            return totalIn;
        },[props.transaction])

        const balance=useMemo(()=>{
            return totalIncome-totalExpenses;
        },[totalExpenses,totalIncome])
    return ( 
        // summary section
           <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
                {/* Total Income */}
                <div className="bg-white rounded-xl shadow p-4 flex flex-col border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm font-medium">Total Income</p>
                    <h2 className="text-2xl font-bold text-green-600 mt-1">
                        NPR {totalIncome}
                    </h2>
                </div>

                {/* Total Expenses */}
                <div className="bg-white rounded-xl shadow p-4 flex flex-col border-l-4 border-red-500">
                    <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
                    <h2 className="text-2xl font-bold text-red-600 mt-1">
                        NPR {totalExpenses}
                    </h2>
                </div>

                {/* Balance */}
                <div className="bg-white rounded-xl shadow p-4 flex flex-col border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm font-medium">Balance</p>
                    <h2 className={`text-2xl font-bold mt-1 ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                        NPR {balance}
                    </h2>
                </div>
            </section>
    )
}