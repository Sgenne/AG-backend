require("dotenv").config();

const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const uploadImages = require("./middleware/uploadImages");
const authMiddleware = require("./middleware/auth");

const galleryRoutes = require("./routes/gallery");
const adminRoutes = require("./routes/admin");
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");

const errors = require("./middleware/handleErrors");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/gallery", galleryRoutes);
app.use("/blog", blogRoutes);
app.use("/admin", authMiddleware.authenticateUser, adminRoutes);
app.use("/auth", authRoutes);

app.use(errors.handle404);
app.use(errors.handleErrors);

mongoose.connect(process.env.DB_URI).then(() => {
  app.listen(process.env.PORT);
});
