import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaSearch, FaUser, FaArrowLeft } from 'react-icons/fa';
import LOGO from "../Assets/loading.gif";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex justify-center mb-4">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            onClick={() => setRating(starValue)}
            className={`text-3xl ${starValue <= rating ? "text-yellow-500" : "text-gray-300"}`}
          >
            &#9733;
          </button>
        );
      })}
    </div>
  );
};

const Close = () => {
  const [classType, setClassType] = useState('');
  const [classTime, setClassTime] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [ignoredMentors, setIgnoredMentors] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0); // State for star rating
  const [userExperiences, setUserExperiences] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null); // State for logged-in user's details
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get('https://mentor-server-qd42.onrender.com/api/detail/getdetail', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoggedInUser(userResponse.data);
      
        const mentorsResponse = await axios.get('https://mentor-server-qd42.onrender.com/api/detail/user/details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentors(mentorsResponse.data);
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

    fetchUserData();
  }, [token]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !ignoredMentors.includes(mentor.user) &&
      loggedInUser && mentor.city === loggedInUser.city // Matching studyField
  );

  const handleReviewSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/detail/mentors/${selectedUser.user}/review`,
        {
          review: reviewText,
          rating: rating // Send rating along with review text
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Review submitted successfully:', response.data);
      setShowReviewModal(false);
      setReviewText('');
      setRating(0); // Reset rating after submission
      // Optionally handle success message or state update
    } catch (error) {
      console.error('Error submitting review:', error);
      // Optionally handle error message or state update
    }
  };

  const sendRequest = async (mentorId) => {
    try {
      const response = await axios.post(
        `https://mentor-server-qd42.onrender.com/api/requests/${mentorId}`,
        { classType, classTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Request sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const viewDetail = async (userId) => {
    try {
      const response = await axios.get(`https://mentor-server-qd42.onrender.com/api/detail/user/detail/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(response.data);
      fetchUserExperiences(userId);
    } catch (error) {
      console.error('Error fetching user detail:', error);
    }
  };

  const ignoreMentor = (mentorId) => {
    setIgnoredMentors([...ignoredMentors, mentorId]);
  };

  const fetchUserExperiences = async (userId) => {
    try {
      const response = await axios.get(`https://mentor-server-qd42.onrender.com/api/experience/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserExperiences(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching user experiences:', error);
    }
  };

  const resetForm = () => {
    setClassType('');
    setClassTime('');
  };

  const ConfirmationModal = ({ onCancel, onConfirm }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-Interi">
      <div className="bg-white p-4 rounded-md shadow-md">
        <p className="mb-4">Are you sure you want to send the request?</p>
        <div className="flex justify-end">
          <button className="bg-gray-400 px-3 py-1 rounded-md mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button className="bg-orange-900 px-3 py-1 text-white rounded-md" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  const ReviewModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h3 className="text-xl font-bold mb-4">Add Review</h3>
        <StarRating rating={rating} setRating={setRating} />
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md"
          rows="4"
          placeholder="Write your review here..."
        />
        <div className="flex justify-end">
          <button className="bg-gray-400 px-3 py-1 rounded-md mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-3 py-1 rounded-md" onClick={handleReviewSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-300 to-orange-200 flex items-center justify-center">
        <img src={LOGO} alt="logo" />
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gradient-to-r from-gray-300 to-orange-200 ">
      <div className="m-6 bg-transparent flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <button className="font-bold py-2 px-4 rounded">
          <FaUserPlus className="fill-current text-2xl mr-1" />
        </button>
        <div className="text-2xl font-bold py-2 px-4 rounded">Matching</div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search mentors..."
            value={searchTerm}
            onChange={handleSearch}
            className="bg-orange-100 py-2 px-3 rounded-md w-full focus:outline-none"
          />
          <FaSearch className="fill-current w-4 h-4 text-gray-500 absolute top-0 right-0 mt-2 mr-2" />
        </div>
      </div>
      {selectedUser ? (
        <div className="bg-gradient-to-r from-gray-400 to-orange-200 h-screen rounded-md shadow-md p-4">
          <div className="flex cursor-pointer" onClick={() => setSelectedUser(null)}>
            <FaArrowLeft className="text-gray-900 rounded-lg text-xl text-center" />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mt-4">
              {selectedUser.firstName} {selectedUser.lastName}
            </h2>
            <p className="text-lg">
              {selectedUser.studyField}, {selectedUser.school}
            </p>
            <div className='w-full'>
              <h2 className="text-3xl font-bold mt-4 text-red-800">About</h2>
              <h2 className="text-xl font-bold mt-4">Experience</h2>
              {userExperiences.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {userExperiences.map((experience) => (
                    <div key={experience._id} className="bg-gray-200 p-4 rounded-md shadow">
                      <h3 className="text-lg font-semibold">{experience.title}</h3>
                      <p className="text-sm font-bold">{experience.description}</p>
                      <p className="text-xs mt-2 ">
                        {new Date(experience.startDate).toLocaleDateString()} -{' '}
                        {new Date(experience.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lg text-center text-gray-800">No experiences found.</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div>
                <label htmlFor="classType" className="text-lg font-semibold">
                  Choose your class type
                </label>
                <select
                  id="classType"
                  value={classType}
                  onChange={(e) => setClassType(e.target.value)}
                  className="bg-white py-2 px-3 rounded-md w-full"
                >
                  <option value="">Select Class Type</option>
                  <option value="inperson">In Person</option>
                  <option value="online">Online</option>
                  <option value="workshops">Workshops</option>
                  <option value="oneonone">One-on-One</option>
                </select>
              </div>
              <div>
                <label htmlFor="classTime" className="text-lg font-semibold">
                  Choose preferred class time
                </label>
                <input
                  type="datetime-local"
                  id="classTime"
                  value={classTime}
                  onChange={(e) => setClassTime(e.target.value)}
                  className="bg-white py-2 px-3 rounded-md w-full"
                />
              </div>
            </div>
            <button
              className="bg-gradient-to-r from-violet-800 to-orange-800 py-2 px-8 text-lg rounded-md text-white mt-11 font-semibold"
              onClick={() => setShowConfirmationModal(true)}
            >
              Request Session
            </button>
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-red-900 text-white px-4 py-2 ml-4 rounded-md"
            >
              Add Review
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-200 rounded-md shadow-md overflow-hidden">
          <h1 className="flex justify-center font-bold text-xl text-red-700 font-poppins">Close to you</h1>
          <div className="grid grid-cols-3 gap-4 p-4">
            {filteredMentors.map((mentor) => (
              <div key={mentor._id} className="hover:bg-orange-200 p-4 rounded-lg shadow-md bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <FaUser className="text-orange-300 text-5xl bg-yellow-900 p-1 rounded-full" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {mentor.firstName} {mentor.lastName}
                  </h3>
                </div>
                <div className="flex justify-center gap-6 text-white">
                  <button className="bg-orange-900 py-2 px-3 rounded-md" onClick={() => viewDetail(mentor.user)}>
                    Request
                  </button>
                  <button className="bg-orange-900 py-2 px-3 rounded-md" onClick={() => ignoreMentor(mentor.user)}>
                    Ignore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          onCancel={() => setShowConfirmationModal(false)}
          onConfirm={() => {
            sendRequest(selectedUser.user);
            resetForm();
            setShowConfirmationModal(false);
          }}
        />
      )}
      {showReviewModal && (
        <ReviewModal onClose={() => setShowReviewModal(false)} />
      )}
    </div>
  );
};

export default Close;
