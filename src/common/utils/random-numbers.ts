export const generateRandomNumbers = (
  min: number,
  max: number,
  times: number,
) => {
  const randoms = [];

  for (let i = 0; i < times; i++) {
    let random = -1;

    do {
      random = Math.floor(Math.random() * (max - min) + min);
    } while (randoms.includes(random));

    randoms.push(random);
  }

  return randoms;
};
