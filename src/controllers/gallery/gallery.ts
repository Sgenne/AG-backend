import { Request, Response } from "express";

import { Image } from "../../models/image";
import { ImageCategory } from "../../models/imageCategory";
import { ScrollingImage } from "../../models/scrollingImage";

export const getImages = async (req: Request, res: Response, next: Function) => {
  try {
    const images = await Image.find();
    res.json(
      JSON.stringify({
        message: "Successfully fetched images.",
        images: images,
      })
    );
  } catch (err) {
    const error = new Error("Something went wrong while fetching images.");
    res.status(500);
    return next(error);
  }
};

export const getImagesByCategory = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const category = req.params.category;
  let categoryImages;
  try {
    categoryImages = await Image.find({
      category: category.toLowerCase(),
    });
  } catch (err) {
    const error = new Error("Something went wrong while fetching images.");
    res.status(500);
    return next(error);
  }
  res.status(200).json(
    JSON.stringify({
      message: "Successfully fetched images.",
      images: categoryImages,
    })
  );
};

export const getCategories = async (req: Request, res: Response, next: Function) => {
  let categories;
  try {
    categories = await ImageCategory.find().populate("previewImage");
  } catch (err) {
    const error = new Error("Something went wrong while fetching categories.");
    res.status(500);
    return next(error);
  }
  res.status(200).json(
    JSON.stringify({
      message: "Categories fetched successfully.",
      categories: categories,
    })
  );
};

export const getScrollingImages = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const scrollingImages = await ScrollingImage.find().populate("image");
    res.status(200).json(
      JSON.stringify({
        message: "Successfully fetched scrolling images.",
        scrollingImages: scrollingImages,
      })
    );
  } catch (error) {
    error = new Error("Could not fetch scrolling images.");
    res.status(500);
    return next(error);
  }
};
