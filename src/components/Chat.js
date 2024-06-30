import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatNotFound, setChatNotFound] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('Token');
        const response = await axios.get('http://localhost:5000/api/chat/mentor', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized access. Redirect to login page.');
        } else {
          console.error('Error fetching clients:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const fetchChat = async (clientId) => {
    try {
      const token = localStorage.getItem('Token');
      const response = await axios.get(`http://localhost:5000/api/chat/mentors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedChat(response.data);
      setChatNotFound(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setSelectedChat(null);
        setChatNotFound(true);
      } else {
        console.error('Error fetching chat:', error);
      }
    }
  };

  const replyMessage = async () => {
    if (!selectedClient) {
      console.error('No client selected. Please select a client before sending a message.');
      return;
    }

    try {
      const token = localStorage.getItem('Token');
      await axios.post('http://localhost:5000/api/chat/mentor/reply', {
        clientId: selectedClient._id,
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('');
      fetchChat(selectedClient._id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    fetchChat(client._id);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Select a Client and Chat</h2>
      {loading ? (
        <p style={styles.loadingText}>Loading...</p>
      ) : (
        <div>
          <h3 style={styles.subheading}>Clients:</h3>
          <ul style={styles.list}>
            {clients.map((client) => (
              <li key={client._id} style={styles.listItem}>
                <span>{client.firstName} {client.lastName}</span>
                <button
                  style={styles.button}
                  onClick={() => handleClientSelect(client)}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
          {chatNotFound && (
            <p style={styles.notFoundText}>No chat found with {selectedClient?.firstName} {selectedClient?.lastName}. Start a new chat by sending a message.</p>
          )}
          {selectedChat && (
            <div style={styles.chatContainer}>
              <h3 style={styles.subheading}>Chat with {selectedClient?.firstName} {selectedClient?.lastName}</h3>
              <div style={styles.messagesContainer}>
                {selectedChat.messages.map((msg, index) => (
                  <div key={index} style={styles.messageItem}>
                    <p style={styles.messageText}>{msg.message}</p>
                    <small style={styles.timestamp}>{new Date(msg.timestamp).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.input}
            />
            <button onClick={replyMessage} style={styles.sendButton}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px'
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px'
  },
  subheading: {
    fontSize: '20px',
    marginBottom: '10px'
  },
  notFoundText: {
    color: 'red',
    marginBottom: '20px'
  },
  chatContainer: {
    marginBottom: '20px'
  },
  messagesContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
    marginBottom: '20px'
  },
  messageItem: {
    padding: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    marginBottom: '10px'
  },
  messageText: {
    marginBottom: '5px'
  },
  timestamp: {
    fontSize: '12px',
    color: '#555'
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    flex: '1',
    padding: '10px',
    fontSize: '16px',
    marginRight: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  sendButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default Chat;
