import React from "react";
import { FaUser } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import {NavLink,Link} from 'react-router-dom'

function Header() {
  return (
    <div className="h-20 w-full bg-white shadow-md flex items-center justify-between px-6 left-0 top-0 fixed">
      <div className="flex gap-6">
        <h1 className="text-xl font-bold text-blue-600">Collabify</h1>
        <input
          type="text"
          placeholder="Search"
          className="bg-blue-100 text-sm rounded-md px-3 py-1 w-64 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-black"
        />
      </div>
      <div className="flex gap-6 text-gray-700">
        <NavLink to='/' className={({isActive})=>{
          return `bg-white ${isActive ?'text-blue-600':'text-black'}`
        }}>Home</NavLink>
        <NavLink to='/project' className={({isActive})=>{
          return `bg-white ${isActive ?'text-blue-600':'text-black'}`
        }}>Project</NavLink>

        <div className="relative inline-block">
          <div className="hover:text-blue-500 hover:bg-gray-100 hover:scale-105 transition rounded-full p-2 relative bottom-0 ">
            <FaBell className="text-[20px]" />
          </div>
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-[6px] py-[1px] rounded-full">
            1
          </span>
        </div>
        <NavLink to='/user' className={({isActive})=>{
          return `bg-white ${isActive ?'text-blue-600':'text-black'}`
        }}><FaUser className="text-[20px]" /></NavLink>
        <div></div>
      </div>
    </div>
  );
}

export default Header;
