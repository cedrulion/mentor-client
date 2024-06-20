import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
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
        const mentorsResponse = await axios.get('http://localhost:5000/api/detail/user/details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentors(mentorsResponse.data);

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
    return <div className="min-h-screen bg-gradient-to-r from-gray-300 to-orange-200 flex items-center justify-center"><img src={LOGO} alt="logo" /></div>;
  }

  const getRequestStatus = (mentorId) => {
    const request = requests.find((req) => req.mentorId === mentorId);
    return request ? request.status : null;
  };

  const renderStars = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <FontAwesomeIcon key={index} icon={faStar} size="1x" color="orange" className="ml-1" />
    ));
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-gray-300 to-orange-200">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <div></div>
        <div className="text-2xl font-bold text-gray-700 ml-6">Find Mentors</div>
        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search by study field..."
            className="border rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute top-2.5 right-3 fill-current w-4 h-4 text-gray-500" />
        </div>
      </div>

      {filteredMentors.length === 0 ? (
        <div className="text-center text-white font-semibold">No mentors available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMentors.map((mentor) => (
            <div key={mentor._id} className="bg-gradient-to-r from-gray-200 to-orange-100 rounded-lg shadow-lg overflow-hidden p-4">
              <div className="p-4 bg-gradient-to-r from-gray-200 to-orange-100 rounded-md shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white rounded-full mr-4"></div>
                  <div className="text-lg font-semibold text-gray-800">
                    {mentor.firstName} {mentor.lastName}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 mb-2">{mentor.city}, {mentor.country}</div>
                  <div className="text-gray-500 mb-2">{mentor.studyField}, {mentor.school}</div>
                  <div className="border-t border-gray-300 my-2"></div>
                  <div className="flex justify-center items-center mb-2">
                    {renderStars(mentor.review)}
                    <span className="ml-2 text-gray-600">({mentor.review} reviews)</span>
                  </div>
                  {getRequestStatus(mentor._id) === 'accepted' && (
                    <FontAwesomeIcon icon={faStar} size="1x" color="orange" className="ml-2" />
                  )}
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
