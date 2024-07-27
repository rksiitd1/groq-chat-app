import React, { useState } from 'react';

export default function GroqChatApp() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessages = [...messages, { role: 'user', content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');

    try {
      // Here we would normally call the Groq API
      // For now, let's just simulate a response
      setTimeout(() => {
        const botResponse = "This is a simulated response. In a real app, this would come from the Groq API.";
        setMessages([...newMessages, { role: 'assistant', content: botResponse }]);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, there was an error processing your request." }]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-4">Groq Chat</h1>
        <ul>
          <li className="mb-2">Chat History</li>
          <li className="mb-2">Settings</li>
        </ul>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 border rounded-l-lg p-2"
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}