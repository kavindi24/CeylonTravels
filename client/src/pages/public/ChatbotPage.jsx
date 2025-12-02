import { useState, useRef, useEffect } from 'react';

function ChatbotPage() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your Ceylon Travel assistant. How can I help you plan your Sri Lankan adventure today?", 
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample responses for demonstration
  const botResponses = [
    "Sri Lanka offers beautiful beaches, ancient temples, and amazing wildlife!",
    "The best time to visit is between December and March for the west coast and south coast.",
    "I'd recommend visiting Sigiriya Rock Fortress, Ella, and the beaches of Mirissa.",
    "You'll need a visa to visit Sri Lanka. You can apply for an Electronic Travel Authorization (ETA) online.",
    "Traditional Sri Lankan cuisine is a must-try! Don't miss hoppers, kottu, and delicious seafood.",
    "The cultural triangle featuring Anuradhapura, Polonnaruwa, and Dambulla is a UNESCO World Heritage site.",
    "For wildlife enthusiasts, Yala and Udawalawe National Parks offer incredible safari experiences.",
    "Don't forget to experience a scenic train ride through the tea plantations in Nuwara Eliya!"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() === "") return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages([...messages, newUserMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const newBotMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    "Best places to visit?",
    "Visa requirements?",
    "Local cuisine?",
    "Best time to travel?",
    "Cultural sites?",
    "Wildlife experiences?",
    "Transportation options?",
    "Beach recommendations?"
  ];

  const handleQuickQuestion = (question) => {
    setInputText(question);
    // Auto-submit the quick question
    const fakeEvent = { preventDefault: () => {} };
    handleSendMessage(fakeEvent);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container-fluid min-vh-100 py-4" style={{ 
      backgroundColor: "#5f85ec75"
    }}>
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{
            background: "linear-gradient(135deg, #0a192f 0%, #112240 100%)",
            border: "1px solid #1d3a5c"
          }}>
            <div className="card-header p-4" style={{ 
              background: "linear-gradient(90deg, #0c2e52 0%, #1a4b78 100%)",
              border: "none"
            }}>
              <div className="d-flex align-items-center">
                <div className="bg-white rounded-circle p-2 shadow-sm me-3" style={{
                  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="mb-0 text-white">Ceylon Travel Assistant</h2>
                  <p className="mb-0 text-light">Your guide to exploring Sri Lanka</p>
                </div>
              </div>
            </div>
            
            <div className="card-body p-0">
              <div className="chat-container" style={{ 
                height: "400px", 
                overflowY: "auto", 
                background: "linear-gradient(135deg, #112240 0%, #0a192f 100%)",
                border: "1px solid #1d3a5c",
                borderLeft: "none",
                borderRight: "none"
              }}>
                <div className="p-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`d-flex mb-4 ${message.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
                    >
                      <div 
                        className={`position-relative rounded-4 p-3 ${message.sender === "user" 
                          ? "user-message" 
                          : "bot-message"}`}
                        style={{ maxWidth: "75%" }}
                      >
                        <div className="message-text">{message.text}</div>
                        <div className={`message-time text-end small ${message.sender === "user" ? "text-light" : "text-light"}`}>
                          {formatTime(message.timestamp)}
                        </div>
                        
                        {/* Message tip */}
                        {message.sender === "user" ? (
                          <div className="position-absolute top-50 end-0 translate-middle-y">
                            <div className="user-tip"></div>
                          </div>
                        ) : (
                          <div className="position-absolute top-50 start-0 translate-middle-y">
                            <div className="bot-tip"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="d-flex justify-content-start mb-3">
                      <div className="bot-message rounded-4 p-3">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <div className="p-3" style={{ 
                background: "linear-gradient(135deg, #0c2e52 0%, #112240 100%)",
                borderTop: "1px solid #1d3a5c"
              }}>
                <div className="quick-questions mb-3">
                  <p className="small text-light mb-2">Quick questions:</p>
                  <div className="d-flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        type="button"
                        className="btn btn-sm rounded-pill"
                        onClick={() => handleQuickQuestion(question)}
                        style={{ 
                          background: "linear-gradient(135deg, #1a4b78 0%, #2a69a6 100%)",
                          border: "1px solid #2a69a6",
                          color: "white"
                        }}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
                
                <form onSubmit={handleSendMessage}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control rounded-pill border-0"
                      placeholder="Ask about Sri Lanka travel..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      style={{ 
                        backgroundColor: "#0a192f", 
                        color: "white",
                        border: "1px solid #1d3a5c"
                      }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill ms-2 px-4"
                      disabled={inputText.trim() === ""}
                      style={{ 
                        background: "linear-gradient(90deg, #1a4b78 0%, #2a69a6 100%)",
                        border: "none"
                      }}
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4 text-light">
            <p>Powered by Ceylon Travel Experts • 24/7 Assistance</p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .chat-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-container::-webkit-scrollbar-track {
          background: #0a192f;
          border-radius: 10px;
        }
        
        .chat-container::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #1a4b78, #2a69a6);
          border-radius: 10px;
        }
        
        .user-message {
          background: linear-gradient(90deg, #1a4b78 0%, #2a69a6 100%);
          color: white;
          border-top-right-radius: 8px !important;
        }
        
        .bot-message {
          background: linear-gradient(135deg, #112240 0%, #1a4b78 100%);
          color: white;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
          border-top-left-radius: 8px !important;
          border: 1px solid #1d3a5c;
        }
        
        .user-tip {
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-left: 8px solid #2a69a6;
          margin-right: -8px;
        }
        
        .bot-tip {
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-right: 8px solid #1a4b78;
          margin-left: -8px;
        }
        
        .typing-indicator {
          display: inline-flex;
          align-items: center;
          height: 17px;
        }
        
        .typing-indicator span {
          width: 7px;
          height: 7px;
          margin: 0 1px;
          background-color: #4facfe;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.1s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.2s;
        }
        
        @keyframes typing {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.3) !important;
        }
        
        .message-text {
          margin-bottom: 0.25rem;
        }
        
        .message-time {
          font-size: 0.7rem;
          opacity: 0.8;
        }
        
        .btn:hover {
          background: linear-gradient(135deg, #2a69a6 0%, #3b82c7 100%) !important;
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
        
        .form-control:focus {
          background-color: #112240;
          color: white;
          border-color: #2a69a6;
          box-shadow: 0 0 0 0.2rem rgba(42, 105, 166, 0.25);
        }
        
        .form-control::placeholder {
          color: #5a7a9f;
        }
      `}</style>
    </div>
  );
}

export default ChatbotPage;