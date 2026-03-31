import React, { useState } from "react";
import { ChatMain } from "./components/ChatMain";
import { HuffmanSidebar } from "./components/HuffmanSideBar";
import { Cpu, User } from "lucide-react";

const App = () => {
  const [huffmanData, setHuffmanData] = useState({
    user: null,
    ai: null,
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Panel - AI Huffman Stats */}
      <div className="hidden w-1/4 flex-col border-r bg-muted/30 md:flex">
        <HuffmanSidebar
          title="AI Response Analysis"
          huffman={huffmanData.ai}
          icon={Cpu}
          colorClass="bg-purple-600"
        />
      </div>

      {/* Main Chat Area - 1/2 width (centered) */}
      <div className="flex flex-1 flex-col md:w-1/2 md:flex-none">
        <ChatMain onHuffmanUpdate={setHuffmanData} />
      </div>

      {/* Right Panel - User Huffman Stats */}
      <div className="hidden w-1/4 flex-col border-l bg-muted/30 md:flex">
        <HuffmanSidebar
          title="User Input Analysis"
          huffman={huffmanData.user}
          icon={User}
          colorClass="bg-blue-600"
          alignRight
        />
      </div>
    </div>
  );
};

export default App;
