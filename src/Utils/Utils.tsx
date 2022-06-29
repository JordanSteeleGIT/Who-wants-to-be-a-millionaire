export const shuffleArray = (arr: string[]) => {
  return arr.sort(() => Math.random() - 0.5);
};

export const questionNumber = (questionNumber: number) => {
  switch (questionNumber) {
    case 0:
      return "A:";

    case 1:
      return "B:";

    case 2:
      return "C:";

    case 3:
      return "D:";
  }
};
