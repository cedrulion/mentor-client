import React, { useState } from 'react';
import { Outlet} from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [showLogoutModal, setShowLogoutModal] = useState(false);




  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const toggleDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

  return (
    <div className="font-poppins flex min-h-screen bg-gradient-to-r from-gray-300 to-orange-200 ">
      {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}

      <div className={`flex-grow ${isSidebarOpen ? 'ml-56' : 'ml-0'}`}>
        <div className="fixed top-0 m-2">
          <button className="text-black focus:outline-none text-lg" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        <div className='font-poppins'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
