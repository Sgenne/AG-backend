import { Schema, model, Document } from "mongoose";
import { IUser } from "../interfaces/user.interface";

export interface UserDocument extends IUser, Document {}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    authenticationToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = model<UserDocument>("User", userSchema);
