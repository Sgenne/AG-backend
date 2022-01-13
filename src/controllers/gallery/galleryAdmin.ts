import path from "path";
import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import fs from "fs";

import { IImageDocument, Image } from "../../models/image";
import { ImageCategory } from "../../models/imageCategory";
import { IScrollingImage, ScrollingImage } from "../../models/scrollingImage";

const _ROOT_FOLDER_PATH = path.join(__dirname, "../../../");
const _GALLERY_IMAGE_FOLDER_PATH = path.join("images", "gallery");
const _COMPRESSED_IMAGE_FOLDER_PATH = path.join("images", "compressed");

export const createImageCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categoryTitle = req.body.categoryTitle;

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

// verifies an uploaded image, adds compressed version, and stores to file system and database
export const handleUploadedImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const category = req.body.category;

  const originalName = req.file.originalname;
  const compressedImageName = "(compressed)" + originalName;
  const compressedImagePath = path.join(
    _ROOT_FOLDER_PATH,
    _COMPRESSED_IMAGE_FOLDER_PATH,
    compressedImageName
  );
  const imagePath = path.join(
    _ROOT_FOLDER_PATH,
    _GALLERY_IMAGE_FOLDER_PATH,
    originalName
  );

  try {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpg")
      .toFile(compressedImagePath);

    fs.writeFileSync(imagePath, req.file.buffer);
  } catch (err) {
    console.trace(err);
    const error = new Error("Could not upload image.");
    res.status(500);
    return next(error);
  }

  const relativeImagePath = `${_GALLERY_IMAGE_FOLDER_PATH}/${originalName}`;
  const relativeCompressedImagePath = `${_COMPRESSED_IMAGE_FOLDER_PATH}/${compressedImageName}`;

  const image = new Image({
    imageUrl: `http://${process.env.HOST_NAME}:${process.env.PORT}/${relativeImagePath}`,
    compressedImageUrl: `http://${process.env.HOST_NAME}:${process.env.PORT}/${relativeCompressedImagePath}`,
    relativeImagePath: relativeImagePath,
    relativeCompressedImagePath: relativeCompressedImagePath,
    category: category.toLowerCase(),
  });

  try {
    await image.save();
  } catch (err) {
    console.trace(err);
    await image.unlink();
    const error = new Error("Could not update database.");
    res.status(500);
    return next(error);
  }

  res.status(200).json({
    message: "Image uploaded successfully.",
    image: image,
  });
};

export const deleteImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imageId: string = req.body.imageId;
  let image: IImageDocument | null;

  try {
    image = await Image.findById(imageId);
  } catch (err) {
    const error = new Error("Something went wrong while deleting the image.");
    res.status(500);
    return next(error);
  }

  if (!image) {
    const error = new Error(
      "No image with the given image-id was found. Please provide the valid image-id of the image to delete."
    );
    res.status(404);
    return next(error);
  }

  try {
    await image.unlink();
  } catch (err) {
    console.trace(err);
    const error = new Error(
      "The image could not be deleted from the file system."
    );
    res.status(500);
    return next(error);
  }

  try {
    await image.delete();
  } catch (err) {
    console.trace(err);
    const error = new Error(
      "The image was deleted from the file system, but could not be deleted from the database."
    );
    res.status(500);
    return next(error);
  }

  res.status(200).json({
    message: "Image deleted successfully.",
  });
};

export const addScrollingImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const scrollingImageId = req.body["scrolling-image-id"];

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

export const deleteScrollingImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const scrollingImageId = req.body["scrolling-image-id"];

  const deletedScrollingImage: IScrollingImage | null =
    await ScrollingImage.findByIdAndDelete(scrollingImageId);

  // If no scrolling image with the given id could be found, then
  // return an error message.
  if (!deletedScrollingImage) {
    const error = new Error("No scrolling image with the given id was found.");
    res.status(404);
    return next(error);
  }

  res.status(200).json({
    message: "Image deleted successfully.",
  });
};

// Gets a list of the new scrolling image ids from the request body,
// and replaces the previous scrolling images. If any of the new
// scrolling images is not found, then the old scrolling images
// will remain.
export const replaceScrollingImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // The ids of the images that will replace the current scrolling images,
  // in the order of appearance.
  const newScrollingImageIds: string[] = req.body.newScrollingImageIds;
  let newScrollingImages: ({} | null)[];

  try {
    // Fetch the new scrolling images from DB.
    newScrollingImages = await Promise.all(
      newScrollingImageIds.map((id) => Image.findById(id))
    );
  } catch (err) {
    console.trace(err);
    const error = new Error(
      "The new scrolling images could not be fetched from the database."
    );
    res.status(500);
    return next(error);
  }

  // If any of the images were not found, return 404.
  if (newScrollingImages.some((image) => image === null)) {
    const error = new Error(
      "An image with the given image id could not be found."
    );
    res.status(404);
    return next(error);
  }

  // Create a function for each new scrolling image which produces the
  // new ScrollingImage object.
  const newScrollingImageFunctions: (() => Promise<void>)[] =
    newScrollingImages.map((image, index) => async () => {
      const newScrollingImage = new ScrollingImage({
        image: image,
        order: index,
      });
      await newScrollingImage.save();
    });

  try {
    // Delete previous scrolling images.
    await ScrollingImage.deleteMany();

    // Create new ScrollingImage objects.
    await Promise.all(newScrollingImageFunctions.map((func) => func()));
  } catch (err) {
    console.trace(err);
    const error = new Error(
      "Could not update database with new scrolling images."
    );
    res.status(500);
    return next(error);
  }

  res.status(200).json({ message: "Scrolling images succesfully replaced." });
};
