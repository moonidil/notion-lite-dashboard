import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import authRouter from "./auth.js";
import notesRouter from "./notes.js";
import tasksRouter from "./tasks.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Unauthenticated" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.userId };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter(prisma));
app.use("/api/notes", requireAuth, notesRouter(prisma));
app.use("/api/tasks", requireAuth, tasksRouter(prisma));

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
