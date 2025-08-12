import { useState, useRef, useEffect } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";

interface Message {
  sender: "bot" | "user";
  text: string;
}

const initialMessages: Message[] = [
  {
    sender: "bot",
    text: "👋 Hello! I can help you report an issue. Do you want to continue in Sinhala or English?",
  },
  {
    sender: "user",
    text: "I'll speak in English",
  },
  {
    sender: "bot",
    text: "Great! Please describe the issue in detail.",
  },
  {
    sender: "user",
    text: "Main road to the divisional hospital in Matugama is broken for months. Ambulances can't get through.",
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
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  if (!open) return null;

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
          {messages.map((msg, idx) => (
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
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {/* Input area */}
        <form
          className="px-4 py-3 border-t border-gray-200 bg-white"
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            setMessages([...messages, { sender: "user", text: input }]);
            setInput("");
          }}
        >
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 w-full border border-gray-200 h-12 min-h-[48px] overflow-hidden">
            <input
              className="flex-1 min-w-0 bg-gray-50 text-gray-800 text-base py-1 px-0 border-none outline-none placeholder:text-gray-500 placeholder:font-normal truncate"
              style={{ boxShadow: "none" }}
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
              type="submit"
              className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus-visible:outline-none focus:ring-0 flex-shrink-0"
              aria-label="Send"
              style={{ background: "none", border: "none" }}
            >
              <FiSend className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
