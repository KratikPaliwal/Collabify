import React, { useState } from "react";
import { FaUser, FaBell } from "react-icons/fa";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../src/AuthContext.jsx";

function Header() {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="h-20 w-full bg-white shadow-md flex items-center justify-between px-6 fixed top-0 left-0 z-50">
      <div className="flex gap-6">
        <h1 className="text-xl font-bold text-blue-600">Collabify</h1>
        <input
          type="text"
          placeholder="Search"
          className="bg-blue-100 text-sm rounded-md px-3 py-1 w-64 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-black"
        />
      </div>

      <div className="flex gap-6 items-center text-gray-700">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-medium" : "text-black"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/project"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-medium" : "text-black"
          }
        >
          Project
        </NavLink>

        <div className="relative inline-block">
          <div className="hover:text-blue-500 hover:bg-gray-100 hover:scale-105 transition rounded-full p-2 relative">
            <FaBell className="text-[20px]" />
          </div>
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-[6px] py-[1px] rounded-full">
            1
          </span>
        </div>

        {/* Conditional Rendering: Profile or Login/Signup */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="hover:bg-gray-100 rounded-full p-2 transition"
            >
              <FaUser className="text-[20px]" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
  <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-2 z-10 border border-gray-200">
    {/* User Info */}
    <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
      <p className="font-medium">{user.name}</p>
      <p className="text-xs text-gray-500 truncate">{user.email}</p>
    </div>

    {/* Menu Items */}
    <Link
      to="/user"
      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm"
    >
      Profile
    </Link>
    <Link
      to="/settings"
      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm"
    >
      Settings
    </Link>
    <button
      onClick={logout}
      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm"
    >
      Logout
    </button>
  </div>
)}
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;