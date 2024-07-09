import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correctly import jwtDecode as a named import

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchChats = async () => {
    const token = localStorage.getItem('Token');
    try {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token Data:', decodedToken); // Log the decoded token data

      const response = await axios.get('https://mentor-server-qd42.onrender.com/api/chat/mentor', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching chats.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('Token');
    if (!token) {
      setError('You must be logged in to view your chats.');
      setLoading(false);
      return;
    }

    fetchChats(); // Call fetchChats directly inside useEffect

  }, []);

  const handleReply = async (clientId, message) => {
    const token = localStorage.getItem('Token');
    try {
      const response = await axios.post('https://mentor-server-qd42.onrender.com/api/chat/mentor/reply', {
        clientId,
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Reply sent:', response.data);
      fetchChats(); // Optionally, fetch updated chats after replying
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Chats</h2>
      {chats.length === 0 ? (
        <div className="bg-blue-100 text-blue-700 p-4 rounded-lg">No chats found.</div>
      ) : (
        chats.map(chat => (
          <div key={chat._id} className="bg-white shadow-md rounded-lg mb-4">
            <div className="bg-gray-100 p-4 rounded-t-lg">
             message
            </div>
            <div className="p-4">
              {chat.messages.map(message => (
                <div
                  key={message._id}
                  className="p-3 mb-3 rounded-lg bg-blue-100 text-blue-900"
                >
                  <strong> {message.sender}:</strong> {message.message}
                  <div className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4">
              <input
                type="text"
                placeholder="Type your reply..."
                className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-2"
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                onClick={() => handleReply(chat.client?._id, message)}
              >
                Reply
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Chat;
