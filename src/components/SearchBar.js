import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaSearch } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import LOGO from "../Assets/loading.gif";

const SearchBar = () => {
  const [mentors, setMentors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch mentors
        const mentorsResponse = await axios.get('http://localhost:5000/api/detail/user/details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentors(mentorsResponse.data);

        // Fetch mentor requests
        const requestsResponse = await axios.get('http://localhost:5000/api/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(requestsResponse.data);

      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized access. Redirect to login page.');
        } else {
          console.error('Error fetching data:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMentors = mentors.filter((mentor) =>
    mentor.studyField.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-screen  bg-gradient-to-r from-gray-300 to-orange-200 flex items-center justify-center"><img src={LOGO} alt="logo"  /></div>;
  }

  const getRequestStatus = (mentorId) => {
    const request = requests.find((req) => req.mentorId === mentorId);
    return request ? request.status : null;
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-r from-gray-500 to-orange-300">
      <div className="flex bg-gray-200 justify-between mb-4 gap-32">
        <div>
         
        </div>
        <div className="text-2xl font-bold py-2 px-4 rounded">Find Mentors</div>
        <div className="relative">
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <FaSearch className="fill-current w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by study field..."
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {filteredMentors.length === 0 ? (
        <div className="text-center text-gray-800 font-semibold">No mentors available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMentors.map((mentor) => (
            <div key={mentor._id} className="bg-gray-200 rounded-md shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {mentor.firstName} {mentor.lastName}
                  {getRequestStatus(mentor._id) === 'accepted' && (
                    <FontAwesomeIcon icon={faStar} size="1x" color="orange" className="ml-2" />
                  )}
                </h3>
                <div className="bg-gray-200 py-2 px-3 rounded-md">
                  <h1>{mentor.city}, {mentor.country}</h1>
                  <h1>{mentor.studyField}, {mentor.school}</h1>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
