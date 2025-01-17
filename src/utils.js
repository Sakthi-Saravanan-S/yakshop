const MIN_SHAVE_DAY = 100;
const LIFESPAN_IN_DAYS = 1000;

export const calculateOverallMilkProductionPerYak = (ageInDays) => {
  let overAllMilkProductionByYak = 0
  for (let minAge = 1; minAge <= ageInDays; minAge++) {
    const milkProductionPerDay = (50 - minAge * 0.03)
    overAllMilkProductionByYak += Math.round(milkProductionPerDay)
  }
  return overAllMilkProductionByYak
};
export const calculateMilkProductionPerDay = (ageInDays) => {
  const milkProductionPerDay = (50 - ageInDays * 0.03)
  return parseFloat((milkProductionPerDay).toFixed(2));
};

export const calculateWoolStock = (ageInDays) => {
  if (ageInDays < MIN_SHAVE_DAY) {
    return 0;
  }

  let totalShavings = 0;
  let currentAge = MIN_SHAVE_DAY;
  const maxAge = Math.min(ageInDays, LIFESPAN_IN_DAYS);

  while (currentAge <= maxAge) {
    const shaveInterval = 8 + currentAge * 0.01;
    totalShavings += 1;
    currentAge += shaveInterval;
  }

  return Number(totalShavings.toFixed(2));
};

export const calculateShaveFrequency = (ageInDays) => {
  if (ageInDays < MIN_SHAVE_DAY) {
    return 0;
  }

  let shaveInterval = 8 + ageInDays * 0.01;
  return shaveInterval;
};

