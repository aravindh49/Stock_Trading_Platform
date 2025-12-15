import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { format } from 'date-fns'; // We might need to install date-fns or just use js Date

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.get('transactions/');
                setTransactions(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) return <div className="p-4">Loading History...</div>;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Navbar />
            <div className="container mx-auto p-6">
                <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-3">Date</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Stock</th>
                                <th className="p-3">Quantity</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">No transactions found</td>
                                </tr>
                            ) : (
                                transactions.map(t => (
                                    <tr key={t.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{new Date(t.timestamp).toLocaleString()}</td>
                                        <td className={`p-3 font-bold ${t.transaction_type === 'BUY' ? 'text-green-600' : 'text-red-500'}`}>
                                            {t.transaction_type}
                                        </td>
                                        <td className="p-3">{t.stock_symbol}</td>
                                        <td className="p-3">{t.quantity}</td>
                                        <td className="p-3">${t.price}</td>
                                        <td className="p-3 font-medium">${(parseFloat(t.price) * t.quantity).toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
