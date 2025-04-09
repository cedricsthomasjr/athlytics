// utils/generateBBRefId.js
const suffixes = ["jr", "sr", "ii", "iii", "iv", "v"];

const cleanName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z\s]/g, "") // remove apostrophes, periods, etc.
    .split(" ")
    .filter((part) => !suffixes.includes(part)); // remove suffixes

export const generateBBRefId = (fullName) => {
  const parts = cleanName(fullName);
  if (parts.length < 2) return null;

  const first = parts[0];
  const last = parts[parts.length - 1];

  const lastPart = last.slice(0, 5).padEnd(5, "x");
  const firstPart = first.slice(0, 2).padEnd(2, "x");

  // Default to "01" – caller can try fallback like "02", "03", etc.
  return `${lastPart}${firstPart}01`;
};
