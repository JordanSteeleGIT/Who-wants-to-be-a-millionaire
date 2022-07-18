export const shuffleArray = <T,>(arr: T[]): T[] => {
  return arr.sort(() => Math.random() - 0.5);
};

export const randomInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloatBetween = (min: number, max: number): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

export const questionNumber = (questionNumber: number): string => {
  switch (questionNumber) {
    case 0:
      return "A:";

    case 1:
      return "B:";

    case 2:
      return "C:";

    case 3:
      return "D:";
    default:
      return "";
  }
};

export const randomIntExcludingArray = (
  min: number,
  max: number,
  exclude: number[]
): number => {
  const nums = [];
  for (let i = min; i <= max; i++) {
    if (!exclude.includes(i)) nums.push(i);
  }

  const randomIndex = Math.floor(Math.random() * nums.length);
  return nums[randomIndex];
};

export const randomIntExcludingValue = (
  min: number,
  max: number,
  excluded: number
): number => {
  var n = Math.floor(Math.random() * (max - min) + min);
  if (n >= excluded) n++;
  return n;
};

export const generateRandomArray = (excluded: number): number[] => {
  var arr = [];
  while (arr.length < 2) {
    var r = Math.floor(Math.random() * 4);
    if (arr.indexOf(r) === -1 && r !== excluded) arr.push(r);
  }
  return arr;
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
