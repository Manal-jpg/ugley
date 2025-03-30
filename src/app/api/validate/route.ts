import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

let words: string[] = [];

function loadWords() {
  if (words.length === 0) {
    const filePath = path.join(process.cwd(), "data", "words.txt");
    words = fs
      .readFileSync(filePath, "utf-8")
      .split("\n")
      .map((w) => w.trim().toUpperCase())
      .filter((w) => w.length === 5);
  }
}

export async function POST(req: Request) {
  loadWords();

  const { word } = await req.json();
  const isValid = words.includes(word.toUpperCase());

  return NextResponse.json({ valid: isValid });
}
