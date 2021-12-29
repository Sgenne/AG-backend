import { Schema, Document, model, Types } from "mongoose";
import { IImage } from "./image";

export interface IImageCategory {
  title: string;
  previewImage: Types.ObjectId | IImage;
}

const ImageCategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  previewImage: {
    type: Types.ObjectId,
    ref: "Image",
    required: true,
  },
});

export const ImageCategory = model<IImageCategory>("ImageCategory", ImageCategorySchema);
