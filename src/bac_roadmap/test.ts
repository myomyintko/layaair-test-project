enum DICTONARY {
    BANKER = 0b1,                 // 1
    PLAYER = 0b10,                // 2
    TIE = 0b100,                  // 4
    BANKER_PAIR = 0b1000,          // 8
    PLAYER_PAIR = 0b10000,         // 16
    BIG = 0b100000,               // 32
    SMALL = 0b1000000,            // 64
    BANKER_NATURAL = 0b10000000,   // 128
    PLAYER_NATURAL = 0b100000000,  // 256
    SUPER_SIX = 0b1000000000,      // 512
    ANY_PAIR = 0b10000000000,      // 1024
    PERFECT_PAIR = 0b100000000000, // 2048
    BANKER_DRAGON_BONUS = 0b1000000000000,  // 4096
    PLAYER_DRAGON_BONUS = 0b10000000000000, // 8192
}

enum WINNER {
    BANKER_BIG = DICTONARY.BANKER | DICTONARY.BIG,
    BANKER_SMALL = DICTONARY.BANKER | DICTONARY.SMALL,
    PLAYER_BIG = DICTONARY.PLAYER | DICTONARY.BIG,
    PLAYER_SMALL = DICTONARY.PLAYER | DICTONARY.SMALL,
    TIE_BIG = DICTONARY.TIE | DICTONARY.BIG,
    TIE_SMALL = DICTONARY.TIE | DICTONARY.SMALL,
    BANKER_SUPER_SIX_BIG = DICTONARY.BANKER | DICTONARY.SUPER_SIX | DICTONARY.BIG
}

enum PAIR {
    NONE = 0,
    BANKER_PAIR = DICTONARY.BANKER_PAIR,
    PLAYER_PAIR = DICTONARY.PLAYER_PAIR,
    BOTH_PAIR = DICTONARY.BANKER_PAIR | DICTONARY.PLAYER_PAIR,
    BANKER_PERFECT_PAIR = DICTONARY.BANKER_PAIR | DICTONARY.PERFECT_PAIR,
    PLAYER_PERFECT_PAIR = DICTONARY.PLAYER_PAIR | DICTONARY.PERFECT_PAIR,
    BOTH_PERFECT_PAIR = DICTONARY.BANKER_PAIR | DICTONARY.PLAYER_PAIR | DICTONARY.PERFECT_PAIR,
}

enum ADDITIONAL {
    NONE = 0,
    BANKER_DRAGON_BONUS = DICTONARY.BANKER_DRAGON_BONUS,
    BANKER_NATURAL_BANKER_DRAGON_BONUS = DICTONARY.BANKER_NATURAL | DICTONARY.BANKER_DRAGON_BONUS,
    PLAYER_DRAGON_BONUS = DICTONARY.PLAYER_DRAGON_BONUS,
    PLAYER_NATURAL_PLAYER_DRAGON_BONUS = DICTONARY.PLAYER_NATURAL | DICTONARY.PLAYER_DRAGON_BONUS,
}

const isValidCombination = (winner: WINNER, pair: PAIR, additional: ADDITIONAL): boolean => {
    // BANKER and PLAYER cannot coexist
    if ((winner & DICTONARY.BANKER) && (winner & DICTONARY.PLAYER)) return false;

    // TIE cannot coexist with BANKER or PLAYER
    if ((winner & DICTONARY.TIE) && (winner & (DICTONARY.BANKER | DICTONARY.PLAYER))) return false;

    // BANKER_PAIR and PLAYER_PAIR can only occur if BANKER or PLAYER wins
    if ((pair & DICTONARY.BANKER_PAIR) && !(winner & DICTONARY.BANKER)) return false;
    if ((pair & DICTONARY.PLAYER_PAIR) && !(winner & DICTONARY.PLAYER)) return false;

    // BIG and SMALL are mutually exclusive
    if ((winner & DICTONARY.BIG) && (winner & DICTONARY.SMALL)) return false;

    // BANKER_DRAGON_BONUS and PLAYER_DRAGON_BONUS are only valid if BANKER or PLAYER wins
    if ((additional & DICTONARY.BANKER_DRAGON_BONUS) && !(winner & DICTONARY.BANKER)) return false;
    if ((additional & DICTONARY.PLAYER_DRAGON_BONUS) && !(winner & DICTONARY.PLAYER)) return false;

    return true;
};

const generateAllCombinations = () => {
    const combinations: any[] = [];

    const winnerValues = Object.values(WINNER).filter((v) => typeof v === "number") as WINNER[];
    const pairValues = Object.values(PAIR).filter((v) => typeof v === "number") as PAIR[];
    const additionalValues = Object.values(ADDITIONAL).filter((v) => typeof v === "number") as ADDITIONAL[];

    for (const winner of winnerValues) {
        for (const pair of pairValues) {
            for (const additional of additionalValues) {
              // console.log(winner,pair,additional)
                // combinations.push(winner | pair | additional)

                if (isValidCombination(winner, pair, additional)) {
                    combinations.push(winner | pair | additional);
                }
            }
        }
    }

    return combinations;
};


const allCombinations = generateAllCombinations();

console.log(allCombinations,allCombinations.length)