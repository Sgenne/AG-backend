import { RESOURCE_ALREADY_EXISTS, RESOURCE_NOT_FOUND, UNAUTHORIZED } from "..";
import * as db from "../../tests/mockDB";
import { registerUser, signIn, verifyAccessToken } from "../user.service";
beforeAll(async () => await db.connect());

afterEach(async () => await db.clear());

afterAll(async () => await db.close());

describe("registerUser", () => {
  it("fails if email is already taken", async () => {
    const email = "test@test.com";

    const {
      success: success0,
      message: message0,
      user: user0,
      accessToken: accessToken0,
    } = await registerUser(
      "ksdjfh",
      email,
      "skdjfhskdjfhk",
      "super secret secret"
    );

    if (!user0) throw new Error();
    expect(success0).toBe(true);
    expect(message0).toBeUndefined();
    expect(user0.name && user0.email && user0.passwordHash).toBeTruthy();
    expect(accessToken0).toBeDefined();

    const { success, message, user, accessToken } = await registerUser(
      "ksdweoriuiasidu",
      email,
      "fkjhkjfdhkassd",
      "super secret secret"
    );

    expect(success).toBe(false);
    expect(message).toBe(RESOURCE_ALREADY_EXISTS);
    expect(user).toBeUndefined();
    expect(accessToken).toBeUndefined();
  });
});

describe("signIn", () => {
  it("fails if no user with the given email exists", async () => {
    const name = "name";
    const password = "password";
    const secret = "super secret secret";

    await registerUser(name, "email@email.com", password, secret);

    const { success, user, message, accessToken } = await signIn(
      "emai@email.com",
      password,
      password
    );

    expect(success).toBe(false);
    expect(user).toBeUndefined();
    expect(message).toBe(RESOURCE_NOT_FOUND);
    expect(accessToken).toBeUndefined();
  });

  it("fails if the given password is incorrect", async () => {
    const name = "name";
    const email = "email@email.com";
    const secret = "super secret secret";

    await registerUser(name, email, "password", secret);

    const { success, message, user, accessToken } = await signIn(
      email,
      "pasword",
      secret
    );

    expect(success).toBe(false);
    expect(message).toBe(UNAUTHORIZED);
    expect(user).toBeUndefined();
    expect(accessToken).toBeUndefined();
  });

  it("returns a valid access token if successfull", async () => {
    const email = "email@email.com";
    const password = "password";
    const secret = "super secret secret";

    await registerUser("name", email, password, secret);

    const { user, accessToken } = await signIn(email, password, secret);

    if (!(user && accessToken)) throw new Error();

    const {
      success,
      user: verifiedUser,
      message,
    } = await verifyAccessToken(accessToken, secret);

    if (!verifiedUser) throw new Error();

    expect(user.email).toBe(verifiedUser.email);
    expect(success).toBe(true);
    expect(message).toBeUndefined();
  });
});

describe("verifyAccessToken", () => {
  const name = "name";
  const password = "password";
  const email = "email";
  const secret = "super secret secret";

  it("does not verify an invalid access token", async () => {
    const { accessToken } = await registerUser(name, email, password, secret);
    if (!accessToken) throw new Error();

    const invalidToken = accessToken.slice(0, accessToken.length - 5) + "hello";

    const invalidResult = await verifyAccessToken(invalidToken, secret);

    expect(invalidResult.success).toBe(false);
    expect(invalidResult.message).toBe(UNAUTHORIZED);
    expect(invalidResult.user).toBeUndefined();
  });

  it("Returns the correct user object if the access token is valid", async () => {
    const { accessToken } = await registerUser(name, email, password, secret);
    if (!accessToken) throw new Error();

    const { user } = await verifyAccessToken(accessToken, secret);

    if (!user) throw new Error();

    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
  });
});
