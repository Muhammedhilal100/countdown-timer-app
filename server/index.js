import "dotenv/config";
import express from "express";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

import { connectDB } from "./db.js";
import timersRouter from "./routes/timers.js";
import publicRouter from "./routes/public.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(compression());

const PORT = process.env.PORT || 3000;

await connectDB(process.env.MONGODB_URI);




// Admin API
app.use("/api/timers", timersRouter);

// Public (App proxy)
app.use("/proxy", publicRouter);

// Serve Admin UI build when in production
app.use("/admin", express.static(path.join(__dirname, "../client/dist")));

// Serve widget bundle if hosted by server
app.use("/widget", express.static(path.join(__dirname, "../widget/dist")));

app.get("/smak", (req, res) => {
  res.send("SMAK is the KING");
});

app.get("/", (req, res) => {
  res.send("Countdown Timer App is running");
});

app.listen(PORT, () => console.log(`[Server] Listening on ${PORT}`));
