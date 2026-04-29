import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRoutes from "./src/routes/chatRoutes.js";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

//  Mount ONLY the chat route 
app.use("/api", chatRoutes);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});