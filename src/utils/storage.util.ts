interface Result {
  success: boolean;
  message?: string;
  url?: string;
}

interface ImageFile {
  originalname: string;
  buffer: Buffer;
}

import { Bucket, Storage } from "@google-cloud/storage";

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
    const imagePath = `/images/${image.originalname}`;
    return await this.store(image.buffer, imagePath);
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
    const imagePath = `/compressed/comp_${image.originalname}`;
    return await this.store(image.buffer, imagePath);
  };

  private store = (file: Buffer, path: string) =>
    new Promise<Result>((resolve, reject) => {
      const storedObject = this.bucket.file(path);
      const fileUrl = `gs://${this.bucket.name}${path}`;

      storedObject
        .createWriteStream()
        .on("error", (error) => {
          reject(error);
        })
        .on("finish", () => {
          resolve({ success: true, url: fileUrl });
        })
        .end(file);
    });
}
