import React, { useEffect, useRef, useState } from "react";

// layout
let idCounter = 0;

function layoutTree(root) {
  idCounter = 0;

  const nodes = [];
  const edges = [];

  function getLeafCount(node) {
    if (!node) return 0;
    if (!node.left && !node.right) return 1;
    return getLeafCount(node.left) + getLeafCount(node.right);
  }

  function traverse(node, depth = 0, xStart = 0, width = 600, parent = null) {
    if (!node) return;

    const x = xStart + width / 2;

    const current = {
      ...node,
      id: idCounter++,
      px: x,
      py: depth * 95 + 60,
    };

    nodes.push(current);

    if (parent) {
      edges.push({
        from: parent.id,
        to: current.id,
      });
    }

    const leftLeaves = getLeafCount(node.left);
    const rightLeaves = getLeafCount(node.right);
    const total = leftLeaves + rightLeaves || 1;

    const leftWidth = (width * leftLeaves) / total;
    const rightWidth = (width * rightLeaves) / total;

    if (node.left) {
      traverse(node.left, depth + 1, xStart, leftWidth, current);
    }

    if (node.right) {
      traverse(
        node.right,
        depth + 1,
        xStart + leftWidth,
        rightWidth,
        current
      );
    }
  }

  const totalLeaves = getLeafCount(root);
  const baseWidth = Math.max(totalLeaves * 70, 600);

  traverse(root, 0, 0, baseWidth);

  return { nodes, edges, width: baseWidth };
}

// component
export const HuffmanTreeViz = ({ tree, codes }) => {
  const containerRef = useRef(null);
  const [layout, setLayout] = useState({
    nodes: [],
    edges: [],
    width: 800,
    height: 400,
  });

  useEffect(() => {
    if (!tree) return;

    const { nodes, edges, width } = layoutTree(tree);

    const nodeMap = Object.fromEntries(
      nodes.map((n) => [n.id, n])
    );

    const mappedEdges = edges.map((e) => ({
      from: nodeMap[e.from],
      to: nodeMap[e.to],
    }));

    const height =
      Math.max(...nodes.map((n) => n.py)) + 120;

    setLayout({
      nodes,
      edges: mappedEdges,
      width,
      height,
    });
  }, [tree]);

  if (!tree) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Send a message to generate a Huffman tree
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">

      {/* HEADER */}
      <div className="p-3 border-b text-xs">
        <div className="font-semibold">Huffman Tree</div>
        <div className="text-gray-400 text-[10px]">
          Green = leaf | Blue = internal nodes
        </div>
      </div>

      {/* TREE */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-auto"
      >
        <div
          className="relative"
          style={{
            width: layout.width,
            height: layout.height,
          }}
        >
          {/* EDGES */}
          <svg className="absolute top-0 left-0 w-full h-full">
            {layout.edges.map((edge, i) => (
              <line
                key={i}
                x1={edge.from.px}
                y1={edge.from.py}
                x2={edge.to.px}
                y2={edge.to.py}
                stroke="#3b82f6"
                strokeWidth="1.5"
              />
            ))}
          </svg>

          {/* NODES */}
          {layout.nodes.map((node) => {
            const isLeaf = !node.left && !node.right;

            return (
              <div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: node.px,
                  top: node.py,
                }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs shadow-md ${
                      isLeaf
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {node.char ?? node.freq}
                  </div>

                  <div className="text-[10px] text-gray-500 mt-1">
                    {node.freq}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      {codes && (
        <div className="p-3 border-t text-[10px]">
          <div className="mb-2 font-semibold text-gray-500">
            Codes
          </div>

          <div className="grid grid-cols-3 gap-1 max-h-24 overflow-auto">
            {Object.entries(codes).map(([char, code]) => (
              <div
                key={char}
                className="flex gap-1 bg-white dark:bg-gray-800 px-1 py-0.5 rounded"
              >
                <span className="font-bold">
                  {char === " " ? "␣" : char}
                </span>
                <span>:</span>
                <span className="text-green-500">{code}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};