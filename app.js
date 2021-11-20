/*
TODO
=====
  *CLEANUP

  * Create categories
  * Fetch categories and fetch images from a given category
*/

const path = require("path");

const express = require("express");
const mongoose = require("mongoose");

const credentials = require("./credentials");
const uploadImages = require("./middleware/uploadImages");
const galleryRoutes = require("./routes/gallery");
const adminRoutes = require("./routes/admin");
const handleErrors = require("./middleware/handleErrors");

/*
TODO
========
* Handle next(error)
  * Make try catch more local
*/

const app = express();

app.use(express.json());
app.use("/bilder", express.static(path.join(__dirname, "images")));

app.use("/upload-image", uploadImages);

app.use(galleryRoutes);
app.use(adminRoutes);
app.use(handleErrors);

mongoose
  .connect(
    `mongodb+srv://${credentials.username}:${credentials.password}@cluster0.fljdh.mongodb.net/${credentials.databaseName}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(8080);
  });
