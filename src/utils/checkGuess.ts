// utils/checkGuess.ts
export type LetterStatus = "correct" | "present" | "absent";

export function checkGuess(guess: string, solution: string): LetterStatus[] {
  const result: LetterStatus[] = Array(5).fill("absent");

  const solutionArr = solution.split("");
  const guessArr = guess.split("");

  // First pass: correct letters
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === solutionArr[i]) {
      result[i] = "correct";
      solutionArr[i] = ""; // remove matched
    }
  }

  // Second pass: present letters
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const index = solutionArr.indexOf(guessArr[i]);
    if (index !== -1) {
      result[i] = "present";
      solutionArr[index] = ""; // prevent duplicate match
    }
  }

  return result;
}
