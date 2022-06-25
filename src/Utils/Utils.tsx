export const shuffleArray = (arr: string[]) => {
  return arr.sort(() => Math.random() - 0.5);
};
