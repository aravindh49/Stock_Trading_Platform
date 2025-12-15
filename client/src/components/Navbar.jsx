import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet, History, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-blue-600">TradePlat</h1>
                {user && (
                    <div className="flex space-x-4">
                        <Link to="/" className="flex items-center text-gray-700 hover:text-blue-600">
                            <LayoutDashboard className="w-5 h-5 mr-1" /> Dashboard
                        </Link>
                        <Link to="/transactions" className="flex items-center text-gray-700 hover:text-blue-600">
                            <History className="w-5 h-5 mr-1" /> History
                        </Link>
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-4">
                {user && (
                    <>
                        <div className="flex items-center text-gray-700 font-medium">
                            <Wallet className="w-5 h-5 mr-1 text-green-600" />
                            <span>${user.wallet_balance}</span>
                        </div>
                        <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800">
                            <LogOut className="w-5 h-5 mr-1" /> Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
