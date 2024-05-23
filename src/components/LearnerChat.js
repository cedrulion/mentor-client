import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ChatContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
`;

const QuestionWrapper = styled(MessageWrapper)`
  background-color: #F3F4F6;
  align-items: flex-start;
  margin-left: 20px; /* Left align */
`;

const ReplyWrapper = styled(MessageWrapper)`
  background-color: #DCF8C6;
  align-items: flex-end;
  margin-right: 20px; /* Right align */
`;

const Button = styled.button`
  margin-top: 8px;
  background-color: #3490DC;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
`;

function LearnerChat() {
  const [status, setStatus] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/request/status', {
          headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
        });
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();
  }, []);

  const handleQuestionChange = (event) => {
    setQuestionText(event.target.value);
  };

  const handleSendQuestion = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/questions/ask', { message: questionText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      console.log('Question sent successfully');
      setQuestionText('');
      fetchQuestions();
    } catch (error) {
      console.error('Error sending question:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/questions/view', {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleReply = async (questionId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/questions/reply/${questionId}`,
        { reply: message },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
        }
      );
      console.log('Reply sent successfully:', response.data);
      const updatedReplies = { ...replies, [questionId]: message };
      setReplies(updatedReplies);
      setMessage(''); // Clear the message after sending the reply
    } catch (error) {
      console.error('Error replying to question:', error);
    }
  };

  return (
    <ChatContainer>
      <div className="h-screen bg-gradient-to-r from-gray-300 to-orange-200 p-6">
        <div className="flex justify-between mb-6">
          {status === 'accepted' ? (
            <>
              <input
                type="text"
                placeholder="Ask a question..."
                value={questionText}
                onChange={handleQuestionChange}
                className="p-2 rounded-md w-3/4 bg-gray-100"
              />
              <Button className="py-3 px-8 rounded-md text-white" onClick={handleSendQuestion}>
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </>
          ) : (
            <p className="text-gray-800">Your request is not accepted yet. Status: {status}</p>
          )}
        </div>
        {questions.map((question) => (
          <div key={question._id}>
            {question.replies.map((reply) => (
              <ReplyWrapper key={reply._id}>
                <p>{reply.message}</p>
              </ReplyWrapper>
            ))}
            <QuestionWrapper>
              <p>{question.message}</p>
              <p><strong>From:</strong> {question.learnerFirstName}</p>
            </QuestionWrapper>
            {!replies[question._id] && (
              <>
                <ReplyWrapper>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="border border-gray-300 rounded p-2 mt-4"
                  />
                  <Button onClick={() => handleReply(question._id)}>
                    Reply
                  </Button>
                </ReplyWrapper>
              </>
            )}
          </div>
        ))}
      </div>
    </ChatContainer>
  );
}

export default LearnerChat;
