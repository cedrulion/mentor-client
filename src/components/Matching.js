import React from 'react'
import { FaUserPlus, FaSearch } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup , faUsers, faSearch} from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

function Matching() {
  const location = useLocation();
  return (
<div className="max-w-full bg-gradient-to-r from-gray-500 to-orange-200 font-serif">
      <div className=" bg-transparent  flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        
          <button className=" font-bold py-2 px-4 rounded ">
            <FaUserPlus className="fill-current text-2xl mr-1 text-red-800" />
          </button>
        <div className="text-2xl font-bold py-2 px-4 rounded">
           Matching
          </div>
        <div className='relative'>
        
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <FaSearch className="fill-current w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
      
      <div className="flex mb-4 gap-9">
      

        <div className='bg-gray-200 hover:bg-orange-600 hover:text-white  py-2 px-3 rounded-md'>
        <FontAwesomeIcon icon={faUsers} size="lg" className='fill-current text-3xl mx-auto flex items-center justify-center' />
             <button className={`text-2xl font-bold mb-4 ${location.pathname === '/dashboard/search' ? 'border-b-4 border-red-500' : ''}`}>
             <Link to="/dashboard/search">Suggestion</Link></button>
        </div>
     
      <div className='bg-gray-200 hover:bg-orange-600 hover:text-white  py-2 px-3 rounded-md'>
      <FontAwesomeIcon icon={faUserGroup} size="lg" className='fill-current text-3xl mx-auto flex items-center justify-center' />
        <button className={`text-2xl font-bold mb-4 ${location.pathname === '/dashboard/Request' ? 'border-b-4 border-red-500' : ''}`}>
        <Link to="/dashboard/Request">Requests</Link></button>
      </div>
      <div className='bg-gray-200 hover:bg-orange-600 hover:text-white py-2 px-3 rounded-md'>
      <FaUserPlus className="fill-current text-3xl mx-auto flex items-center justify-center" />
        <button className="text-xl font-bold mb-4">Close to you</button>
      </div>
      </div>
      <div className="flex justify-between gap-9">
        <div className='bg-gray-200 pt-6'>
         <h1 className='text-center font-bold text-xl'>Discover potential mentors</h1>
         <div className='flex justify-center items-center gap-4 p-8'>
        <FontAwesomeIcon icon={faUsers} size="5x" color="red" />
        <FontAwesomeIcon icon={faSearch} size="2x" className='absolute ml-6 text-6xl text-white opacity-90 mt-9'/>
      </div>
         <div className='flex justify-between gap-9 p-32'>
         <button className="text-xl py-2 px-6 font-bold  text-orange-600  bg-gray-100 rounded-lg  hover:bg-orange-600 hover:text-white">Learn More </button>
         <button className="text-xl py-2 px-6  font-bold  bg-orange-600 text-white rounded-lg  hover:bg-gray-100 hover:text-orange-600">Enable</button>
         </div>
        </div>
        <div className=''>
        <h1 className='text-center font-bold text-xl px-3 py-3'>Verfication</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam perspiciatis exercitationem eveniet ducimus consequatur dolore sint ipsam, sed placeat. Dolorum pariatur voluptates eaque consequuntur delectus, ea modi aliquid molestiae non.</p>
        </div>

 
      </div>
    </div>
  )
}

export default Matching
