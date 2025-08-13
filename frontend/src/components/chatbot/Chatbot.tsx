import { useState, useRef, useEffect } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";

// Simple markdown renderer component
const MarkdownRenderer = ({ content }: { content: string }) => {
  const renderMarkdown = (text: string) => {
    // Convert markdown to HTML
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-sm font-semibold mt-3 mb-1">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-base font-semibold mt-3 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-lg font-bold mt-3 mb-2">$1</h1>')
      
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-2 rounded text-xs my-2 overflow-x-auto"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-xs">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Unordered lists
      .replace(/^[\s]*-[\s]+(.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/(<li.*<\/li>)/s, '<ul class="my-1">$1</ul>')
      
      // Ordered lists
      .replace(/^[\s]*\d+\.[\s]+(.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/(<li class="ml-4 list-decimal".*<\/li>)/s, '<ol class="my-1 ml-4">$1</ol>')
      
      // Line breaks
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');

    return html;
  };

  return (
    <div 
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

interface Message {
  sender: "bot" | "user";
  text: string;
  time?: string;
}

const initialMessages: Message[] = [
  {
   sender: "bot",
   text: "👋 Hey there! I’m here to help you quickly report any issue and make sure it gets the attention it deserves. Let’s get started!"
  },
];

export default function Chatbot({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAgentMessage, setCurrentAgentMessage] = useState<string>("");
  const [isReceivingMessage, setIsReceivingMessage] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Get current time
  const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format agent response
  const formatAgentResponse = (text: string): string => {
    try {
      if (typeof text === "string" && text.startsWith("{") && text.endsWith("}")) {
        const jsonData = JSON.parse(text);
        if (jsonData.content) {
          return jsonData.content;
        }
      }
    } catch (e) {
      // Not JSON or invalid JSON, continue with text
    }
    return text;
  };

  // Add message to messages array
  const addMessage = (text: string, sender: "bot" | "user", time?: string) => {
    const newMessage: Message = {
      sender,
      text,
      time: time || getCurrentTime(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Handle agent message chunks
  const handleAgentChunk = (chunk: string) => {
    const formattedChunk = formatAgentResponse(chunk);
    setCurrentAgentMessage(formattedChunk);
  };

  // Complete agent message
  const completeAgentMessage = (finalResponse?: string) => {
    const messageToAdd = finalResponse ? formatAgentResponse(finalResponse) : currentAgentMessage;
    if (messageToAdd.trim()) {
      addMessage(messageToAdd, "bot");
    }
    setCurrentAgentMessage("");
    setIsReceivingMessage(false);
    setIsTyping(false);
  };

  // Initialize WebSocket connection
  const initializeWebSocket = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);
    const socket = new WebSocket("ws://localhost:8080/ws");
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      setIsConnected(true);
      setIsConnecting(false);
      console.log("Connected to WebSocket server");
    });

    socket.addEventListener("message", (event) => {
      try {
        const response = JSON.parse(event.data);
        console.log("Response:", response);

        if (response.status === "processing") {
          setIsTyping(true);
          setIsReceivingMessage(true);
          setCurrentAgentMessage("");
        } else if (response.status === "chunk") {
          setIsTyping(false);
          handleAgentChunk(response.chunk);
        } else if (response.status === "complete") {
          setIsTyping(false);
          completeAgentMessage(response.response);
        } else if (response.error) {
          setIsTyping(false);
          setIsReceivingMessage(false);
          addMessage(`Error: ${response.error}`, "bot");
        } else {
          setIsTyping(false);
          setIsReceivingMessage(false);
          addMessage(event.data, "bot");
        }
      } catch (e) {
        setIsTyping(false);
        setIsReceivingMessage(false);
        addMessage(event.data, "bot");
      }
    });

    socket.addEventListener("close", (event) => {
      setIsConnected(false);
      setIsConnecting(false);
      setIsTyping(false);
      setIsReceivingMessage(false);
      
      if (!event.wasClean) {
        console.log("Connection lost. WebSocket closed unexpectedly.");
      }
    });

    socket.addEventListener("error", (event) => {
      setIsConnected(false);
      setIsConnecting(false);
      setIsTyping(false);
      setIsReceivingMessage(false);
      console.error("WebSocket error:", event);
    });
  };

  // Send message via WebSocket
  const sendWebSocketMessage = (message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const jsonMessage = JSON.stringify({ query: message });
      socketRef.current.send(jsonMessage);
      return true;
    }
    return false;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    addMessage(input, "user");
    
    // Try to send via WebSocket, otherwise add a default bot response
    if (!sendWebSocketMessage(input)) {
      // Fallback behavior when WebSocket is not connected
      setTimeout(() => {
        addMessage("I'm currently offline. Please check your connection and try again.", "bot");
      }, 1000);
    }
    
    setInput("");
  };

  // Handle send button click
  const handleSendClick = () => {
    if (!input.trim()) return;

    // Add user message
    addMessage(input, "user");
    
    // Try to send via WebSocket, otherwise add a default bot response
    if (!sendWebSocketMessage(input)) {
      // Fallback behavior when WebSocket is not connected
      setTimeout(() => {
        addMessage("I'm currently offline. Please check your connection and try again.", "bot");
      }, 1000);
    }
    
    setInput("");
  };

  // Initialize WebSocket when component opens
  useEffect(() => {
    if (open) {
      initializeWebSocket();
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [open]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentAgentMessage, open]);

  if (!open) return null;

  const allMessages = [...messages];
  
  // Add current streaming message if receiving
  if (isReceivingMessage && currentAgentMessage) {
    allMessages.push({
      sender: "bot",
      text: currentAgentMessage,
      time: getCurrentTime(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20 sm:bg-transparent"
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      <div className="w-full sm:w-[370px] sm:bottom-6 sm:right-6 sm:fixed sm:rounded-2xl sm:shadow-xl bg-white border border-gray-200 flex flex-col max-h-[90vh] h-[70vh] sm:h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-yellow-100 border-b border-yellow-200 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="flex font-bold text-lg text-gray-900">
              <img
                src="/Logo.svg"
                alt="GovPulse"
                className="h-4 w-20 object-contain"
              />{" "}
              <span className="text-xs font-medium bg-yellow-200 px-2 py-0.5 rounded ml-1">
                AI
              </span>
            </span>
            {/* Connection status indicator */}
            <div className="flex items-center ml-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected
                    ? "bg-green-500"
                    : isConnecting
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white">
          {allMessages.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.sender === "bot"
                  ? "flex items-start gap-2"
                  : "flex items-end justify-end gap-2"
              }
            >
              {msg.sender === "bot" && (
                <span className="w-2 h-2 mt-2 bg-yellow-400 rounded-full inline-block" />
              )}
              <div
                className={
                  msg.sender === "bot"
                    ? "bg-yellow-100 border border-yellow-200 text-gray-900 px-3 py-2 rounded-lg text-sm max-w-[80%]"
                    : "bg-white border border-gray-200 text-gray-900 px-3 py-2 rounded-lg text-sm max-w-[80%] shadow break-words whitespace-pre-line"
                }
              >
                {msg.sender === "bot" ? (
                  <MarkdownRenderer content={msg.text} />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 mt-2 bg-yellow-400 rounded-full inline-block" />
              <div className="bg-yellow-100 border border-yellow-200 text-gray-900 px-3 py-2 rounded-lg text-sm max-w-[80%] flex items-center gap-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
                <span className="ml-2 text-xs text-gray-500">typing...</span>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
        
        {/* Input area */}
        <div className="px-4 py-3 border-t border-gray-200 bg-white">
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 w-full border border-gray-200 h-12 min-h-[48px] overflow-hidden">
            <input
              className="flex-1 min-w-0 bg-gray-50 text-gray-800 text-base py-1 px-0 border-none outline-none placeholder:text-gray-500 placeholder:font-normal truncate"
              style={{ boxShadow: "none" }}
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendClick();
                }
              }}
            />
            <button
              type="button"
              tabIndex={-1}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:outline-none focus:ring-0 flex-shrink-0"
              aria-label="Attach file"
              style={{ background: "none", border: "none" }}
            >
              <FiPaperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSendClick}
              className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus-visible:outline-none focus:ring-0 flex-shrink-0"
              aria-label="Send"
              style={{ background: "none", border: "none" }}
            >
              <FiSend className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}