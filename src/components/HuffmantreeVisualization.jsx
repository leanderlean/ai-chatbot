import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TreeNode = ({
  node,
  x,
  y,
  level,
  maxLevel,
  parentX = null,
  parentY = null,
  isLeft = null,
}) => {
  const canvas = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (canvas.current && parentX !== null && parentY !== null) {
      const ctx = canvas.current.getContext("2d");
      ctx.beginPath();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = hovered ? 2 : 1;
      ctx.moveTo(parentX, parentY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }, [x, y, parentX, parentY, hovered]);

  if (!node) return null;

  const radius = 16; // Smaller radius
  const isLeaf = !node.left && !node.right;
  const nodeColor = isLeaf
    ? "bg-gradient-to-br from-green-500 to-green-600"
    : "bg-gradient-to-br from-blue-500 to-purple-600";

  // Adjust horizontal spacing based on level
  const horizontalSpacing = 120 / Math.pow(1.2, level - 1); // Smaller spacing

  return (
    <>
      {/* Line canvas for connections */}
      {parentX !== null && parentY !== null && (
        <canvas
          ref={canvas}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        />
      )}

      {/* Node */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
        style={{ left: x, top: y, zIndex: 2 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={cn(
            "relative flex flex-col items-center",
            hovered && "scale-105 transition-transform", // Smaller scale on hover
          )}
        >
          {/* Node circle - smaller */}
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shadow-md", // Smaller from w-12 h-12 to w-8 h-8
              nodeColor,
              hovered && "ring-2 ring-blue-300/50", // Thinner ring
            )}
          >
            <span className="text-white font-bold text-xs">
              {" "}
              {/* Smaller text */}
              {node.char !== null ? node.char : node.freq}
            </span>
          </div>

          {/* Frequency badge - smaller and closer */}
          <div className="absolute -bottom-4 bg-gray-800 text-[10px] px-1.5 py-0.5 rounded-full text-gray-300 border border-gray-700 whitespace-nowrap">
            {node.freq}
          </div>
        </div>
      </div>

      {/* Recursively render children with adjusted spacing */}
      {node.left && (
        <TreeNode
          node={node.left}
          x={x - horizontalSpacing}
          y={y + 50} // Smaller vertical spacing
          level={level + 1}
          maxLevel={maxLevel}
          parentX={x}
          parentY={y}
          isLeft={true}
        />
      )}
      {node.right && (
        <TreeNode
          node={node.right}
          x={x + horizontalSpacing}
          y={y + 50} // Smaller vertical spacing
          level={level + 1}
          maxLevel={maxLevel}
          parentX={x}
          parentY={y}
          isLeft={false}
        />
      )}
    </>
  );
};

export const HuffmanTreeViz = ({ tree, codes, title }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });

      // Add resize observer to handle container size changes
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  if (!tree) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-muted-foreground/40 space-y-4">
        <div className="p-4 rounded-full bg-muted/20">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-sm font-light text-center">
          Send a message to visualize the Huffman tree
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-muted/10">
      <div className="p-3 border-b bg-card/50">
        {" "}
        {/* Smaller padding */}
        <h3 className="font-semibold text-xs">Huffman Tree</h3>{" "}
        {/* Smaller text */}
        <p className="text-[10px] text-muted-foreground">
          Green: characters | Blue: internal nodes
        </p>
      </div>

      {/* Tree Visualization */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-auto min-h-[250px] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      >
        {dimensions.width > 0 && (
          <div className="relative w-full h-[400px]">
            {" "}
            {/* Fixed height container */}
            <TreeNode
              node={tree}
              x={dimensions.width / 2}
              y={30} // Start higher
              level={1}
              maxLevel={5}
            />
          </div>
        )}
      </div>

      {/* Codes Table - more compact */}
      {codes && Object.keys(codes).length > 0 && (
        <div className="p-3 border-t bg-card/50">
          {" "}
          {/* Smaller padding */}
          <h4 className="text-[10px] font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
            Character Codes
          </h4>
          <div className="grid grid-cols-3 gap-1 max-h-20 overflow-y-auto scrollbar-thin">
            {" "}
            {/* 3 columns instead of 4 */}
            {Object.entries(codes).map(([char, code]) => (
              <div
                key={char}
                className="flex items-center gap-1 text-[10px] bg-background/50 p-1 rounded"
              >
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {char === " " ? "␣" : char}
                </span>
                <span className="text-muted-foreground">:</span>
                <span className="font-mono text-green-600 dark:text-green-400 truncate">
                  {code}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
