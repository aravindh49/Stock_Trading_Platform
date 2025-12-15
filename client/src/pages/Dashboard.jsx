import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
    const [stocks, setStocks] = useState([]);
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext); // To trigger re-render on balance update usually, but we might reload.

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [transactionType, setTransactionType] = useState('BUY'); // BUY or SELL
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        try {
            const [stocksRes, portfolioRes] = await Promise.all([
                api.get('stocks/'),
                api.get('portfolio/')
            ]);
            setStocks(stocksRes.data);
            setPortfolio(portfolioRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Reload on mount

    const openModal = (stock, type) => {
        setSelectedStock(stock);
        setTransactionType(type);
        setQuantity(1);
        setMessage('');
        setModalOpen(true);
    };

    const handleTransaction = async () => {
        try {
            const endpoint = transactionType === 'BUY' ? 'trade/buy/' : 'trade/sell/';
            const payload = {
                stock_symbol: selectedStock.symbol || selectedStock.stock_symbol,
                quantity: parseInt(quantity)
            };

            const res = await api.post(endpoint, payload);
            setMessage(res.data.message);

            // Reload data after brief delay or update local state
            setTimeout(() => {
                setModalOpen(false);
                fetchData();
                window.location.reload(); // Simple way to refresh user balance in context
            }, 1000);

        } catch (err) {
            setMessage(err.response?.data?.error || 'Transaction failed');
        }
    };

    const pieData = portfolio.map(item => ({
        name: item.stock_symbol,
        value: parseFloat(item.quantity) * parseFloat(item.current_price)
    }));

    if (loading) return <div className="p-4">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Navbar />

            <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Portfolio Section */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">My Portfolio</h2>
                    {portfolio.length === 0 ? (
                        <p>No stocks owned yet.</p>
                    ) : (
                        <>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="p-2">Stock</th>
                                            <th className="p-2">Qty</th>
                                            <th className="p-2">Avg Price</th>
                                            <th className="p-2">Current</th>
                                            <th className="p-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {portfolio.map(item => (
                                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                                <td className="p-2 font-medium">{item.stock_symbol}</td>
                                                <td className="p-2">{item.quantity}</td>
                                                <td className="p-2">${item.average_price}</td>
                                                <td className="p-2 text-green-600">${item.current_price}</td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => openModal(item, 'SELL')}
                                                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                                    >
                                                        Sell
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                {/* Market Section */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">Market Stocks</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Symbol</th>
                                <th className="p-2">Company</th>
                                <th className="p-2">Price</th>
                                <th className="p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map(stock => (
                                <tr key={stock.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2 font-bold">{stock.symbol}</td>
                                    <td className="p-2">{stock.name}</td>
                                    <td className="p-2 text-green-600">${stock.current_price}</td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => openModal(stock, 'BUY')}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                        >
                                            Buy
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Buy/Sell Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded p-6 w-full max-w-sm">
                        <h3 className="text-xl font-bold mb-4">
                            {transactionType} {selectedStock?.symbol || selectedStock?.stock_symbol}
                        </h3>

                        {message && (
                            <div className={`p-2 mb-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full p-2 border rounded"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>

                        <div className="mb-4 text-sm text-gray-500">
                            Total: ${(parseFloat(selectedStock?.current_price || selectedStock?.price) * quantity).toFixed(2)}
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTransaction}
                                className={`px-4 py-2 rounded text-white ${transactionType === 'BUY' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-500 hover:bg-red-600'}`}
                            >
                                Confirm {transactionType}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
