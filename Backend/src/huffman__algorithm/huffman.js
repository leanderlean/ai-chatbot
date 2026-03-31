class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

export function buildFrequencyMap(text) {
  const freqMap = {};
  for (let char of text) {
    freqMap[char] = (freqMap[char] || 0) + 1;
  }

  return freqMap;
}

export function buildHuffmanTree(freqMap) {
  let nodes = [];

  for (let char in freqMap) {
    nodes.push(new HuffmanNode(char, freqMap[char]));
  }

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);

    const left = nodes.shift();
    const right = nodes.shift();

    const newNode = new HuffmanNode(null, left.freq + right.freq, left, right);
    nodes.push(newNode);
  }

  return nodes[0];
}

export function generateCodes(node, prefix = "", codeMap = {}) {
  if (!node) return;
  if (node.char !== null) {
    codeMap[node.char] = prefix;
  }

  generateCodes(node.left, prefix + "0", codeMap);
  generateCodes(node.right, prefix + "1", codeMap);
  return codeMap;
}

export function encode(text, codes) {
  return text
    .split("")
    .map((char) => codes[char])
    .join("");
}

export function decode(encoded, tree) {
  let result = "";
  let current = tree;

  for (let bit of encoded) {
    current = bit === "0" ? current.left : current.right;

    if (current.char !== null) {
      result += current.char;
      current = tree;
    }
  }

  return result;
}

export function calculateCompression(original, encoded) {
  const originalBits = original.length * 8;
  const compressedBits = encoded.length;

  const ratio = ((1 - compressedBits / originalBits) * 100).toFixed(2);

  return {
    originalBits,
    compressedBits,
    ratio: ratio + "%",
  };
}
