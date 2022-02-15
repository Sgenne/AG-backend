interface ImageFile {
  originalname: string;
  buffer: Buffer;
}

import { Bucket, Storage } from "@google-cloud/storage";
import { IImage } from "../interfaces/image.interface";
import { Result } from "../interfaces/result.interface";

export class StorageHandler {
  private bucket: Bucket;

  constructor(keyFilename: string, bucketName: string) {
    this.bucket = new Storage({ keyFilename: keyFilename }).bucket(bucketName);
  }

  /**
   * Adds image to persistant storage and returns the url to access the
   * image.
   *
   * @param image - The image to store.
   *
   * @returns A promise of an object containing the result of the operation.
   */
  storeImage = async (image: ImageFile): Promise<Result> => {
    const path = imagePath(image.originalname);
    return await this.store(image.buffer, path);
  };

  /**
   * Adds compressed image to persistant storage and returns the url
   * to access the image.
   *
   * @param image - The compressed image to store.
   *
   * @returns A promise of an object containing the result of the operation.
   */
  storeCompressedImage = async (image: ImageFile): Promise<Result> => {
    const path = compressedImagePath(image.originalname);
    return await this.store(image.buffer, path);
  };

  private store = (file: Buffer, path: string): Promise<Result> =>
    new Promise<Result>((resolve, reject) => {
      const storedObject = this.bucket.file(path);

      storedObject
        .createWriteStream()
        .on("error", (error) => {
          reject(error);
        })
        .on("finish", () => {
          resolve({
            success: true,
            payload: { url: storedObject.publicUrl() },
          });
        })
        .end(file);
    });

  deleteImage = (image: IImage): Promise<Result> =>
    this.delete(imagePath(image.filename));

  deleteCompressedImage = async (image: IImage): Promise<Result> =>
    this.delete(compressedImagePath(image.filename));

  private delete = async (path: string): Promise<Result> => {
    try {
      const response = await this.bucket.file(path).delete();

      console.log("response: ", response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed.";
      return { success: false, message: message };
    }
    return { success: true };
  };
}

const imagePath = (originalname: string) => `gallery/images/${originalname}`;
const compressedImagePath = (originalname: string) =>
  `gallery/compressed/comp_${originalname}`;
