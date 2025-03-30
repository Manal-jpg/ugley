import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "words.txt");
  const words = fs
    .readFileSync(filePath, "utf-8")
    .split("\n")
    .map((w) => w.trim())
    .filter((w) => w.length === 5);

  const dayIndex = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24));
  const word = words[dayIndex % words.length].toUpperCase();

  return NextResponse.json({ word });
}
