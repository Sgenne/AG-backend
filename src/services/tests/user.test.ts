import { RESOURCE_ALREADY_EXISTS } from "..";
import * as db from "../../tests/mockDB";
import { registerUser } from "../user.service";
beforeAll(async () => await db.connect());

afterEach(async () => await db.clear());

afterAll(async () => await db.close());

describe("registerUser", () => {
  it("fails if email is already taken", async () => {
    const email = "test@test.com";

    await registerUser("ksdjfh", email, "skdjfhskdjfhk", "super secret secret");

    const { success, message, user } = await registerUser(
      "ksdweoriuiasidu",
      email,
      "fkjhkjfdhkassd",
      "super secret secret"
    );

    expect(success).toBe(false);
    expect(message).toBe(RESOURCE_ALREADY_EXISTS);
    expect(user).toBeUndefined();
  });
});
