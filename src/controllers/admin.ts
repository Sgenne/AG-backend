import path from "path";
import fs from "fs";
import util from "util";

import { Request, Response } from "express";
import sharp from "sharp";

import { BlogCategory } from "../models/blogCategory";
import { ImageCategory } from "../models/imageCategory";
import { BlogPost } from "../models/blogPost";
import { Image } from "../models/image";
import { ScrollingImage } from "../models/scrollingImage";

const ROOT_FOLDER = path.join(__dirname, "../");

const createImageCategory = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const categoryTitle = req.body.categoryTitle;

  if (!categoryTitle) {
    const error = new Error("Could not create category.");
    res.status(400);
    return next(error);
  }

  const category = new ImageCategory({
    title: categoryTitle,
  });

  try {
    await category.save();
  } catch (e) {
    const error = new Error("Invalid category");
    res.status(400);
    return next(error);
  }
  res.status(201).json({
    message: "Category created successfully.",
    "created-category": category,
  });
};

const createBlogCategory = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const title = req.body.title;
  const category = new BlogCategory({
    title: title,
  });

  try {
    await category.save();
  } catch (err) {
    console.log("error in createBlogCategory: ", err);
    const error = new Error("Could not create blog category.");
    res.status(500);
    return next(error);
  }

  res.status(201).json(
    JSON.stringify({
      message: "Blog category created successfully.",
      "created-category": category,
    })
  );
};

const createBlogPost = async (req: Request, res: Response, next: Function) => {
  const title = req.body.title;
  const category = req.body.category;
  const content = req.body.content;

  const blogPost = new BlogPost({
    title: title,
    category: category,
    content: content,
  });

  try {
    await blogPost.save();
  } catch (err) {
    const error = new Error("Could not create blog post.");
    res.status(500);
    return next(error);
  }

  res.status(201).json(
    JSON.stringify({
      message: "Blog post created successfully.",
      "created-post": blogPost,
    })
  );
};

const addScrollingImage = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const scrollingImageId = req.body["scrolling-image-id"];

  if (!scrollingImageId) {
    const error = new Error(
      "Please provide the id of the image to add to the scrolling images."
    );
    res.status(400);
    return next(error);
  }

  const newScrollingImage = new ScrollingImage({
    image: scrollingImageId,
  });

  try {
    await newScrollingImage.save();
  } catch (err) {
    console.trace(err);
    const error = new Error(
      "Something went wrong while adding the new scrolling image."
    );
    res.status(500);
    return next(error);
  }

  res.status(200).json({
    message: "Scrolling image added successfully.",
  });
};

const deleteScrollingImage = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const scrollingImageId = req.body["scrolling-image-id"];

  if (!scrollingImageId) {
    const error = new Error(
      "Please provide the id of the scrolling image to delete."
    );
    res.status(400);
    return next(error);
  }

  await ScrollingImage.findByIdAndDelete(scrollingImageId, {}, (err, found) => {
    if (!found) {
      const error = new Error("No scrolling image with that id exists.");
      res.status(400);
      return next(error);
    }
  });

  res.status(200).json({
    message: "Image deleted successfully.",
  });
};

// verifies an uploaded image, adds compressed version, and stores to file system and database
const handleUploadedImage = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const category = req.body.category;

  if (!req.file) {
    const error = new Error("No image was provided.");
    res.status(400);
    throw error;
  }

  if (!category) {
    const error = new Error("No category was provided");
    res.status(400);
    return next(error);
  }

  if (
    !(req.file.mimetype === "image/jpg" || req.file.mimetype === "image/jpeg")
  ) {
    const error = new Error("Invalid image format.");
    res.status(400);
    return next(error);
  }

  const compressedImageName = "comp" + req.file.originalname;
  const compressedImagePath = `images/compressed/${compressedImageName}`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpg")
    .toFile(compressedImagePath);

  const imagePath = path.join("images", "gallery", req.file.originalname);

  fs.writeFileSync(path.join(ROOT_FOLDER, imagePath), req.file.buffer);

  const image = new Image({
    imageUrl: `${process.env.HOST_NAME}:${process.env.PORT}/${imagePath}}`,
    compressedImageUrl: `${process.env.HOST_NAME}:${process.env.PORT}/${compressedImagePath}`,
    category: category,
  });

  try {
    await image.save();
  } catch (err) {
    await Promise.all([
      util.promisify(fs.unlink)(path.join(ROOT_FOLDER, imagePath)),
      util.promisify(fs.unlink)(path.join(ROOT_FOLDER, compressedImagePath)),
    ]);
    const error = new Error("Could not update database.");
    res.status(500);
    return next(error);
  }

  res.status(200).json(
    JSON.stringify({
      message: "Image uploaded successfully.",
      image: image,
    })
  );
};
export default {
  createImageCategory,
  createBlogCategory,
  createBlogPost,
  addScrollingImage,
  deleteScrollingImage,
  handleUploadedImage,
};
