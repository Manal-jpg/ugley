"use client";

import { useState } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const WORDS = ["НОМОН", "ЦАГАА", "ГЭРЭЛ", "УСАНД", "САЙХН"];
const TARGET_WORD =
  WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();

function getFeedback(guess: string, target: string) {
  const result = Array(WORD_LENGTH).fill("gray");
  const letterCount: Record<string, number> = {};

  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = target[i];
    letterCount[letter] = (letterCount[letter] || 0) + 1;
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === target[i]) {
      result[i] = "green";
      letterCount[guess[i]]--;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "gray" && letterCount[guess[i]] > 0) {
      result[i] = "yellow";
      letterCount[guess[i]]--;
    }
  }

  return result;
}

export default function Home() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [won, setWon] = useState(false);

  const handleSubmit = () => {
    if (input.length !== WORD_LENGTH || guesses.length >= MAX_GUESSES || won)
      return;
    const newGuesses = [...guesses, input.toUpperCase()];
    setGuesses(newGuesses);
    setInput("");
    if (input.toUpperCase() === TARGET_WORD) setWon(true);
  };

  const getBoxColor = (status: string) => {
    switch (status) {
      case "green":
        return "#6aaa64";
      case "yellow":
        return "#c9b458";
      default:
        return "#787c7e";
    }
  };

  return (
    <>
      <Head>
        <title>ҮГЛЭЕ</title>
      </Head>
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🇲🇳 ҮГЛЭЕ
        </Typography>

        <Grid
          container
          spacing={1}
          direction="column"
          alignItems="center"
          mb={2}
        >
          {guesses.map((guess, rowIndex) => {
            const feedback = getFeedback(guess, TARGET_WORD);
            return (
              <Grid item key={rowIndex}>
                <Grid container spacing={1} justifyContent="center">
                  {guess.split("").map((char, index) => (
                    <Grid item key={index}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          backgroundColor: getBoxColor(feedback[index]),
                          color: "white",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontWeight: "bold",
                          fontSize: "24px",
                          borderRadius: 1,
                          textTransform: "uppercase",
                        }}
                      >
                        {char}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            );
          })}
        </Grid>

        {!won && guesses.length < MAX_GUESSES ? (
          <Box display="flex" justifyContent="center" gap={2}>
            <TextField
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              inputProps={{
                maxLength: WORD_LENGTH,
                style: { textAlign: "center", fontSize: 20 },
              }}
              variant="outlined"
              label="Таах үг"
            />
            <Button variant="contained" onClick={handleSubmit}>
              Оруулах
            </Button>
          </Box>
        ) : won ? (
          <Typography mt={2} color="success.main" fontWeight="bold">
            Баяр хүргэе! 🎉
          </Typography>
        ) : (
          <Typography mt={2} color="error" fontWeight="bold">
            Үг: {TARGET_WORD}
          </Typography>
        )}
      </Container>
    </>
  );
}
