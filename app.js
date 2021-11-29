require("dotenv").config();

const path = require("path");

const express = require("express");
const mongoose = require("mongoose");

const uploadImages = require("./middleware/uploadImages");
const galleryRoutes = require("./routes/gallery");

const adminRoutes = require("./routes/admin");
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth"); 

const handleErrors = require("./middleware/handleErrors");

const app = express();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/upload-image", uploadImages);

app.use("/gallery", galleryRoutes);
app.use("/blog", blogRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

app.use(handleErrors);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(8080);
  });
