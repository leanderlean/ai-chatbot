import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ArrowRight, MoreVertical, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

const CHAT_STORAGE_KEY = "huffman-chat-conversation";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_BASE_URL = configuredApiUrl
  ? configuredApiUrl.replace(/\/$/, "")
  : import.meta.env.DEV
    ? `${window.location.protocol}//${window.location.hostname}:3000`
    : "";

const MessageBubble = ({ message, isUserMessage }) => (
  <div
    className={`flex items-start gap-3 ${
      isUserMessage ? "justify-end" : ""
    }`}
  >
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg ${
        isUserMessage
          ? "bg-blue-600 text-white rounded-br-sm"
          : "bg-[#303030] text-gray-100 rounded-bl-sm"
      }`}
    >
      <p className="leading-relaxed">{message}</p>
    </div>
  </div>
);

export function ChatMain({ onHuffmanUpdate }) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const saved = window.localStorage.getItem(CHAT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const lastUser = [...messages]
      .reverse()
      .find((m) => m.sender === "user" && m.huffman);

    const lastAI = [...messages]
      .reverse()
      .find((m) => m.sender === "other" && m.huffman);

    onHuffmanUpdate?.({
      user: lastUser?.huffman || null,
      ai: lastAI?.huffman || null,
    });
  }, [messages, onHuffmanUpdate]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);

    const tempId = Date.now().toString();

    const userMsg = {
      id: tempId,
      sender: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPrompt: userMsg.content }),
      });

      const data = await res.json();

      const updatedUser = {
        ...userMsg,
        content: data.user.original,
        huffman: data.user,
      };

      const aiMsg = {
        id: Date.now() + "_ai",
        sender: "other",
        content: data.bot.original,
        huffman: data.bot,
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? updatedUser : m)).concat(aiMsg),
      );
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] w-full">

      {/* HEADER (RESTORED) */}
      <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-[#1e1e1e]">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-blue-600 text-white">
              AI
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-white font-semibold">Professor SeAi</h2>
            <p className="text-xs text-gray-400">
              Huffman Compression Chatbot
            </p>
          </div>
        </div>

        <Button variant="ghost">
          <MoreVertical className="text-gray-300" />
        </Button>
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <Cpu className="w-16 h-16 mb-4 text-blue-500/50" />
            <p>Start chatting to see Huffman compression</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg.content}
            isUserMessage={msg.sender === "user"}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask something..."
          />

          <Button onClick={handleSendMessage} disabled={isLoading}>
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}