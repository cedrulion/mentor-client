import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LearnerChat = ({ clientId }) => {
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (mentorId) => {
      try {
        const token = localStorage.getItem('Token');
        const mentorsResponse = await axios.get('http://localhost:5000/api/detail/user/details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentors(mentorsResponse.data);

        const chatsResponse = await axios.get(`http://localhost:5000/api/chat/${clientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
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
  }, [clientId]);

  const fetchChat = async (mentorId) => {
    try {
      const token = localStorage.getItem('Token');
      const response = await axios.get('http://localhost:5000/api/chat/${clientId}', {
        headers: { Authorization: `Bearer ${token}` },
      
      });
      setSelectedChat(response.data);
    } catch (error) {
      console.error('Error fetching chat:', error);
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
        mentorId: selectedMentor._id,
        message
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('');
      fetchChat(selectedMentor._id); // Refresh chat after sending message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const deleteMessage = async (chatId, messageId) => {
    try {
      const token = localStorage.getItem('Token');
      await axios.delete('http://localhost:5000/api/chat/delete-message', {
        headers: { Authorization: `Bearer ${token}` },
        data: { chatId, messageId }
      });
      fetchChat(selectedMentor._id); // Refresh chat after deleting message
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleMentorSelect = (mentor) => {
    setSelectedMentor(mentor);
    fetchChat(mentor._id);
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setSelectedMentor(chat.mentor);
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
                  onClick={() => handleChatSelect(chat.mentor)}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold mb-2">Chats:</h3>
          <ul className="mb-4">
            {chats.map((chat) => (
              <li key={chat._id} className="flex items-center justify-between py-2 border-b border-gray-300">
                <span>Chat witho {chat.mentor.firstName} {chat.mentor.lastName}</span>
                <button
                  className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => handleChatSelect(chat)}
                >
                  View Chat
                </button>
              </li>
            ))}
          </ul>
          {selectedChat && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Chat withh {selectedChat.mentor.firstName} {selectedChat.mentor.lastName}</h3>
              <div className="mb-4">
                {selectedChat.messages.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <p className="font-semibold">{msg.message}</p>
                    <small className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</small>
                    <button
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => deleteMessage(selectedChat._id, msg._id)}
                    >
                      Delete
                    </button>
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

export default LearnerChat;
