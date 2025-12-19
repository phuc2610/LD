import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChatWidget = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = useCallback(async () => {
    if (!token) return;
    
    try {
      const res = await axios.get(`${backendUrl}/api/message/user`, {
        headers: { token }
      });
      if (res.data.success) {
        setMessages(res.data.messages || []);
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, backendUrl]);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
      // Poll for new messages every 3 seconds
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !token) {
      if (!token) {
        toast.error('Vui lòng đăng nhập để sử dụng chat');
      }
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/message/send`,
        { message: newMessage },
        { headers: { token } }
      );
      if (res.data.success) {
        setNewMessage('');
        loadMessages();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Không thể gửi tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null; // Don't show chat widget if not logged in
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed bottom-6 right-6 w-14 h-14 bg-[#111111] text-white rounded-full shadow-lg 
          flex items-center justify-center z-50 hover:bg-[#222222] transition-all duration-300
          hover:scale-110'
        aria-label="Chat"
      >
        {isOpen ? (
          <svg className='w-6 h-6' fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className='w-6 h-6' fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className='fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white border border-[#e5e5e5] 
          shadow-2xl rounded-lg flex flex-col z-50 animate-fadeIn'>
          {/* Header */}
          <div className='bg-[#111111] text-white p-4 rounded-t-lg flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-semibold uppercase tracking-wide'>Hỗ trợ khách hàng</h3>
              <p className='text-xs opacity-80 mt-1'>Chúng tôi sẽ phản hồi sớm nhất</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='text-white hover:text-gray-300 transition-colors'
              aria-label="Close chat"
            >
              <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={messagesContainerRef}
            className='flex-1 overflow-y-auto p-4 space-y-3 bg-[#f9f9f9]'
          >
            {messages.length === 0 ? (
              <div className='text-center text-sm text-[#222222] opacity-70 py-8'>
                <p>Chưa có tin nhắn nào.</p>
                <p className='mt-2'>Gửi tin nhắn để bắt đầu trò chuyện!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isUser = msg.senderRole === 'user';
                return (
                  <div
                    key={index}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 ${
                        isUser
                          ? 'bg-[#111111] text-white'
                          : 'bg-white text-[#111111] border border-[#e5e5e5]'
                      }`}
                    >
                      {!isUser && (
                        <p className='text-xs font-semibold mb-1 opacity-80'>Admin</p>
                      )}
                      <p className='text-sm whitespace-pre-wrap break-words'>{msg.message}</p>
                      <p className={`text-xs mt-1 ${isUser ? 'text-white/70' : 'text-[#222222]/70'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className='border-t border-[#e5e5e5] p-3 bg-white rounded-b-lg'>
            <div className='flex gap-2'>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder='Nhập tin nhắn...'
                className='flex-1 px-3 py-2 border border-[#e5e5e5] rounded focus:outline-none focus:border-[#111111] 
                  text-sm'
                disabled={loading}
              />
              <button
                type='submit'
                disabled={loading || !newMessage.trim()}
                className='px-4 py-2 bg-[#111111] text-white rounded hover:bg-[#222222] 
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm'
              >
                {loading ? '...' : 'Gửi'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;

