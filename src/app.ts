import dotenv from "dotenv";

import path from "path";

import express from "express";
import cors from "cors";

import { authenticateUser } from "./middleware/auth";

import galleryRoutes from "./routes/gallery";
import adminRoutes from "./routes/admin";
import blogRoutes from "./routes/blog";
import authRoutes from "./routes/auth";

import { handle404 } from "./middleware/handleErrors";

dotenv.config({path: path.join(__dirname, "../", ".env")});

const app = express();
app.use(cors());

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "../", "images")));

app.use("/gallery", galleryRoutes);
app.use("/blog", blogRoutes);
app.use("/admin", authenticateUser, adminRoutes);
app.use("/auth", authRoutes);

app.use(handle404);

export default app;

