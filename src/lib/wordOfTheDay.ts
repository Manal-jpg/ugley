// lib/wordOfTheDay.ts
import fs from "fs";
import path from "path";

export function getWordOfTheDay(): string {
  const filePath = path.join(process.cwd(), "data", "words.txt");
  const words = fs
    .readFileSync(filePath, "utf-8")
    .split("\n")
    .map((w) => w.trim())
    .filter((w) => w.length === 5);

  const today = new Date();
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));

  return words[dayIndex % words.length].toUpperCase();
}
