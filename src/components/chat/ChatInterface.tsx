import React, { useState, useRef, useEffect } from "react";
// @ts-ignore react-markdown default export typing
import ReactMarkdown from "react-markdown";
import type { ChatInterfaceProps, ChatState, ChatMessage } from "./types/chat";

// lightweight utility to detect if string contains likely markdown
function looksLikeMarkdown(s: string): boolean {
  return /\*\*|\*[^*]|`|\n\s*[-*]\s|\n\s*\d+\.\s|^#\s/m.test(s);
}
// kept for future conditional markdown rendering
void looksLikeMarkdown;

const MAX_CHARS = 150;
const NEAR_LIMIT_THRESHOLD = 30; // show warning styling when this close

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  initialOpen = true,
  position = "bottom-right",
}) => {
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: initialOpen,
    isMinimized: false,
    messages: [],
    isTyping: false,
    inputValue: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const toggleChat = () => {
    setChatState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
      isMinimized: false,
    }));
  };

  const minimizeChat = () => {
    setChatState((prev) => ({
      ...prev,
      isMinimized: true,
      isOpen: false,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    // allow typing beyond limit but mark invalid; do not truncate
    setChatState((prev) => ({ ...prev, inputValue: next }));
  };

  const isOverLimit = chatState.inputValue.length > MAX_CHARS;
  const isNearLimit =
    !isOverLimit &&
    MAX_CHARS - chatState.inputValue.length <= NEAR_LIMIT_THRESHOLD;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatState.inputValue.trim()) return;
    if (isOverLimit) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatState.inputValue,
      timestamp: new Date(),
      sender: "user",
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      inputValue: "",
      isTyping: true,
    }));

    // Call backend API
    (async () => {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        
        // Dev mode is now handled entirely on the backend
        // No need to send headers - backend checks environment variables
        console.log('Sending chat request (dev mode handled by backend)');
        
        const res = await fetch("/api/chat", {
          method: "POST",
          headers,
          body: JSON.stringify({
            message: newMessage.content,
            history: chatState.messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.content,
            })),
          }),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Request failed: ${res.status}`);
        }
        const data = await res.json();
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content:
            data?.reply && typeof data.reply === "string"
              ? data.reply
              : data?.inScope === false
                ? "I can only answer questions about Andrew’s projects, blog posts, or resume."
                : "Sorry, I could not generate a response.",
          timestamp: new Date(),
          sender: "assistant",
        };
        setChatState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isTyping: false,
        }));
      } catch (e: any) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content:
            "There was an error contacting the server. Please try again later.",
          timestamp: new Date(),
          sender: "assistant",
        };
        setChatState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isTyping: false,
        }));
      }
    })();
  };

  const positionClasses =
    position === "bottom-right" ? "bottom-4 right-4" : "bottom-4 left-4";

  if (!chatState.isOpen && !chatState.isMinimized) {
    return (
      <div className={`fixed ${positionClasses} z-50`}>
        <button
          onClick={toggleChat}
          className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group"
          aria-label="Open chat"
        >
          <svg
            className="w-6 h-6 transition-transform group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      <div className="bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col fixed inset-0 w-screen h-screen rounded-none md:static md:w-[28rem] md:h-[40rem] md:rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Kira - Portfolio Assistant
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={minimizeChat}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Minimize chat"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7-7m0 0l-7 7m7-7v18"
                />
              </svg>
            </button>
            <button
              onClick={toggleChat}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close chat"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatState.messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
              <p>
                Hi, I am Kira, Andrew's Portfolio Assitant. You can ask me
                anything about his portfolio, including blog posts, projects,
                and his resume. You can ask things like; "Tell me about his last
                job", "Summarize his resume", or "Tell me about a project that
                used Kubernetes"
              </p>
            </div>
          )}

          {chatState.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                {message.sender === "assistant" ? (
                  <div className="markdown-content text-inherit">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <div className="font-bold text-base">{children}</div>
                        ),
                        h2: ({ children }) => (
                          <div className="font-bold text-sm">{children}</div>
                        ),
                        h3: ({ children }) => (
                          <div className="font-semibold text-sm">
                            {children}
                          </div>
                        ),
                        p: ({ children }) => (
                          <div className="mb-1 last:mb-0">{children}</div>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside my-1 space-y-0.5">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside my-1 space-y-0.5">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-inherit">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-inherit">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-inherit">{children}</em>
                        ),
                        code: ({ children }) => (
                          <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}

          {chatState.isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={chatState.inputValue}
              onChange={handleInputChange}
              placeholder="Type your message..."
              aria-invalid={isOverLimit || undefined}
              aria-describedby="chat-char-remaining"
              maxLength={MAX_CHARS * 4} // soft-limit UX; server enforces real cap
              className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 text-sm dark:bg-gray-700 dark:text-white
                ${isOverLimit ? "border-red-500 focus:ring-red-500 border" : isNearLimit ? "border-amber-500 focus:ring-amber-500 border" : "border border-gray-300 dark:border-gray-600 focus:ring-blue-500"}`}
              disabled={chatState.isTyping}
            />
            <button
              type="submit"
              disabled={
                !chatState.inputValue.trim() ||
                chatState.isTyping ||
                isOverLimit
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
        {/* Char counter */}
        <div className="px-4 pb-4 -mt-2">
          <div
            id="chat-char-remaining"
            className={`text-xs text-right select-none ${isOverLimit ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-gray-500 dark:text-gray-400"}`}
          >
            {isOverLimit
              ? `Over limit by ${chatState.inputValue.length - MAX_CHARS}`
              : `${MAX_CHARS - chatState.inputValue.length} characters left`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
