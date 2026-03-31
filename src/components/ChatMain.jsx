import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ArrowRight, MoreVertical, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MessageBubble = ({ message, isUserMessage, avatarSrc }) => (
  <div
    className={cn(
      "flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
      isUserMessage ? "justify-end" : "",
    )}
  >
    {!isUserMessage && (
      <Avatar className="h-8 w-8 mt-1 border-2 border-blue-500/20 shadow-lg">
        <AvatarImage src={avatarSrc || "/placeholder.svg"} alt="Avatar" />
        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          AI
        </AvatarFallback>
      </Avatar>
    )}

    <div
      className={cn(
        "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg",
        isUserMessage
          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm"
          : "bg-[#303030] border-0 text-gray-100 rounded-bl-sm",
      )}
    >
      <p className="leading-relaxed">{message}</p>
    </div>
  </div>
);

export function ChatMain({ onHuffmanUpdate }) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const currentChatUser = {
    name: "Professor SeAi",
    avatarSrc: "/placeholder.svg?height=40&width=40",
    description: "Your software engineer ai professor",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update parent with latest Huffman stats whenever messages change
  useEffect(() => {
    const lastUserMsg = [...messages]
      .reverse()
      .find((m) => m.sender === "user" && m.huffman);
    const lastAiMsg = [...messages]
      .reverse()
      .find((m) => m.sender === "other" && m.huffman);

    if (onHuffmanUpdate) {
      onHuffmanUpdate({
        user: lastUserMsg?.huffman || null,
        ai: lastAiMsg?.huffman || null,
      });
    }
  }, [messages, onHuffmanUpdate]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const tempId = Date.now().toString();
    const newMessage = {
      id: tempId,
      sender: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    try {
      await fetch("http://localhost:3000/api/userMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPrompt: newMessage.content }),
      });

      const aiRes = await fetch("http://localhost:3000/api/aiResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPrompt: newMessage.content }),
      });

      const data = await aiRes.json();

      if (data.success) {
        const userMessageWithStats = {
          id: tempId,
          sender: "user",
          content: data.user.original,
          huffman: data.user,
        };

        const aiMessage = {
          id: Date.now().toString() + "_ai",
          sender: "other",
          avatarSrc: "/placeholder.svg?height=32&width=32",
          content: data.bot.original,
          huffman: data.bot,
        };

        setMessages((prev) =>
          prev
            .map((msg) => (msg.id === tempId ? userMessageWithStats : msg))
            .concat(aiMessage),
        );
      }
    } catch (error) {
      alert("Failed to get response");
      console.error("Error exchanging messages:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] relative w-full">
      <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-[#1e1e1e] backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-blue-500/30 shadow-lg">
            <AvatarImage
              src={currentChatUser.avatarSrc || "/placeholder.svg"}
              alt={currentChatUser.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              {currentChatUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-gray-100">
              {currentChatUser.name}
            </h2>
            <p className="text-gray-400 text-xs font-medium">
              {currentChatUser.description}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-gray-100 hover:bg-gray-800"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent bg-gradient-to-b from-[#1a1a1a] to-[#1e1e1e]">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
              <Cpu className="w-16 h-16 mb-4 stroke-1 relative text-blue-500/50" />
            </div>
            <p className="text-gray-500">
              Start a conversation to see Huffman encoding in action
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg.content}
            isUserMessage={msg.sender === "user"}
            avatarSrc={msg.avatarSrc}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800 bg-[#1e1e1e]">
        <div className="flex items-center gap-2 bg-[#2a2a2a] p-2 rounded-full border border-gray-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <Input
            placeholder="Ask about algorithms..."
            className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-gray-200"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            size="icon"
            className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 shrink-0 text-white"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-600">
            AI can make mistakes. Review generated code.
          </p>
        </div>
      </div>
    </div>
  );
}
