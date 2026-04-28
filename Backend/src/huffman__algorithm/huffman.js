// =====================
// Huffman Node
// =====================
class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

// =====================
// Build Frequency Map
// =====================
export function buildFrequencyMap(text) {
  const freqMap = {};
  for (let char of text) {
    freqMap[char] = (freqMap[char] || 0) + 1;
  }
  return freqMap;
}

// =====================
// Build Huffman Tree (STABLE)
// =====================
export function buildHuffmanTree(freqMap) {
  let nodes = [];

  for (let char in freqMap) {
    nodes.push(new HuffmanNode(char, freqMap[char]));
  }

  // Edge case: empty input
  if (nodes.length === 0) return null;

  while (nodes.length > 1) {
    // Stable sort (important!)
    nodes.sort((a, b) => {
      if (a.freq !== b.freq) return a.freq - b.freq;
      return (a.char || "").localeCompare(b.char || "");
    });

    const left = nodes.shift();
    const right = nodes.shift();

    const newNode = new HuffmanNode(
      null,
      left.freq + right.freq,
      left,
      right
    );

    nodes.push(newNode);
  }

  return nodes[0];
}

// =====================
// Generate Codes
// =====================
export function generateCodes(node, prefix = "", codeMap = {}) {
  if (!node) return codeMap;

  // Leaf node
  if (node.char !== null) {
    codeMap[node.char] = prefix || "0"; // handle single char case
    return codeMap;
  }

  generateCodes(node.left, prefix + "0", codeMap);
  generateCodes(node.right, prefix + "1", codeMap);

  return codeMap;
}

// =====================
// Encode Text → Bit String
// =====================
export function encode(text, codes) {
  return text
    .split("")
    .map((char) => {
      if (!(char in codes)) {
        throw new Error(`Character "${char}" not in code map`);
      }
      return codes[char];
    })
    .join("");
}

// =====================
// Pack Bits → Buffer
// =====================
export function packBitsToBuffer(bitString) {
  if (!bitString || bitString.length === 0) {
    return {
      buffer: Buffer.alloc(0),
      bitLength: 0,
    };
  }

  const bitLength = bitString.length;
  const paddedLength = Math.ceil(bitLength / 8) * 8;
  const paddedBits = bitString.padEnd(paddedLength, "0");

  const bytes = [];

  for (let i = 0; i < paddedBits.length; i += 8) {
    bytes.push(parseInt(paddedBits.slice(i, i + 8), 2));
  }

  return {
    buffer: Buffer.from(bytes),
    bitLength,
  };
}

// =====================
// Unpack Buffer → Bits
// =====================
export function unpackBufferToBits(buffer, bitLength) {
  if (!buffer || bitLength === 0) return "";

  const bits = Array.from(buffer)
    .map((byte) => byte.toString(2).padStart(8, "0"))
    .join("");

  return bits.slice(0, bitLength);
}

// =====================
// Decode Bits → Text (SAFE)
// =====================
export function decode(encoded, tree) {
  if (!tree) return "";

  let result = "";
  let current = tree;

  for (let bit of encoded) {
    if (!current) {
      throw new Error("Invalid encoded data (bad tree traversal)");
    }

    current = bit === "0" ? current.left : current.right;

    if (current && current.char !== null) {
      result += current.char;
      current = tree;
    }
  }

  // Ensure no leftover partial traversal
  if (current !== tree) {
    throw new Error("Incomplete bit sequence");
  }

  return result;
}

// =====================
// Compression Wrapper
// =====================
export function compress(text) {
  if (!text || text.length === 0) {
    return {
      buffer: Buffer.alloc(0),
      bitLength: 0,
      freqMap: {},
    };
  }

  const freqMap = buildFrequencyMap(text);
  const tree = buildHuffmanTree(freqMap);
  const codes = generateCodes(tree);

  const encoded = encode(text, codes);
  const { buffer, bitLength } = packBitsToBuffer(encoded);

  return {
    buffer,
    bitLength,
    freqMap, // REQUIRED for decoding
  };
}

// =====================
// Decompression Wrapper
// =====================
export function decompress({ buffer, bitLength, freqMap }) {
  if (!buffer || bitLength === 0) return "";

  const tree = buildHuffmanTree(freqMap);
  const bits = unpackBufferToBits(buffer, bitLength);

  return decode(bits, tree);
}

// =====================
// Compression Stats
// =====================
export function calculateCompression(original, bitLength) {
  const originalBits = original.length * 8;
  const compressedBits = bitLength;

  const ratio = ((1 - compressedBits / originalBits) * 100).toFixed(2);

  return {
    originalBits,
    compressedBits,
    ratio: ratio + "%",
  };
}