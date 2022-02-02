import request from "supertest";
import app from "../../app";
import { IImage } from "../../interfaces/image.interface";
import { IImageDocument, Image } from "../../models/image";
import { storeImage } from "../../services/image.service";
import * as db from "../../tests/mockDB";

beforeAll(async () => await db.connect());

afterEach(async () => await db.clear());

afterAll(async () => await db.close());

const imageUrl = "imageUrl0";
const filename = "filename0";
const compressedImageUrl = "compressedImageUrl0";
const relativeImagePath = "relPath0";
const relativeCompressedImagePath = "relCompPath0";

const imageUrl1 = "imageUrl1";
const filename1 = "filename1";
const compressedImageUrl1 = "compressedImageUrl1";
const relativeImagePath1 = "relPath1";
const relativeCompressedImagePath1 = "relCompPath1";

const imageUrl2 = "imageUrl2";
const filename2 = "filename2";
const compressedImageUrl2 = "compressedImageUrl2";
const relativeImagePath2 = "relPath2";
const relativeCompressedImagePath2 = "relCompPath2";

const category = "category";

describe("GET /gallery/images", () => {
  beforeEach(async () => {
    const image0 = new Image({
      imageUrl: imageUrl,
      filename: filename,
      compressedImageUrl: compressedImageUrl,
      relativeImagePath: relativeImagePath,
      relativeCompressedImagePath: relativeCompressedImagePath,
      category: category,
    });

    const image1 = new Image({
      imageUrl: imageUrl1,
      filename: filename1,
      compressedImageUrl: compressedImageUrl1,
      relativeImagePath: relativeImagePath1,
      relativeCompressedImagePath: relativeCompressedImagePath1,
      category: category,
    });

    const image2 = new Image({
      imageUrl: imageUrl2,
      filename: filename2,
      compressedImageUrl: compressedImageUrl2,
      relativeImagePath: relativeImagePath2,
      relativeCompressedImagePath: relativeCompressedImagePath2,
      category: category,
    });

    await Promise.all([image0.save(), image1.save(), image2.save()]);
  });
  it("returns all images", async () => {
    const res = await request(app).get("/gallery/images").send();

    expect(res.statusCode).toBe(200);
  });
});
