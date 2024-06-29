import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeanerChat = ({ clientId }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = ''; // Place your JWT token here

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mentorsResponse = await axios.get('http://localhost:5000/api/detail/user/details', {
          headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
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

    fetchData();
  }, [token]);

  const fetchChat = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chat/get`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      setChat(response.data);
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  const sendMessage = async () => {
    try {
      await axios.post('http://localhost:5000/api/chat/send', {
        mentorId: selectedMentor._id,
        message
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      setMessage('');
      fetchChat(); // Refresh chat after sending message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleMentorSelect = (mentor) => {
    setSelectedMentor(mentor);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Select a Mentor and Chat</h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2">Mentors:</h3>
          <ul className="mb-4">
            {mentors.map((mentor) => (
              <li key={mentor._id} className="flex items-center justify-between py-2 border-b border-gray-300">
                <span>{mentor.firstName} {mentor.lastName}</span>
                <button
                  className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => handleMentorSelect(mentor)}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
          {selectedMentor && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Chat with {selectedMentor.firstName} {selectedMentor.lastName}</h3>
              <div className="mb-4">
                {chat && chat.messages.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <p className="font-semibold">{msg.sender.firstName} {msg.sender.lastName}: {msg.message}</p>
                    <small className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</small>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeanerChat;
