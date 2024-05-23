import React from 'react'

import { Link, useLocation } from 'react-router-dom';

function Forum() {
    const location = useLocation();
    
  return (
   
         <div className="p-2 bg-gradient-to-r from-slate-300 to-orange-200">
 
        <div className="text-xl font-bold py-2 px-4 rounded text-center">
            Forum
          </div>
          <div className='bg-slate-200 hidden sticky top-0 z-10 md:flex justify-end shadow-lg pt-3'>
      <div className='flex justify-between'>
        <ul className='capitalize md:flex text-[18px] space-x-9 ml-24 pt-3'>
          <li className={`px-6 rounded-lg font-Ubuntu ${location.pathname === '/dashboard/uresource' ? 'border-b-4 border-red-500' : ''}`}>
            <Link to="/dashboard/uresource">Resource</Link>
          </li>
          <li className={`px-6 rounded-lg font-Ubuntu ${location.pathname === '/dashboard/Discussion' ? 'border-b-4 border-red-500' : ''}`}>
            <Link to="/dashboard/Discussion">Discussions</Link>
          </li>
          <li className={`px-6 rounded-lg font-Ubuntu ${location.pathname === '/dashboard/question' ? 'border-b-4 border-red-500' : ''}`}>
            <Link to='/dashboard/question'>Questions</Link>
          </li>
        </ul>
      </div>
    </div>


      </div>
  
    
  )
}

export default Forum
