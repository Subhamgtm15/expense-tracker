import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMemo } from 'react';

export default function Piecharts(props) {
    const chartData = useMemo(() => {
        console.log('Chart recalculating...');

        const ExpenseTransactions = props.transaction.filter(t => t.type === 'expense');

        const grouped = ExpenseTransactions.reduce((acc, curr) => {
            if (!acc[curr.category]) {
                acc[curr.category] = 0;
            }
            acc[curr.category] += curr.amount;
            return acc;
        }, {});

        return Object.entries(grouped).map(([category, amount]) => ({
            category,
            amount
        }));
    }, [props.transaction]);

    const COLORS = [
        "#4CAF50", // Green
        "#FF5722", // Red-Orange
        "#2196F3", // Blue
        "#FFC107", // Amber / Yellow
        "#9C27B0", // Purple
        "#FF9800", // Orange
        "#00BCD4", // Cyan
        "#E91E63", // Pink
        "#8BC34A", // Light Green
        "#3F51B5", // Indigo
    ];


    if (!chartData || chartData.length === 0) {
        return <div className="text-gray-500 text-center p-4">No expense data to display</div>;
    }

    return (
        <div className="w-full max-w-full md:max-w-2xl mx-auto bg-white p-4 md:p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Breakdown</h2>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        label={(entry) => `${entry.category}: NPR ${entry.amount}`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `NPR ${value}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}