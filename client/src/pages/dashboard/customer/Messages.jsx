// src/pages/dashboard/customer/Messages.jsx
import React, { useState } from 'react';
import { FaSearch, FaPaperclip, FaPaperPlane, FaEllipsisV, FaReply, FaTrash, FaEnvelope, FaEnvelopeOpen, FaFilter } from 'react-icons/fa';

function Messages() {
  const [activeConversation, setActiveConversation] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample conversations data
  const conversations = [
    {
      id: 1,
      name: 'Beach Resort Support',
      lastMessage: 'Your booking has been confirmed!',
      timestamp: '2 hours ago',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      name: 'Travel Guide - Samantha',
      lastMessage: 'I can recommend some great places to visit...',
      timestamp: '1 day ago',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      name: 'Adventure Tours Co.',
      lastMessage: 'Your safari tour is scheduled for next week',
      timestamp: '2 days ago',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 4,
      name: 'Car Rental Service',
      lastMessage: 'Your vehicle will be delivered to your hotel',
      timestamp: '3 days ago',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    }
  ];

  // Sample messages data
  const messages = {
    1: [
      { id: 1, text: 'Hello, I have a question about my booking.', sender: 'user', timestamp: '10:30 AM' },
      { id: 2, text: 'Hi! How can I help you with your booking?', sender: 'them', timestamp: '10:32 AM' },
      { id: 3, text: 'I wanted to know if breakfast is included.', sender: 'user', timestamp: '10:35 AM' },
      { id: 4, text: 'Yes, breakfast is included for all guests. Your booking has been confirmed!', sender: 'them', timestamp: '10:40 AM' },
    ],
    2: [
      { id: 1, text: 'Hi Samantha, can you recommend some places to visit?', sender: 'user', timestamp: 'Yesterday' },
      { id: 2, text: 'Of course! I can recommend some great places to visit based on your interests.', sender: 'them', timestamp: 'Yesterday' },
    ],
    3: [
      { id: 1, text: 'Just confirming my safari tour for next week.', sender: 'user', timestamp: '2 days ago' },
      { id: 2, text: 'Your safari tour is scheduled for next week. We look forward to seeing you!', sender: 'them', timestamp: '2 days ago' },
    ],
    4: [
      { id: 1, text: 'I need a car delivered to my hotel on the 15th.', sender: 'user', timestamp: '3 days ago' },
      { id: 2, text: 'Your vehicle will be delivered to your hotel as requested.', sender: 'them', timestamp: '3 days ago' },
    ]
  };

  const activeConvData = conversations.find(conv => conv.id === activeConversation);
  const activeMessages = messages[activeConversation] || [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      // In a real app, this would send the message to an API
      setMessageText('');
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="messages">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-dark fw-bold mb-1">Messages</h2>
          <p className="text-muted">You have {conversations.filter(c => c.unread).length} unread messages</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center">
          <FaEnvelope className="me-2" /> New Message
        </button>
      </div>

      <div className="row">
        {/* Conversations Sidebar */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <div className="input-group border rounded">
                <span className="input-group-text bg-white border-0">
                  <FaSearch className="text-gray-500" />
                </span>
                <input 
                  type="text" 
                  className="form-control border-0 text-dark" 
                  placeholder="Search conversations..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ outline: 'none', boxShadow: 'none' }}
                />
                <button className="btn btn-outline-secondary border-0" type="button">
                  <FaFilter />
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-5">
                  <FaEnvelope className="text-muted mb-3" style={{ fontSize: '2rem' }} />
                  <p className="text-muted">No conversations found</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredConversations.map(conversation => (
                    <div 
                      key={conversation.id}
                      className={`list-group-item list-group-item-action p-3 cursor-pointer ${activeConversation === conversation.id ? 'bg-light' : ''}`}
                      onClick={() => setActiveConversation(conversation.id)}
                    >
                      <div className="d-flex align-items-center">
                        <div className="position-relative me-3">
                          <img 
                            src={conversation.avatar} 
                            alt={conversation.name}
                            className="rounded-circle"
                            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                          />
                          {conversation.unread && (
                            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-white rounded-circle">
                              <span className="visually-hidden">New messages</span>
                            </span>
                          )}
                        </div>
                        <div className="flex-grow-1 me-2" style={{ minWidth: 0 }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 text-truncate">{conversation.name}</h6>
                            <small className="text-muted">{conversation.timestamp}</small>
                          </div>
                          <p className="mb-0 text-truncate text-muted small">
                            {conversation.unread ? (
                              <strong>{conversation.lastMessage}</strong>
                            ) : (
                              conversation.lastMessage
                            )}
                          </p>
                        </div>
                        <div className="dropdown">
                          <button 
                            className="btn btn-sm btn-outline-secondary border-0" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaEllipsisV />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100 d-flex flex-column">
            {activeConvData ? (
              <>
                <div className="card-header bg-white border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img 
                        src={activeConvData.avatar} 
                        alt={activeConvData.name}
                        className="rounded-circle me-3"
                        style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                      />
                      <div>
                        <h6 className="mb-0">{activeConvData.name}</h6>
                        <small className="text-muted">Last seen {activeConvData.timestamp}</small>
                      </div>
                    </div>
                    <div className="dropdown">
                      <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <FaEllipsisV />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><button className="dropdown-item"><FaReply className="me-2" /> Mark as read</button></li>
                        <li><button className="dropdown-item"><FaTrash className="me-2" /> Delete conversation</button></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="card-body flex-grow-1 overflow-auto" style={{ maxHeight: '400px' }}>
                  <div className="d-flex flex-column">
                    {activeMessages.map(message => (
                      <div 
                        key={message.id} 
                        className={`d-flex mb-3 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                      >
                        <div 
                          className={`p-3 rounded-3 ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-light'}`}
                          style={{ maxWidth: '70%' }}
                        >
                          <p className="mb-0">{message.text}</p>
                          <small className={`d-block text-end ${message.sender === 'user' ? 'text-white-50' : 'text-muted'}`}>
                            {message.timestamp}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-footer bg-white border-0 py-3">
                  <form onSubmit={handleSendMessage}>
                    <div className="input-group border rounded">
                      <button type="button" className="btn btn-outline-secondary border-0">
                        <FaPaperclip />
                      </button>
                      <input 
                        type="text" 
                        className="form-control border-0 text-dark" 
                        placeholder="Type your message..." 
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        style={{ outline: 'none', boxShadow: 'none' }}
                      />
                      <button type="submit" className="btn btn-primary border-0">
                        <FaPaperPlane />
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <FaEnvelopeOpen className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                <h5 className="text-muted">Select a conversation</h5>
                <p className="text-muted">Choose a conversation from the list to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;