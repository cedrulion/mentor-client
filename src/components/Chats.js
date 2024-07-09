import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chats({ mentorId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://mentor-server-qd42.onrender.com/api/chats/${mentorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Chat Messages:', response.data);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchMessages();
  }, [mentorId, token]);

  const sendMessage = async () => {
    try {
      const response = await axios.post(`https://mentor-server-qd42.onrender.com/api/chats/start`, 
        { content: newMessage }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prevMessages) => [...prevMessages, response.data.newMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chat with Mentor</h2>
          <button onClick={onClose} className="text-red-600 hover:text-red-900">Close</button>
        </div>
        <div className="mb-4">
          <div className="overflow-y-auto h-64">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender === mentorId ? 'bg-blue-100' : 'bg-green-100'}`}>
                <div>{msg.content}</div>
                <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex">
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Type a message..." 
            className="border rounded p-2 flex-grow mr-2" 
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chats;
