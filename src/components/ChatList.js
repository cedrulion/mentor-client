import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chats/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [token]);

  return (
    <div className="chat-list">
      {chats.map(chat => (
        <div key={chat._id} onClick={() => onSelectChat(chat._id)}>
          <div>{chat.mentorName}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
