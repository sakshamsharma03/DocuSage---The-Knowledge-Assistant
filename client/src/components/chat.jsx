import React, { useState ,useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/theme';

const AIChat = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { theme } = useContext(ThemeContext);

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    // Update chat history with user's message
    const userMessage = { role: 'USER', message: query };
    setChatHistory([...chatHistory, userMessage]);
    console.log("before triggering ",chatHistory)

    setIsLoading(true);

    try {
      // Send the chat query to the backend API
      const response = await axios.post('http://localhost:8000/chat', {
        query,
        chat_history: chatHistory,
      });

      const { response_text, citations, chat_history: updatedChatHistory } = response.data;

      // Update the chat history with the AI response
      const aiMessage = {
        role: 'CHATBOT',
        message: response_text,
        citations: citations || [],
      };

      setChatHistory([...updatedChatHistory,aiMessage]);
      
    } catch (error) {
      console.error('Error with chat API:', error.message);
    } finally {
      setIsLoading(false);
      setQuery(''); // Clear the input field
    }
  };
  
  return (
    <div className={` flex flex-col w-full   p-4  ${theme === 'light' ? 'bg-slate-100 text-black' : 'bg-gray-900 text-white'}`}>
     { console.log(chatHistory)}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              chat.role === 'USER'
                ? (theme === 'light' ? 'bg-blue-100 text-blue-800 self-end' : 'bg-blue-700 text-white self-end')
                : (theme === 'light' ? 'bg-gray-200 text-gray-800 self-start' : 'bg-gray-700 text-gray-200 self-start')
            }`}
          >
             <p>{chat.message}</p>
           
            {/* {chat.role === 'ai' && chat.citations?.length > 0 && (
              <small className={`text-gray-500 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Citations: {chat.citations.join(', ')}
              </small>
            )} */}
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
            theme === 'light' ? 'border-gray-300 focus:ring-blue-500 text-black' : 'border-gray-600 focus:ring-blue-400 text-black'
          }`}
        />
        <button
          onClick={handleSendQuery}
          disabled={isLoading}
          className={`h-full px-4 py-2 rounded-lg transition duration-200 ${
            theme === 'light' ? 'bg-slate-400 text-black hover:bg-slate-500 hover:text-white' : 'bg-blue-700 text-white hover:bg-blue-600'
          } disabled:opacity-50`}
        >
          {isLoading ? 'Loading...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default AIChat;
