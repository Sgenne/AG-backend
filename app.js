/*
TODO
========
  * blog
    * Model
      * title
      * timestamp
      * category
      * content (should eventually be html)
    * endpoints
      * get posts
      * get post by id
      * get post by category
      * get all categories
      * create category
      * create post     
*/

const path = require("path");

const express = require("express");
const mongoose = require("mongoose");

const credentials = require("./credentials");
const uploadImages = require("./middleware/uploadImages");
const galleryRoutes = require("./routes/gallery");
const adminRoutes = require("./routes/admin");
const handleErrors = require("./middleware/handleErrors");

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
