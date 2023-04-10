const rand0ToMax = (max) => {
  return Math.floor(Math.random() * max);
}

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

export const uniqueValueArrayRandOrder = (max) => {
  const res = [];
  for (let i = 0; i < max; ) {
    const random = rand0ToMax(max);
    if (countOccurrences(res, random) < 1) {
      res.push(random);
      i++;
    }
  }
  return res;
}