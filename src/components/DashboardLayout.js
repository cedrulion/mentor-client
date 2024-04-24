import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaBars, } from 'react-icons/fa';


const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear localStorage on logout
    navigate('/signin'); // Redirect to signin page
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-300 to-orange-200 ">
      {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}

      <div className={`flex-grow ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
      <div className="fixed top-0  p-2">
          <button className="text-black focus:outline-none text-2xl" onClick={toggleSidebar}>
            <FaBars  />
          </button>
        </div>
        <div className=''>
          <Outlet/>
          </div>
      
      </div>
      
  
    </div>
  );
};

export default DashboardLayout;
