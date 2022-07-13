export const shuffleArray = (arr: string[] | any[]) => {
  return arr.sort(() => Math.random() - 0.5);
};

export const randombetween = (min: number, max: number) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
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

export const scoreboardData = [
  "£100",
  "£200",
  "£300",
  "£500",
  "£1,000",
  "£2,000",
  "£4,000",
  "£8,000",
  "£16,000",
  "£32,000",
  "£64,000",
  "£125,000",
  "£250,000",
  "£500,000",
  "£1 MILLION",
];
