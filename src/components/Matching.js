import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { FaUserPlus, FaSearch } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup , faUsers, faSearch} from '@fortawesome/free-solid-svg-icons';

function Matching() {
  const [isEnabled, setIsEnabled] = useState(false);
  const location = useLocation();

  // Fetch initial status on component mount
  useEffect(() => {
    fetchStatus();
  }, []);

  // Function to fetch status from backend
  const fetchStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/status'); 
      setIsEnabled(response.data.isEnabled);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  // Function to enable status
  const enableStatus = async () => {
    try {
      await axios.post('http://localhost:5000/api/status/enable'); 
      setIsEnabled(true);
    } catch (error) {
      console.error('Error enabling status:', error);
    }
  };

  // Function to disable status
  const disableStatus = async () => {
    try {
      await axios.post('http://localhost:5000/api/status/disable');
      setIsEnabled(false);
    } catch (error) {
      console.error('Error disabling status:', error);
    }
  };

  return (
    <div className="p-9 min-h-screen bg-gradient-to-r from-gray-500 to-orange-200 ">
      <div className=" bg-transparent  flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        
          <button className=" font-bold py-2 px-4 rounded ml-9">
            <FaUserPlus className="fill-current text-2xl mr-1 text-red-800" />
          </button>
        <div className="text-xl font-bold py-2 px-4 rounded">
           Matching
          </div>
        <div className='relative'>
        
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <FaSearch className="fill-current w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
      
      <div className="flex mb-4 gap-9 ml-6">
        {isEnabled && (
          <>
            <div className='bg-gray-200 hover:bg-orange-600 hover:text-white  py-2 px-2 rounded-md'>
              <FontAwesomeIcon icon={faUsers} size="sm" className='fill-current text-xl mx-auto flex items-center justify-center' />
              <button className={`font-bold mb-2 ${location.pathname === '/dashboard/search' ? 'border-b-4 border-red-500' : ''}`}>
                <Link to="/dashboard/search">Suggestion</Link>
              </button>
            </div>
            <div className='bg-gray-200 hover:bg-orange-600 hover:text-white  py-2 px-2 rounded-md'>
              <FontAwesomeIcon icon={faUserGroup} size="sm" className='fill-current text-xl mx-auto flex items-center justify-center' />
              <button className={` font-bold mb-2 ${location.pathname === '/dashboard/Request' ? 'border-b-4 border-red-500' : ''}`}>
                <Link to="/dashboard/Request">Requests</Link>
              </button>
            </div>
            <div className='bg-gray-200 hover:bg-orange-600 hover:text-white py-2 px-2 rounded-md'>
              <FaUserPlus className="fill-current text-xl mx-auto flex items-center justify-center" />
              <button className={` font-bold mb-2 ${location.pathname === '/dashboard/Close' ? 'border-b-4 border-red-500' : ''}`}>
                <Link to="/dashboard/Close">Close to you</Link>
              </button>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-between gap-9 ml-3 mt-9">
        <div className='bg-gray-200 pt-3  mb-3'>
         <h1 className='text-center font-bold text-xl'>Discover potential mentors</h1>
         <div className='flex justify-center items-center gap-4 p-3'>
            <FontAwesomeIcon icon={faUsers} size="2x" color="red" />
            <FontAwesomeIcon icon={faSearch} size="1x" className='absolute ml-6 text-6xl text-white opacity-90 mt-9'/>
         </div>
         <div className='flex justify-between gap-9 p-16'>
           <button className="text-xl py-2 px-3 font-bold  text-orange-600  bg-gray-100 rounded-lg  hover:bg-orange-600 hover:text-white">Learn More </button>
           {isEnabled ? (
              <button
                className="text-xl py-2 px-3  font-bold  bg-orange-600 text-white rounded-lg  hover:bg-gray-100 hover:text-orange-600"
                onClick={disableStatus}
              >
                Disable
              </button>
            ) : (
              <button
                className="text-xl py-2 px-3  font-bold  bg-orange-600 text-white rounded-lg  hover:bg-gray-100 hover:text-orange-600"
                onClick={enableStatus}
              >
                Enable
              </button>
            )}
         </div>
        </div>
        <div className='m-9'>
          <h1 className='text-center font-bold text-xl px-3 py-3'>Verification</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam perspiciatis exercitationem eveniet ducimus consequatur dolore sint ipsam, sed placeat. Dolorum pariatur voluptates eaque consequuntur delectus, ea modi aliquid molestiae non.</p>
        </div>
      </div>
    </div>
  );
}

export default Matching;
