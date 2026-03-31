import "dotenv/config";
import express from "express";
import cors from "cors";
import userMessageRoutes from "./src/routes/userMessageRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.use("/api", userMessageRoutes);
app.use("/api", aiRoutes);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
