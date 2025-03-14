enum DICTONARY {
    BANKER = "banker",                 // 1
    PLAYER = "player",                // 2
    TIE = "tie",                  // 4
    BANKER_PAIR = "banker_pair",          // 8
    PLAYER_PAIR = "player_pair",         // 16
    BIG = "big",               // 32
    SMALL = "small",            // 64
    BANKER_NATURAL = "banker_natural",   // 128
    PLAYER_NATURAL = "player_natural",  // 256
    SUPER_SIX = "super_six",      // 512
    ANY_PAIR = "any_pair",      // 1024
    PERFECT_PAIR = "perfect_pair", // 2048
    BANKER_DRAGON_BONUS = "banker_dragon_bonus",  // 4096
    PLAYER_DRAGON_BONUS = "player_dragon_bonus", // 8192
  }
  
  enum WINNER {
    BANKER_BIG = DICTONARY.BANKER + "+" + DICTONARY.BIG,
    BANKER_SMALL = DICTONARY.BANKER + "+" + DICTONARY.SMALL,
    PLAYER_BIG = DICTONARY.PLAYER + "+" + DICTONARY.BIG,
    PLAYER_SMALL = DICTONARY.PLAYER + "+" + DICTONARY.SMALL,
    TIE_BIG = DICTONARY.TIE + "+" + DICTONARY.BIG,
    TIE_SMALL = DICTONARY.TIE + "+" + DICTONARY.SMALL,
    BANKER_SUPER_SIX_BIG = DICTONARY.BANKER + "+" + DICTONARY.SUPER_SIX + "+" + DICTONARY.BIG
  }
  
  enum PAIR {
    NONE = "",
    BANKER_PAIR = DICTONARY.BANKER_PAIR,
    PLAYER_PAIR = DICTONARY.PLAYER_PAIR,
    BOTH_PAIR = DICTONARY.BANKER_PAIR + "+" + DICTONARY.PLAYER_PAIR,
    BANKER_PERFECT_PAIR = DICTONARY.BANKER_PAIR + "+" + DICTONARY.PERFECT_PAIR,
    PLAYER_PERFECT_PAIR = DICTONARY.PLAYER_PAIR + "+" + DICTONARY.PERFECT_PAIR,
    BOTH_PERFECT_PAIR = DICTONARY.BANKER_PAIR + "+" + DICTONARY.PLAYER_PAIR + "+" + DICTONARY.PERFECT_PAIR,
  }
  
  enum ADDITIONAL {
    NONE = "",
    BANKER_DRAGON_BONUS = DICTONARY.BANKER_DRAGON_BONUS,
    BANKER_NATURAL_BANKER_DRAGON_BONUS = DICTONARY.BANKER_NATURAL + "+" + DICTONARY.BANKER_DRAGON_BONUS,
    PLAYER_DRAGON_BONUS = DICTONARY.PLAYER_DRAGON_BONUS,
    PLAYER_NATURAL_PLAYER_DRAGON_BONUS = DICTONARY.PLAYER_NATURAL + "+" + DICTONARY.PLAYER_DRAGON_BONUS,
  }
  
  const isValidCombination = (combination: string): boolean => {
    // Extract components from the combination string
    const [winner, pair, additional] = combination.split(",");
  
    // Validate WINNER
    if (winner) {
      // Check for mutually exclusive outcomes
      if (winner.includes("banker") && winner.includes("player")) {
        return false; // BANKER and PLAYER cannot both win
      }
      if (winner.includes("tie") && (winner.includes("banker") || winner.includes("player"))) {
        return false; // TIE cannot coexist with BANKER or PLAYER
      }
  
      // Check for SUPER_SIX (only valid with BANKER)
      if (winner.includes("super_six") && !winner.includes("banker")) {
        return false;
      }
    }
  
    // Check for hand size (BIG or SMALL)
    const isBig = combination.includes("big");
    const isSmall = combination.includes("small");
  
    // Validate hand size rules
    if (isBig && isSmall) {
      return false; // Cannot be both BIG and SMALL
    }
  
    // Validate PAIR
    if (pair) {
      // Check for PERFECT_PAIR dependencies
      if (pair.includes("perfect_pair")) {
        if (pair.includes("banker_perfect_pair") && !pair.includes("banker_pair")) {
          return false; // BANKER_PERFECT_PAIR requires BANKER_PAIR
        }
        if (pair.includes("player_perfect_pair") && !pair.includes("player_pair")) {
          return false; // PLAYER_PERFECT_PAIR requires PLAYER_PAIR
        }
        if ((pair.includes("banker_perfect_pair") && pair.includes("player_perfect_pair")) && (!pair.includes("banker_pair") || !pair.includes("player_pair"))) {
          return false; // BOTH_PERFECT_PAIR requires both BANKER_PAIR and PLAYER_PAIR
        }
      }
    }
  
    // Validate ADDITIONAL
    if (additional) {
      // Check for NATURAL and BIG conflict
      if (isBig && (additional.includes("banker_natural") || additional.includes("player_natural"))) {
        return false; // NATURAL cannot be part of BIG series
      }
  
      // Validate hand size rules
      if (isSmall) {
        // SMALL series rules
        if (additional.includes("super_six")) {
          return false; // SMALL cannot have SUPER_6
        }
  
        // Check for NATURAL dependencies
        if (additional.includes("banker_natural") && !winner?.includes("banker")) {
          return false; // BANKER_NATURAL requires BANKER to win
        }
        if (additional.includes("player_natural") && !winner?.includes("player")) {
          return false; // PLAYER_NATURAL requires PLAYER to win
        }
      }
  
      if (isBig) {
        // BIG series rules
        if (additional.includes("natural") && !winner?.includes("banker") && !winner?.includes("player")) {
          return false; // NATURAL requires BANKER or PLAYER to win
        }
      }
  
      // Check for DRAGON_BONUS dependencies
      if (additional.includes("banker_dragon_bonus") && !winner?.includes("banker")) {
        return false; // BANKER_DRAGON_BONUS requires BANKER to win
      }
      if (additional.includes("player_dragon_bonus") && !winner?.includes("player")) {
        return false; // PLAYER_DRAGON_BONUS requires PLAYER to win
      }
    }
  
    return true; // Combination is valid
  };
  
  // Test the function with the given combination
  // const resultStr = "bankerbig,,banker_naturalbanker_dragon_bonus";
  // console.log(isValidCombination(resultStr)); // Should return false
  
  const generateAllCombinations = () => {
    const combinations: any[] = [];
  
    const winnerValues = Object.values(WINNER).filter((v) => typeof v === "string") as WINNER[];
    const pairValues = Object.values(PAIR).filter((v) => typeof v === "string") as PAIR[];
    const additionalValues = Object.values(ADDITIONAL).filter((v) => typeof v === "string") as ADDITIONAL[];
  
    for (const winner of winnerValues) {
      for (const pair of pairValues) {
        for (const additional of additionalValues) {
          // console.log(winner,pair,additional)
          // combinations.push(`${winner},${pair},${additional}`)
          if (isValidCombination(`${winner},${pair},${additional}`)) {
            let result: string = winner
            if (pair) result += `+${pair}`
            if (additional) result += `+${additional}`
  
            combinations.push(result)
          }
        }
      }
    }
  
    return combinations;
  };
  
  
  const allCombinations = generateAllCombinations();
  
  console.log(allCombinations, allCombinations.length)
  
  