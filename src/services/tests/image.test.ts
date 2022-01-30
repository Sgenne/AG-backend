import { Types } from "mongoose";

import { RESOURCE_NOT_FOUND } from "..";
import { IImage } from "../../interfaces/image.interface";
import { IImageDocument, Image } from "../../models/image";
import { generateRandomString } from "../../tests";
import * as db from "../../tests/mockDB";
import { getImageById, getImages, getImagesByCategory } from "../image.service";

beforeAll(async () => await db.connect());

afterEach(async () => await db.clear());

afterAll(async () => await db.close());

const generateImages = async () => {
  const numberOfImages = Math.floor(Math.random() * 10);
  const randomString = generateRandomString(10);
  const images: IImage[] = [];

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
    images.push(image);
  }
  return images;
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

  it("is case insensitive", async () => {
    const images = await generateImages();

    await Promise.all(
      images.map(async (image) => {
        const upperCaseCat = image.category.toUpperCase();

        const { images: foundImages } = await getImagesByCategory(upperCaseCat);

        if (!foundImages || foundImages.length === 0) throw new Error();
      })
    );
  });

  it("returns all images within the given category", async () => {
    const image0 = new Image({
      filename: "abc",
      imageUrl: "dfooewfnk",
      compressedImageUrl: "piuytrfdghjk",
      relativeImagePath: "/ksdfoiudkf/..sdkfuysdfi",
      relativeCompressedImagePath: "skdjhskdjfhksdjkqwoif",
      category: "cat0",
    });
    const image1 = new Image({
      filename: "abc1",
      imageUrl: "dfooewf1nk",
      compressedImageUrl: "p1iuytrfdghjk",
      relativeImagePath: "/ksd1foiudkf/..sdkfuysdfi",
      relativeCompressedImagePath: "skdjhskdjfhksddjf",
      category: "cat0",
    });
    const image2 = new Image({
      filename: "abc2",
      imageUrl: "dfooew2fnk",
      compressedImageUrl: "p2iuytrfdghjk",
      relativeImagePath: "/ksd2foiudkf/..sdkfuysdfi",
      relativeCompressedImagePath: "skdjhskdjfhksdjasdf",
      category: "cat0",
    });
    const image3 = new Image({
      filename: "ab3c",
      imageUrl: "dfo3oewfnk",
      compressedImageUrl: "p3iuytrfdghjk",
      relativeImagePath: "/ksdfoiudkf/..4sdkfuysdfi",
      relativeCompressedImagePath: "skdjhskdjfhksdjf",
      category: "cat1",
    });

    await Promise.all([
      image0.save(),
      image1.save(),
      image2.save(),
      image3.save(),
    ]);

    const result = await getImagesByCategory("cat0");

    if (!result.images) throw new Error();

    expect(result.images).toHaveLength(3);
  });
});

describe("getImageById", () => {
  it("returns the correct image", async () => {
    const image = new Image({
      filename: "abc",
      imageUrl: "abc",
      compressedImageUrl: "abc",
      relativeImagePath: "abc",
      relativeCompressedImagePath: "abc",
      category: "abc",
    });

    await image.save();

    const result = await getImageById(image._id);

    const resImage: IImageDocument = result.image as IImageDocument;

    expect(resImage._id.toString()).toBe(image._id.toString());
  });

  it("returns resource not found if no image matches the given id", async () => {
    const id = new Types.ObjectId().toString();

    const result = await getImageById(id);

    expect(result.success).toBe(false);

    expect(result.message).toBe(RESOURCE_NOT_FOUND);
  });
});
