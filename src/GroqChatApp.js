import React, { useState, useEffect } from 'react';
import { PlusCircle, Send, MessageSquare, Edit2 } from 'lucide-react';

const formatMessage = (content) => {
  const lines = content.split('\n');
  return lines.map((line, index) => {
    // Bold text
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic text
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Unordered list
    if (line.trim().startsWith('- ')) {
      return <li key={index} dangerouslySetInnerHTML={{ __html: line.slice(2) }} />;
    }
    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      return <li key={index} dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s/, '') }} />;
    }
    return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />;
  });
};

export default function GroqChatApp() {
  const [chats, setChats] = useState([{ id: 1, name: 'Chat 1', messages: [] }]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [inputMessage, setInputMessage] = useState('');
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingChatName, setEditingChatName] = useState('');

  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const updatedChats = chats.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, { role: 'user', content: inputMessage }] }
        : chat
    );
    setChats(updatedChats);
    setInputMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: updatedChats.find(chat => chat.id === currentChatId).messages 
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setChats(chats => 
        chats.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, { role: 'assistant', content: data.content }] }
            : chat
        )
      );
    } catch (error) {
      console.error('Error:', error);
      setChats(chats => 
        chats.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, { role: 'assistant', content: "Sorry, there was an error processing your request." }] }
            : chat
        )
      );
    }
  };

  const startNewChat = () => {
    const newChatId = Math.max(...chats.map(chat => chat.id)) + 1;
    setChats([...chats, { id: newChatId, name: `Chat ${newChatId}`, messages: [] }]);
    setCurrentChatId(newChatId);
  };

  const startRenamingChat = (chatId, currentName) => {
    setEditingChatId(chatId);
    setEditingChatName(currentName);
  };

  const finishRenamingChat = () => {
    if (editingChatName.trim() !== '') {
      setChats(chats.map(chat => 
        chat.id === editingChatId ? { ...chat, name: editingChatName.trim() } : chat
      ));
    }
    setEditingChatId(null);
    setEditingChatName('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-4">Groq Chat</h1>
        <button 
          onClick={startNewChat}
          className="mb-4 flex items-center justify-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          <PlusCircle className="mr-2" size={20} />
          New Chat
        </button>
        <div className="flex-grow overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id}
              className={`p-2 mb-2 rounded cursor-pointer flex items-center justify-between ${
                chat.id === currentChatId ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={editingChatName}
                  onChange={(e) => setEditingChatName(e.target.value)}
                  onBlur={finishRenamingChat}
                  onKeyPress={(e) => e.key === 'Enter' && finishRenamingChat()}
                  className="bg-gray-600 text-white p-1 rounded w-full"
                  autoFocus
                />
              ) : (
                <>
                  <div onClick={() => setCurrentChatId(chat.id)} className="flex items-center flex-grow">
                    <MessageSquare size={20} className="mr-2" />
                    {chat.name}
                  </div>
                  <button onClick={() => startRenamingChat(chat.id, chat.name)} className="p-1 hover:bg-gray-600 rounded">
                    <Edit2 size={16} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {chats.find(chat => chat.id === currentChatId)?.messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg ${
                message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}>
                {formatMessage(message.content)}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t bg-white">
          <div className="flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button 
              onClick={sendMessage} 
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}