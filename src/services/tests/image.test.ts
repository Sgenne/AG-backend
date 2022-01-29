import { Image } from "../../models/image";
import { generateRandomString } from "../../tests";
import * as db from "../../tests/mockDB";
import { getImages, getImagesByCategory } from "../image.service";

beforeAll(async () => await db.connect());

afterEach(async () => await db.clear());

afterAll(async () => await db.close());

const generateImages = async () => {
  const numberOfImages = Math.floor(Math.random() * 10);
  const randomString = generateRandomString(10);

  for (let i = 0; i < numberOfImages; i++) {
    const randomIndexedString = randomString + i;
    const filename = randomIndexedString;
    const imageUrl = randomIndexedString;
    const compressedImageUrl = randomIndexedString;
    const relativeImagePath = randomIndexedString;
    const relativeCompressedImagePath = randomIndexedString;
    const category = randomIndexedString;

    const image = new Image({
      filename,
      imageUrl,
      compressedImageUrl,
      relativeImagePath,
      relativeCompressedImagePath,
      category,
    });
    await image.save();
  }
};

describe("getImages", () => {
  it("returns an array with all images in the database.", async () => {
    await generateImages();

    const result = await getImages();

    expect(result.success).toBeTruthy();
    if (!result.images) throw new Error();

    const images = await Image.find();

    expect(result.images.length === images.length).toBe(true);
  });

  it("returns an empty list if there are no images to return.", async () => {
    const result = await getImages();

    expect(result.success).toBeTruthy();
    if (!result.images) throw new Error();

    expect(result.images.length).toBe(0);
  });
});

describe("getImagesByCategory", () => {
  it("returns { success: true, images: [] } if the given category doesn't exist.", async () => {
    const result = await getImagesByCategory("abc");

    expect(result.success).toBe(true);
    expect(result.images).toHaveLength(0);
  });
});
