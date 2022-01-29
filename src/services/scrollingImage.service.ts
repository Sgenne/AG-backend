import { DATABASE_ERROR } from ".";
import { IImage } from "../interfaces/image.interface";
import { ScrollingImage } from "../models/scrollingImage";
import * as imageServices from "./image.service";

/**
 * Represents the result of a requested service.
 *
 */
interface serviceResult {
  /**
   * Indicates if the service was performed successfully.
   */
  success: boolean;

  /**
   * Contains a description of any eventuall error.
   */
  message?: string;

  /**
   * Contains the scrolling images after a successfull operation.
   */
  scrollingImages?: IImage[];
}

export const replaceScrollingImages = async (
  newScrollingImageIds: string[]
): Promise<serviceResult> => {
  const fetchResults = await Promise.all(
    newScrollingImageIds.map((id) => imageServices.getImageById(id))
  );

  const failedFetch = fetchResults.find((res) => !res.success);

  if (failedFetch) {
    return failedFetch;
  }

  const newScrollingImages: IImage[] = [];

  fetchResults.forEach((res) => {
    if (res.image) newScrollingImages.push(res.image);
  });

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
    return { success: false, message: DATABASE_ERROR };
  }

  return { success: true, scrollingImages: newScrollingImages };
};
