import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  UNAUTHORIZED,
  DATABASE_ERROR,
  INVALID_ARGUMENT,
  RESOURCE_ALREADY_EXISTS,
  RESOURCE_NOT_FOUND,
} from ".";
import { IUser } from "../interfaces/user.interface";
import { User, UserDocument } from "../models/user";

/**
 * Represents the result of a service request.
 */
interface ServiceResult {
  /**
   * Indicates if the requested service was performed successfully.
   */
  success: boolean;

  /**
   * Details any eventual reason for an unsuccessfull service.
   */
  message?: string;

  /**
   * The user that the successfull operation was performed upon.
   */
  user?: IUser;

  /**
   * The access token of the successfully created user.
   */
  accessToken?: string;
}

/**
 * Registers a user.
 *
 * @param name The name of the registered user.
 *
 * @param email The email of the registered user. Must be unique.
 *
 * @param password The password of the registered user.
 *
 * @param secret The secret which will be used when generating the access token.
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  secret: string
): Promise<ServiceResult> => {
  const existingUser = await User.findOne({
    email: email,
  });

  if (existingUser) {
    return { success: false, message: RESOURCE_ALREADY_EXISTS };
  }

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name: name,
    email: email,
    passwordHash: passwordHash,
  });

  try {
    await user.save();
  } catch (e) {
    return { success: false, message: DATABASE_ERROR };
  }

  const accessToken = generateToken(user, secret);

  return { success: true, user: user, accessToken: accessToken };
};

/**
 * Signs in a registered user and returns an access token.
 *
 * @param email The email of the user to sign in.
 * @param password The password of the user to sign in.
 * @param secret The secret to be used when creating the access token.
 */
export const signIn = async (
  email: string,
  password: string,
  secret: string
): Promise<ServiceResult> => {
  let user: UserDocument | null;

  try {
    user = await User.findOne({
      email: email.toLowerCase(),
    });
  } catch (error) {
    return { success: false, message: DATABASE_ERROR };
  }

  if (!user) {
    return { success: false, message: RESOURCE_NOT_FOUND };
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordIsValid) {
    return { success: false, message: UNAUTHORIZED };
  }

  // access-token used for jwt-authentication
  const token = generateToken(user, secret);

  return { success: true, user: user, accessToken: token };
};

const generateToken = (user: IUser, secret: string) => {
  const token = jwt.sign({ email: user.email }, secret, {
    expiresIn: "1h",
  });
  return token;
};
