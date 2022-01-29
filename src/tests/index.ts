export const generateRandomString = (length: number) =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, length);
