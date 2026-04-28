import { useState } from "react";
import { Activity, Binary } from "lucide-react";
import { cn } from "@/lib/utils";

export const HuffmanSidebar = ({
  title,
  huffman,
  icon: Icon,
  colorClass,
  alignRight,
}) => {
  const [activeTab, setActiveTab] = useState("stream");

  if (!huffman) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-muted-foreground/40 space-y-4">
        <div className="p-4 rounded-full bg-muted/20">
          <Icon className="w-8 h-8 stroke-1" />
        </div>
        <p className="text-sm font-light text-center">Waiting for data...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-muted/10">
      {/* Header */}
      <div
        className={cn(
          "p-6 border-b bg-card/50 backdrop-blur-sm",
          alignRight ? "text-right" : "",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 mb-1",
            alignRight ? "flex-row-reverse" : "",
          )}
        >
          <div className={cn("p-2 rounded-md shadow-sm", colorClass)}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">
            {title}
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-light">
          Huffman Encoding Analysis
        </span>
      </div>

      <div className="flex border-b bg-card/30">
        <button
          onClick={() => setActiveTab("stream")}
          className={cn(
            "flex-1 px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 transition-colors",
            activeTab === "stream"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Binary className="w-3 h-3" />
          Binary Stream
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "stream" ? (
          <div className="h-full p-6 space-y-6 flex flex-col">
            <div className="space-y-2 flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Encoded Data
                </span>
                <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                  {huffman.encoded?.length || 0} bits
                </span>
              </div>
              <div className="flex-1 bg-white dark:bg-zinc-900 rounded-lg border p-4 font-mono text-[10px] leading-relaxed text-gray-500 break-all overflow-y-auto shadow-inner hover:text-gray-700 transition-colors scrollbar-thin scrollbar-thumb-gray-200">
                {huffman.encoded}
              </div>
            </div>

            <div className="shrink-0 space-y-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Performance
              </span>
              <div className="bg-white dark:bg-zinc-900 rounded-xl border p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-foreground/80 font-medium">
                    Compression Ratio
                  </span>
                </div>
                <span className="text-2xl font-bold text-foreground tracking-tight">
                  {huffman.compression?.ratio || "0%"}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
