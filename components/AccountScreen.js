import React from 'react';
import { X, MessageSquare, Bug, LogOut } from 'lucide-react';
import Link from 'next/link';

const AccountScreen = () => {
  const menuItems = [
    { title: 'Give feedback', icon: MessageSquare },
    { title: 'Report a bug', icon: Bug },
    { title: 'Log out', icon: LogOut },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <div className="w-full px-4 py-2 flex justify-end items-center border-b border-gray-800">
        <button
          onClick={() => window.history.back()}
          className="text-white hover:bg-gray-800 h-10 w-10 flex items-center justify-center rounded-full"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold px-4 mt-12 mb-6">Account</h1>

      {/* Menu Items */}
      <div className="flex-1 px-4">
        {menuItems.map((item, index) => (
          <div key={index} className="flex items-center p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800">
            <item.icon className="h-6 w-6 mr-4" />
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountScreen;