import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LearnerChat = ({ clientId }) => {
  const [message, setMessage] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatNotFound, setChatNotFound] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const token = localStorage.getItem('Token');
        const response = await axios.get('http://localhost:5000/api/detail/user/details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentors(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized access. Redirect to login page.');
        } else {
          console.error('Error fetching mentors:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const fetchChat = async (mentorId) => {
    try {
      const token = localStorage.getItem('Token');
      const response = await axios.get(`http://localhost:5000/api/chat/get/${mentorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedChat(response.data);
      setChatNotFound(false); // Reset the chatNotFound state
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setSelectedChat(null);
        setChatNotFound(true); // Set chatNotFound to true if the chat is not found
      } else {
        console.error('Error fetching chat:', error);
      }
    }
  };

  const sendMessage = async () => {
    if (!selectedMentor) {
      console.error('No mentor selected. Please select a mentor before sending a message.');
      return;
    }

    try {
      const token = localStorage.getItem('Token');
      await axios.post('http://localhost:5000/api/chat/send', {
        mentorId: selectedMentor.user,
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('');
      fetchChat(selectedMentor.user); // Refresh chat after sending message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleMentorSelect = (mentor) => {
    setSelectedMentor(mentor);
    fetchChat(mentor.user);
  };

  return (
    <div className="max-w-screen-md mx-auto bg-gray-100 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Select a Mentor and Chat</h2>
      {loading ? (
        <p className="text-lg text-gray-600">Loading...</p>
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-2">Mentors:</h3>
          <ul className="mb-4">
            {mentors.map((mentor) => (
              <li key={mentor._id} className="flex items-center justify-between py-2 px-4 mb-2 bg-white rounded-lg shadow-sm">
                <span>{mentor.firstName} {mentor.lastName}</span>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => handleMentorSelect(mentor)}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
          {chatNotFound && (
            <p className="text-red-500 mb-4">No chat found with {selectedMentor.firstName} {selectedMentor.lastName}. Start a new chat by sending a message.</p>
          )}
          {selectedChat && (
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">Chat with {selectedMentor.firstName} {selectedMentor.lastName}</h3>
              <div className="max-h-300 overflow-y-auto p-4 bg-green-200 rounded-lg">
                {selectedChat.messages.map((msg, index) => (
                  <div key={index} className="py-2 px-4 bg-white rounded-lg mb-2 shadow-sm">
                    <p className="text-base">{msg.message}</p>
                    <small className="text-xs text-gray-600">{new Date(msg.timestamp).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 py-2 px-4 text-lg rounded-l-lg border-gray-300 border outline-none"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-r-lg cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerChat;
