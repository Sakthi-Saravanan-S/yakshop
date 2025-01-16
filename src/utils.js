// utils.js

export const calculateMilkProduction = (ageInDays) => {
  const milkProductionPerDay = (50 - ageInDays * 0.03)
  const totalMilkProductionForYak = milkProductionPerDay * (ageInDays / 100)
  return parseFloat((totalMilkProductionForYak).toFixed(2)); // Milk production decreases slightly with age
};

// Calculate the number of times a Yak can be shaved based on its age in days
export const calculateWoolStock = (ageInDays) => {
  if (ageInDays < 100) {
    return 0; // Yak is too young to be shaved
  }

  // Calculate the total number of times a Yak can be shaved between ages 100 and 1000
  let totalShavings = 0;
  
  for (let age = 100; age <= ageInDays; age++) {
    const shaveInterval = 8 + age * 0.01; // Calculate the shaving interval for this age
    if (age === 100 || ageInDays === 1000) {
      // First shaving after 100 days, count from 100 onwards, round off the value
      totalShavings += 1 / shaveInterval; // Adding one shaving occurrence based on the interval
    }
    if (age > 100) {
      totalShavings += 1 / shaveInterval; // Increment for each age increment
    }
  }
  // Round the total shavings to the nearest integer for realistic wool stock
  return parseFloat(totalShavings.toFixed(2)); 
};

