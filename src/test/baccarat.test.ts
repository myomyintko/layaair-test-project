import { describe, test, expect } from '@jest/globals';
import { BACCombinations, BACResult, generateEnumsFromInput, isValidCombination } from '../baccarat';

// Test cases for generateEnumsFromInput
describe('generateEnumsFromInput', () => {
    test('Banker win with banker pair', () => {
        const input = {
            winner: "banker",
            any_pair: "banker",
            perfect_pair: false,
            dragon_bonus: "none",
            super_6: false,
            natural: false,
            hand_size: "big"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.BANKER_BANKER_PAIR_ANY_PAIR);
        expect(result.combination).toBe(BACCombinations.ONLY_BIG);

        // const isValid = isValidCombination(BACResult.BANKER_BANKER_PAIR_ANY_PAIR, BACCombinations.ONLY_BIG);
        // expect(isValid).toBe(true);
    });

    test('Player win with dragon bonus', () => {
        const input = {
            winner: "player",
            any_pair: "none",
            perfect_pair: false,
            dragon_bonus: "player",
            super_6: false,
            natural: false,
            hand_size: "big"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.PLAYER);
        expect(result.combination).toBe(BACCombinations.BIG_PLAYER_DRAGON_BONUS);

        // const isValid = isValidCombination(BACResult.PLAYER, BACCombinations.BIG_PLAYER_DRAGON_BONUS);
        // expect(isValid).toBe(true);
    });

    test('Tie with both pairs', () => {
        const input = {
            winner: "tie",
            any_pair: "both",
            perfect_pair: true,
            dragon_bonus: "none",
            super_6: false,
            natural: false,
            hand_size: "big"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.TIE_BOTH_PAIR_ANY_PAIR); 
        expect(result.combination).toBe(BACCombinations.BIG_TIE_PERFECT_PAIR);

        // const isValid = isValidCombination(BACResult.TIE_BOTH_PAIR_ANY_PAIR, BACCombinations.BIG_TIE_PERFECT_PAIR);
        // expect(isValid).toBe(true);
    });

    test('Banker with super 6', () => {
        const input = {
            winner: "banker",
            any_pair: "none",
            perfect_pair: false,
            dragon_bonus: "none",
            super_6: true,
            natural: false,
            hand_size: "big"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.BANKER);
        expect(result.combination).toBe(BACCombinations.BIG_SUPER_6);

        // const isValid = isValidCombination(BACResult.BANKER, BACCombinations.BIG_SUPER_6);
        // expect(isValid).toBe(true);
    });

    test('Small hand with natural', () => {
        const input = {
            winner: "banker",
            any_pair: "none",
            perfect_pair: false,
            dragon_bonus: "none",
            super_6: false,
            natural: true,
            hand_size: "small"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.BANKER);
        expect(result.combination).toBe(BACCombinations.SMALL_BANKER_NATURAL);

        // const isValid = isValidCombination(BACResult.BANKER, BACCombinations.SMALL_BANKER_NATURAL);
        // expect(isValid).toBe(true);
    });

    test('Invalid perfect pair combination', () => {
        const input = {
            winner: "player",
            any_pair: "none",
            perfect_pair: true, // Invalid: perfect pair with no pair
            dragon_bonus: "none",
            super_6: false,
            natural: false,
            hand_size: "big"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.PLAYER);
        expect(result.combination).toBe(false);
    });

    test('Banker with banker pair, perfect pair, and super 6', () => {
        const input = {
            winner: "banker",
            any_pair: "banker",
            perfect_pair: true,
            dragon_bonus: "none",
            super_6: true,
            natural: false,
            hand_size: "big"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.BANKER_BANKER_PAIR_ANY_PAIR);
        expect(result.combination).toBe(BACCombinations.BIG_SUPER_6_PERFECT_PAIR);
    
        // expect(isValidCombination(BACResult.BANKER_BANKER_PAIR_ANY_PAIR, BACCombinations.BIG_SUPER_6_PERFECT_PAIR)).toBe(true);
    });

    test('Player with both pair, perfect pair, and natural', () => {
        const input = {
            winner: "player",
            any_pair: "both",
            perfect_pair: true,
            dragon_bonus: "none",
            super_6: false,
            natural: true,
            hand_size: "small"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.PLAYER_BOTH_PAIR_ANY_PAIR);
        expect(result.combination).toBe(BACCombinations.SMALL_PLAYER_NATURAL_PERFECT_PAIR);
        // expect(isValidCombination(BACResult.PLAYER_BOTH_PAIR_ANY_PAIR, BACCombinations.SMALL_PLAYER_NATURAL_PERFECT_PAIR)).toBe(true);
    });

    test('Banker win with Super 6 and Dragon Bonus', () => {
        const input = {
            winner: "banker",
            any_pair: "none",
            perfect_pair: false,
            dragon_bonus: "banker",
            super_6: true,
            natural: false,
            hand_size: "big"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.BANKER);
        expect(result.combination).toBe(BACCombinations.BIG_SUPER_6_BANKER_DRAGON_BONUS); 
    });

    test('Player win with Natural and Dragon Bonus', () => {
        const input = {
            winner: "player",
            any_pair: "none",
            perfect_pair: false,
            dragon_bonus: "player",
            super_6: false,
            natural: true,
            hand_size: "small"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.PLAYER);
        expect(result.combination).toBe(BACCombinations.SMALL_PLAYER_DRAGON_BONUS); 
    });

    test('Banker win with Player Pair', () => {
        const input = {
            winner: "banker",
            any_pair: "player",
            perfect_pair: false,
            dragon_bonus: "none",
            super_6: false,
            natural: false,
            hand_size: "big"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.BANKER_PLAYER_PAIR_ANY_PAIR);
        expect(result.combination).toBe(BACCombinations.ONLY_BIG); 
    });

    test('Player win with Banker Pair', () => {
        const input = {
            winner: "player",
            any_pair: "banker",
            perfect_pair: false,
            dragon_bonus: "none",
            super_6: false,
            natural: false,
            hand_size: "small"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.PLAYER_BANKER_PAIR_ANY_PAIR);
        expect(result.combination).toBe(BACCombinations.ONLY_SMALL); 
    });

    test('Tie with Banker Pair', () => {
        const input = {
            winner: "tie",
            any_pair: "banker",
            perfect_pair: false,
            dragon_bonus: "none",
            super_6: false,
            natural: false,
            hand_size: "big"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.TIE_BANKER_PAIR_ANY_PAIR);
        expect(result.combination).toBe(BACCombinations.BIG_TIE); 
    });

    test('Banker win with both pairs and perfect pair', () => {
        const input = {
            winner: "banker",
            any_pair: "both",
            perfect_pair: true,
            dragon_bonus: "none",
            super_6: false,
            natural: false,
            hand_size: "big"
        };
        const result = generateEnumsFromInput(input);
        expect(result.result).toBe(BACResult.BANKER_BOTH_PAIR_ANY_PAIR);
        expect(result.combination).toBe(BACCombinations.ONLY_BIG); 
    });
});