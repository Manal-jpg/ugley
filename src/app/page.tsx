"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Button, Typography } from "@mui/material";

const MONGOLIAN_KEYS = [
  ["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Ү", "З", "Х", "Ъ"],
  ["Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э"],
  ["ENTER", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "⌫"],
];

type LetterStatus = "correct" | "present" | "absent";

export default function Wordle() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [wordOfTheDay, setWordOfTheDay] = useState<string | null>(null);
  const [letterStatus, setLetterStatus] = useState<
    Record<string, LetterStatus>
  >({});

  useEffect(() => {
    fetch("/api/word")
      .then((res) => res.json())
      .then((data) => setWordOfTheDay(data.word));
  }, []);

  const evaluateGuess = (guess: string, solution: string): LetterStatus[] => {
    console.log(solution);
    const result: LetterStatus[] = Array(5).fill("absent");
    const solutionArr = solution.split("");

    // First pass: exact match
    for (let i = 0; i < 5; i++) {
      if (guess[i] === solutionArr[i]) {
        result[i] = "correct";
        solutionArr[i] = ""; // prevent reuse
      }
    }

    // Second pass: present but wrong place
    for (let i = 0; i < 5; i++) {
      if (result[i] === "correct") continue;
      const idx = solutionArr.indexOf(guess[i]);
      if (idx !== -1) {
        result[i] = "present";
        solutionArr[idx] = ""; // prevent reuse
      }
    }

    return result;
  };

  const handleKeyPress = (key: string) => {
    if (!wordOfTheDay) return;

    if (key === "ENTER") {
      if (current.length === 5) {
        fetch("/api/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word: current }),
        })
          .then((res) => res.json())
          .then(({ valid }) => {
            if (!valid) {
              alert("🤔 Энэ үг тольд байхгүй байна.");
              return;
            }

            const statuses = evaluateGuess(current, wordOfTheDay);
            setGuesses((prev) => [...prev, current]);

            setLetterStatus((prev) => {
              const updated = { ...prev };
              current.split("").forEach((char, idx) => {
                const newStatus = statuses[idx];
                const existingStatus = updated[char];

                if (
                  newStatus === "correct" ||
                  (newStatus === "present" && existingStatus !== "correct") ||
                  (!existingStatus && newStatus === "absent")
                ) {
                  updated[char] = newStatus;
                }
              });
              return updated;
            });

            setCurrent("");
          });
      }
    } else if (key === "⌫") {
      setCurrent((prev) => prev.slice(0, -1));
    } else if (current.length < 5) {
      setCurrent((prev) => prev + key);
    }
  };

  const getCellColor = (
    char: string,
    row: number,
    col: number
  ): string | undefined => {
    const guess = guesses[row];
    if (!guess) return undefined;

    const result = evaluateGuess(guess, wordOfTheDay!);
    const status = result[col];

    if (status === "correct") return "#6aaa64";
    if (status === "present") return "#c9b458";
    if (status === "absent") return "#787c7e";
    return undefined;
  };

  const getKeyColor = (key: string): string | undefined => {
    const status = letterStatus[key];
    if (status === "correct") return "#6aaa64";
    if (status === "present") return "#c9b458";
    if (status === "absent") return "#787c7e";
    return undefined;
  };

  return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        ҮГЛЭЕ
      </Typography>

      {[...Array(6)].map((_, row) => {
        const guess = guesses[row] || (row === guesses.length ? current : "");
        const letters = guess.padEnd(5).split("");

        return (
          <Grid
            key={row}
            container
            spacing={1}
            justifyContent="center"
            sx={{ mb: 1 }}
          >
            {letters.map((char, col) => (
              <Box
                key={col}
                sx={{
                  width: 50,
                  height: 50,
                  border: "2px solid #ccc",
                  backgroundColor: getCellColor(char, row, col),
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 24,
                  fontWeight: "bold",
                  color: char ? "#fff" : "#000",
                }}
              >
                {char}
              </Box>
            ))}
          </Grid>
        );
      })}

      <Box sx={{ mt: 4 }}>
        {MONGOLIAN_KEYS.map((row, i) => (
          <Box
            key={i}
            sx={{ display: "flex", justifyContent: "center", mb: 1 }}
          >
            {row.map((key) => (
              <Button
                key={key}
                variant="contained"
                onClick={() => handleKeyPress(key)}
                disabled={letterStatus[key] === "absent"}
                sx={{
                  mx: 0.5,
                  minWidth: 40,
                  height: 50,
                  backgroundColor: getKeyColor(key),
                  color: "#fff",
                }}
              >
                {key}
              </Button>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
