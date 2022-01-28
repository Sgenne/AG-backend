import dotenv from "dotenv";

import path from "path";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { authenticateUser } from "./middleware/auth";

import galleryRoutes from "./routes/gallery";
import adminRoutes from "./routes/admin";
import blogRoutes from "./routes/blog";
import authRoutes from "./routes/auth";

import { handle404 } from "./middleware/handleErrors";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "../", "images")));

app.use("/gallery", galleryRoutes);
app.use("/blog", blogRoutes);
app.use("/admin", authenticateUser, adminRoutes);
app.use("/auth", authRoutes);

app.use(handle404);

mongoose.connect(process.env.DB_URI ? process.env.DB_URI : "8080").then(() => {
  app.listen(process.env.PORT ? process.env.PORT : 8080);
});
