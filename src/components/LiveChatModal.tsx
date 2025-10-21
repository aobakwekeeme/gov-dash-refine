import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Minimize2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

const LiveChatModal: React.FC<LiveChatModalProps> = ({ isOpen, onClose }) => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello ${profile?.full_name || 'there'}! Welcome to SSRMS Support. How can I help you today?`,
      sender: 'support',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate support response
    setTimeout(() => {
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message. A support agent will be with you shortly. In the meantime, you can check our FAQ section for quick answers.",
        sender: 'support',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, supportResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-14' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">SS</span>
            </div>
            <div>
              <h3 className="font-semibold">SSRMS Support</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-white/10 p-1 rounded"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="hover:bg-white/10 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-[460px] overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  } rounded-lg p-3`}>
                    <p className="text-sm">{message.text}</p>
                    <span className={`text-xs ${
                      message.sender === 'user' ? 'text-teal-100' : 'text-gray-500'
                    } mt-1 block`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send • Shift + Enter for new line
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveChatModal;