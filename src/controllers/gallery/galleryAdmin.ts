import path from "path";
import { Request, Response } from "express";
import sharp from "sharp";
import fs from "fs";

import { IImage, IImageDocument, Image } from "../../models/image";
import {
  ImageCategory,
  IImageCategoryDocument,
  IImageCategory,
} from "../../models/imageCategory";
import { IScrollingImage, ScrollingImage } from "../../models/scrollingImage";

const _ROOT_FOLDER_PATH = path.join(__dirname, "../../../");
const _GALLERY_IMAGE_FOLDER_PATH = path.join("images", "gallery");
const _COMPRESSED_IMAGE_FOLDER_PATH = path.join("images", "compressed");

export const createCategory = async (req: Request, res: Response) => {
  const categoryTitle = req.body.categoryTitle;

  const category = new ImageCategory({
    title: categoryTitle,
  });

  try {
    await category.save();
  } catch (e) {
    return res.status(500).json({ message: "Could not create category" });
  }
  res.status(201).json({
    message: "Category created successfully.",
    category: category,
  });
};

export const deleteCategory = async (req: Request, res: Response) => {
  // The id of the category to be deleted.
  const categoryId: string = req.body.categoryId;
  let category: IImageCategory | null;

  try {
    category = await ImageCategory.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "No category by the given id was found.",
      });
    }

    await Promise.all([Image.deleteMany({ category: category.title.toLowerCase() })])
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch the category from the database.",
    });
  }



  res.status(200).json({
    message: "Category deleted successfully.",
  });
};

export const setImageCategoryPreviewImage = async (
  req: Request,
  res: Response
) => {
  // Id of the new preview image.
  const previewImageId = req.body.previewImageId;
  let previewImage: IImage | null;

  // Id of the image category that should received the new preview image.
  const categoryId = req.body.categoryId;
  let category: IImageCategoryDocument | null;

  // Fetch preview image and image category from DB using the given ids.
  try {
    [previewImage, category] = await Promise.all([
      Image.findById(previewImageId),
      ImageCategory.findById(categoryId),
    ]);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Could not get the required data from the database." });
  }

  if (!category) {
    return res
      .status(404)
      .json({ message: "No image category with the given id could be found." });
  }

  if (!previewImage) {
    return res
      .status(404)
      .json({ message: "No image with the given id could be found." });
  }

  category.previewImage = previewImage;

  try {
    await category.save();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "The category could not be updated" });
  }

  res.status(200).json({
    message: "Category preview image updated successfully.",
    category: category,
  });
};

// verifies an uploaded image, adds compressed version, and stores to file system and database
export const handleUploadedImage = async (req: Request, res: Response) => {
  const category = req.body.category;

  if (!req.file) {
    return res.status(500).json({
      message: "Something went wrong. The image could not be uploaded.",
    });
  }

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

  // Check if an image with the given filename already exists.
  // If yes, then return 403
  try {
    const existingImage = await Image.findOne({ filename: originalName });
    if (existingImage) {
      return res.status(403).json({
        message: "An image with the given filename already exists."
      })
    }
  } catch (error) {
    return res.status(500).json({ message: "Could not reach database." })
  }

  try {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpg")
      .toFile(compressedImagePath);

    fs.writeFileSync(imagePath, req.file.buffer);
  } catch (err) {
    return res.status(500).json({ message: "Could not upload image." });
  }

  const relativeImagePath = `${_GALLERY_IMAGE_FOLDER_PATH}/${originalName}`;
  const relativeCompressedImagePath = `${_COMPRESSED_IMAGE_FOLDER_PATH}/${compressedImageName}`;

  const image = new Image({
    filename: originalName,
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
    return res.status(500).json({ message: "Could not update database." });
  }

  res.status(200).json({
    message: "Image uploaded successfully.",
    image: image,
  });
};

export const deleteImage = async (req: Request, res: Response) => {
  const imageId: string = req.body.imageId;
  let image: IImageDocument | null;

  try {
    image = await Image.findById(imageId);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong while deleting the image." });
  }

  if (!image) {
    return res
      .status(404)
      .json({ message: "No image with the given image-id was found." });
  }

  try {
    await image.unlink();
  } catch (err) {
    return res.status(500).json({
      message: "The image could not be deleted from the file system.",
    });
  }

  try {
    await image.delete();
  } catch (err) {
    return res.status(500).json({
      message:
        "The image was deleted from the file system, but could not be deleted from the database.",
    });
  }

  res.status(200).json({
    message: "Image deleted successfully.",
  });
};

export const addScrollingImage = async (req: Request, res: Response) => {
  const scrollingImageId = req.body["scrolling-image-id"];

  const newScrollingImage = new ScrollingImage({
    image: scrollingImageId,
  });

  try {
    await newScrollingImage.save();
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong while adding the new scrolling image.",
    });
  }

  res.status(200).json({
    message: "Scrolling image added successfully.",
  });
};

export const deleteScrollingImage = async (req: Request, res: Response) => {
  const scrollingImageId = req.body["scrolling-image-id"];

  const deletedScrollingImage: IScrollingImage | null =
    await ScrollingImage.findByIdAndDelete(scrollingImageId);

  // If no scrolling image with the given id could be found, then
  // return an error message.
  if (!deletedScrollingImage) {
    return res
      .status(404)
      .json({ message: "No scrolling image with the given id was found." });
  }

  res.status(200).json({
    message: "Image deleted successfully.",
  });
};

// Gets a list of the new scrolling image ids from the request body,
// and replaces the previous scrolling images. If any of the new
// scrolling images is not found, then the old scrolling images
// will remain.
export const replaceScrollingImages = async (req: Request, res: Response) => {
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
    return res.status(500).json({
      message:
        "The new scrolling images could not be fetched from the database.",
    });
  }

  // If any of the images were not found, return 404.
  if (newScrollingImages.some((image) => image === null)) {
    return res.status(404).json({
      message: "An image with the given image id could not be found.",
    });
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
    return res.status(500).json({
      message: "Could not update database with new scrolling images.",
    });
  }

  res.status(200).json({ message: "Scrolling images succesfully replaced." });
};
