import { cloneDeep } from "lodash"

interface card {
    value: string,
    suit: string
}
interface cardsMap {
    [key: number]: card
}

type resultType = "player" | "banker" | "tie"

interface resultTypeMap {
    [key: number]: resultType
}

class BacHistory {
    private breadRoadArray: number[]
    private breadRoadArray2: number[]
    private bigRoadArray: number[][]
    private bigRoadFormattedArray: number[][]

    private cards: cardsMap = {
        1: { value: "A", suit: "C" }, 2: { value: "2", suit: "C" }, 3: { value: "3", suit: "C" }, 4: { value: "4", suit: "C" },
        5: { value: "5", suit: "C" }, 6: { value: "6", suit: "C" }, 7: { value: "7", suit: "C" }, 8: { value: "8", suit: "C" },
        9: { value: "9", suit: "C" }, 10: { value: "10", suit: "C" }, 11: { value: "J", suit: "C" }, 12: { value: "Q", suit: "C" },
        13: { value: "K", suit: "C" },

        21: { value: "A", suit: "S" }, 22: { value: "2", suit: "S" }, 23: { value: "3", suit: "S" }, 24: { value: "4", suit: "S" },
        25: { value: "5", suit: "S" }, 26: { value: "6", suit: "S" }, 27: { value: "7", suit: "S" }, 28: { value: "8", suit: "S" },
        29: { value: "9", suit: "S" }, 30: { value: "10", suit: "S" }, 31: { value: "J", suit: "S" }, 32: { value: "Q", suit: "S" },
        33: { value: "K", suit: "S" },

        41: { value: "A", suit: "H" }, 42: { value: "2", suit: "H" }, 43: { value: "3", suit: "H" }, 44: { value: "4", suit: "H" },
        45: { value: "5", suit: "H" }, 46: { value: "6", suit: "H" }, 47: { value: "7", suit: "H" }, 48: { value: "8", suit: "H" },
        49: { value: "9", suit: "H" }, 50: { value: "10", suit: "H" }, 51: { value: "J", suit: "H" }, 52: { value: "Q", suit: "H" },
        53: { value: "K", suit: "H" },

        61: { value: "A", suit: "D" }, 62: { value: "2", suit: "D" }, 63: { value: "3", suit: "D" }, 64: { value: "4", suit: "D" },
        65: { value: "5", suit: "D" }, 66: { value: "6", suit: "D" }, 67: { value: "7", suit: "D" }, 68: { value: "8", suit: "D" },
        69: { value: "9", suit: "D" }, 70: { value: "10", suit: "D" }, 71: { value: "J", suit: "D" }, 72: { value: "Q", suit: "D" },
        73: { value: "K", suit: "D" },
    }

    ParseResultContent(resultContent: string): { bankerCardValues: card[], playerCardValues: card[] } {
        const [bankerHand, playerHand] = resultContent
            .split(";")
            .map((side) => side.split(":")[1]);
        return {
            bankerCardValues: this.getCardValue(bankerHand),
            playerCardValues: this.getCardValue(playerHand),
        };
    }

    private extractCardValues(part: card[]): number[] {
        return part.map(({ value }) =>
            value === "A"
                ? 1
                : ["J", "Q", "K"].includes(value)
                    ? 0
                    : parseInt(value, 10) % 10
        );
    }

    private getCardValue(part: string): card[] {
        return part
            .split(",")
            .map((card) => card.match(/\d+/))
            .map((match) => (match ? parseInt(match[0]) : 0))
            .filter((val) => val > 0)
            .map((val) => this.cards[val]);
    }

    private calculateHandValue(cards: number[]): number {
        return cards.reduce((sum, card) => sum + card, 0) % 10;
    }

    private isNaturalWin(bankerCards: number[], playerCards: number[]): boolean {
        const bankerValue = this.calculateHandValue(bankerCards);
        const playerValue = this.calculateHandValue(playerCards);

        return (
            (playerCards.length === 2 && (playerValue === 8 || playerValue === 9)) ||
            (bankerCards.length === 2 && (bankerValue === 8 || bankerValue === 9))
        );
    }

    private isPerfectPair(bankerCardValues: card[], playerCardValues: card[]) {
        return (
            (bankerCardValues.length === 2 &&
                playerCardValues.length === 2 &&
                bankerCardValues[0].value === bankerCardValues[1].value &&
                bankerCardValues[0].suit === bankerCardValues[1].suit) ||
            (playerCardValues[0].value === playerCardValues[1].value &&
                playerCardValues[0].suit === playerCardValues[1].suit)
        );
    }

    private hasPair(cards: card[], pairType?: "face" | "suit"): boolean {
        return pairType === "face"
            ? cards[0].value === cards[1].value
            : pairType === "suit"
                ? cards[0].suit === cards[1].suit
                : cards[0].value === cards[1].value || cards[0].suit === cards[1].suit;
    }

    private isSmallOrBig(cards: number[]): "Big" | "Small" | "None" {
        const count = cards.length;
        return count === 4 ? "Small" : count >= 5 && count <= 6 ? "Big" : "None";
    }

    private isSuper6(bankerHandValue: number, playerHandValue: number): boolean {
        return bankerHandValue > playerHandValue && bankerHandValue === 6;
    }

    private isDragonBonus(bankerCards: number[], playerCards: number[]): string {
        const bankerValue = this.calculateHandValue(bankerCards);
        const playerValue = this.calculateHandValue(playerCards);
        const margin = Math.abs(bankerValue - playerValue);
        let bonusType =
            bankerValue > playerValue ? "Banker Dragon Bonus" : "Player Dragon Bonus";

        if (this.isNaturalWin(bankerCards, playerCards) && margin < 9) {
            bonusType += " Natural Win";
        } else if ([9, 8, 7, 6, 5, 4].includes(margin)) {
            bonusType += ` with ${margin} points`;
        } else {
            bonusType = "None";
        }

        return bonusType;
    }

    private calculateKAndSuffix(bankerCards: number[], playerCards: number[], bankerPair: boolean, playerPair: boolean): { k: number; suffix: number; result: string } {
        const playerValue = this.calculateHandValue(playerCards);
        const bankerValue = this.calculateHandValue(bankerCards);

        let k = 0;
        let suffix = 0;
        let result = "";

        if (this.isNaturalWin(bankerCards, playerCards)) {
            k = 10;
        }

        const isTie = bankerValue === playerValue;
        const isBankerWin = bankerValue > playerValue;
        const isPlayerWin = !isTie && !isBankerWin;
        const isBothPairs = bankerPair && playerPair;
        const isTwoCardHands = playerCards.length === 2 && bankerCards.length === 2;

        if (isTie) {
            k = isTwoCardHands ? 2 : 1;
            if (isBothPairs) {
                suffix = 28;
                result = "T:both";
            } else if (bankerPair) {
                suffix = 12;
                result = "T:banker";
            } else if (playerPair) {
                suffix = 20;
                result = "T:player";
            } else {
                suffix = 4;
                result = "T:";
            }
        } else if (isBankerWin) {
            k = isTwoCardHands ? 6 : 1;
            if (isBothPairs) {
                suffix = 25;
                result = "B:both";
            } else if (bankerPair) {
                suffix = 9;
                result = "B:banker";
            } else if (playerPair) {
                suffix = 17;
                result = "B:player";
            } else {
                suffix = 1;
                const bankerFirstHandValue = this.calculateHandValue(bankerCards.slice(0, 2));
                result = bankerFirstHandValue >= 8 ? "B:natural" : "B:";
            }
        } else if (isPlayerWin) {
            k = isTwoCardHands ? 10 : 1;
            if (isBothPairs) {
                suffix = 26;
                result = "P:both";
            } else if (bankerPair) {
                suffix = 10;
                result = "P:banker";
            } else if (playerPair) {
                suffix = 18;
                result = "P:player";
            } else {
                suffix = 2;
                const playerFirstHandValue = this.calculateHandValue(playerCards.slice(0, 2));
                result = playerFirstHandValue >= 8 ? "P:natural" : "P:";
            }
        }

        return { k, suffix, result };
    }

    CalculateHistoryResult(bankerCardValues: card[], playerCardValues: card[]) {
        // calculate pairs
        const bankerPair = this.hasPair(bankerCardValues, "face");
        const playerPair = this.hasPair(playerCardValues, "face");
        const perfectPair = this.isPerfectPair(bankerCardValues, playerCardValues);
        const eitherPair = bankerPair || playerPair;

        // Extract card values
        const bankerCardValuesNumeric = this.extractCardValues(bankerCardValues);
        const playerCardValuesNumeric = this.extractCardValues(playerCardValues);

        // Calculate hand values
        const bankerHandValue = this.calculateHandValue(bankerCardValuesNumeric);
        const playerHandValue = this.calculateHandValue(playerCardValuesNumeric);

        const super6 = this.isSuper6(bankerHandValue, playerHandValue);
        const dragonBonusType = this.isDragonBonus(
            bankerCardValuesNumeric,
            playerCardValuesNumeric
        );

        // Determine hand type
        const smallOrBig = this.isSmallOrBig([
            ...bankerCardValuesNumeric,
            ...playerCardValuesNumeric,
        ]);

        // Calculate k and suffix
        const { k, suffix, result } = this.calculateKAndSuffix(
            bankerCardValuesNumeric,
            playerCardValuesNumeric,
            bankerPair,
            playerPair
        );

        this.breadRoadArray.push(k * 32 + suffix);
        this.breadRoadArray2.push(Number(`${k * 32 + suffix}${playerHandValue}${bankerHandValue}`));
    }

    private resultTypes: resultTypeMap = {
        1: 'banker', 9: 'banker', 17: 'banker', 25: 'banker', 5: 'banker', 13: 'banker', 21: 'banker', 29: 'banker',
        2: 'player', 10: 'player', 18: 'player', 26: 'player', 6: 'player', 14: 'player', 22: 'player', 30: 'player',
        4: 'tie', 12: 'tie', 20: 'tie', 28: 'tie',
    }

    private getResultType(result: number): resultType | null {
        return this.resultTypes[result & 31] || null;
    }

    GetBreadArray(): number[] {
        return this.breadRoadArray;
    }

    GetBreadArray2(): number[] {
        return this.breadRoadArray;
    }

    GetBigRoadArray(): number[][] {
        this.bigRoadArray = []
        let breadRoadArray = cloneDeep(this.breadRoadArray)
        let tempArray: number[] = []
        let startIndex = 0

        while (startIndex < breadRoadArray.length && this.getResultType(breadRoadArray[startIndex]) === 'tie') {
            startIndex++
        }

        if (startIndex > 0) {
            breadRoadArray = breadRoadArray.slice(startIndex)
            breadRoadArray[0] += 4 // add tie
        }

        breadRoadArray.forEach((road, index) => {
            const identity = this.getResultType(road)
            if (tempArray.length == 0) {
                tempArray.push(road)
            } else {
                if (identity == "tie") {
                    if (getResultType(breadRoadArray[index - 1]) !== "tie") {
                        tempArray[tempArray.length - 1] += 4;
                    }
                } else if (getResultType(tempArray[tempArray.length - 1]) === identity) {
                    tempArray.push(road);
                } else {
                    this.bigRoadArray.push(tempArray);
                    tempArray = [];
                    tempArray.push(road);
                }
            }
        })

        if (tempArray.length > 0) {
            this.bigRoadArray.push(tempArray)
        }
        this.bigRoadFormattedArray = this.formatBigRoadArray(this.bigRoadArray).matrix
        return this.bigRoadArray
    }

    private formatBigRoadArray(array: number[][]): { matrix: number[][]; lastX: number; lastY: number; newY: number } {
        const col = 6
        let lastX = -1, lastY = -1, newY = col
        const matrix: number[][] = Array.from({ length: array.length }, () => Array(col).fill(0))

        array.forEach((row, rowIndex) => {
            newY = matrix[rowIndex].filter(item => !item).length - 1
            row.forEach((col, colIndex) => {
                lastX = rowIndex
                lastY = colIndex
                if (colIndex > newY) {
                    lastX = rowIndex + (colIndex - newY)
                    lastY = newY
                    if (!(matrix[lastX])) {
                        matrix[lastX] = Array(col).fill(0)
                    }
                }
                matrix[lastX][lastY] = col
            })
        })
        return { matrix, lastX, lastY, newY }
    }

    private isValidIndex<T>(array: T[], index: number): boolean {
        return index >= 0 && index < array.length;
    }

    private getColumnLength(array: number[]): number {
        return array.reduce((total, element) => total + (element === 0 ? 1 : 0), 0)
    }

    private convertToMatrix(array: number[]): number[][] {
        const matrix: number[][] = []
        let tempArr: number[] = []

        array.forEach((element, index) => {
            if (tempArr.length === 0) {
                tempArr.push(element)
            } else {
                if (array[array.length - 1] === element) {
                    tempArr.push(element)
                } else {
                    matrix.push(tempArr)
                    tempArr = []
                    tempArr.push(element)
                }
            }
        })

        if (tempArr.length > 0) {
            matrix.push(tempArr)
        }

        return matrix
    }

    private generateRoadmap(bigRoadArray: number[][], startIndex: number, margin: number): number[][] {
        let tempArray: number[] = []
        bigRoadArray.forEach((col, colIndex) => {
            if (colIndex > startIndex) {
                col.forEach((cell, cellIndex) => {
                    if (!(colIndex === margin - 1 && cellIndex === 0) && cell) {
                        /**
                         * If first row, check the lengths of previous ${margin} columns
                         */
                        if (cellIndex === 0) {
                            /**
                             * Get the column exactly to the right
                             */
                            const prevColALength = this.getColumnLength(bigRoadArray[colIndex - 1])

                            /**
                             * Get the ${margin} column to the right
                             */
                            const prevColBLength = this.getColumnLength(bigRoadArray[colIndex - margin])

                            if (prevColALength === prevColBLength) {
                                tempArray.push(1)
                            } else {
                                tempArray.push(2)
                            }
                        } else {
                            /**
                             * If non first row, check the left col and the upper left column
                             */
                            const tempIdx = margin - 1
                            const leftColLower = bigRoadArray[colIndex - tempIdx][cellIndex]
                            const leftColUpper = bigRoadArray[colIndex - tempIdx][cellIndex - 1]
                            const leftColLowerIdentity = this.getResultType(leftColLower)
                            const leftColUpperIdentity = this.getResultType(leftColUpper)

                            const isMatch = [
                                /**
                                 * if they are both empty
                                 */
                                leftColLower === leftColUpper,

                                /**
                                 * If they have the same identity
                                 */
                                leftColLowerIdentity === leftColUpperIdentity
                            ].some(Boolean);
                            if (isMatch) {
                                tempArray.push(1)
                            } else {
                                tempArray.push(2)
                            }
                        }
                    }
                })
            }
        })
        return this.convertToMatrix(tempArray)
    }

    GetBigEyeRoadArray(): number[][] {
        return this.generateRoadmap(this.bigRoadFormattedArray, 0, 2)
    }

    GetSmallRoadArray(): number[][] {
        return this.generateRoadmap(this.bigRoadFormattedArray, 2, 3)
    }

    GetCockroachRoadArray(): number[][] {
        return this.generateRoadmap(this.bigRoadFormattedArray, 2, 4)
    }
}

const resultObjArr = [
    {
        "gameNo": 113907207,
        "gameNoRound": 1,
        "result": 33,
        "resultContent": "b:1,51,66;p:49,67,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 2,
        "result": 322,
        "resultContent": "b:50,1,;p:7,41,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 3,
        "result": 34,
        "resultContent": "b:12,22,68;p:32,42,67"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 4,
        "result": 49,
        "resultContent": "b:65,9,;p:13,73,30"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 5,
        "result": 36,
        "resultContent": "b:31,10,2;p:62,53,70"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 6,
        "result": 322,
        "resultContent": "b:12,23,;p:47,41,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 7,
        "result": 68,
        "resultContent": "b:26,71,;p:51,6,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 8,
        "result": 68,
        "resultContent": "b:25,4,;p:22,47,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 9,
        "result": 322,
        "resultContent": "b:31,33,;p:65,44,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 10,
        "result": 68,
        "resultContent": "b:26,10,;p:70,66,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 11,
        "result": 322,
        "resultContent": "b:33,72,;p:25,63,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 12,
        "result": 33,
        "resultContent": "b:50,51,8;p:62,70,21"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 13,
        "result": 322,
        "resultContent": "b:72,64,;p:62,6,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 14,
        "result": 34,
        "resultContent": "b:49,2,25;p:23,4,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 15,
        "result": 34,
        "resultContent": "b:67,8,25;p:43,47,7"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 16,
        "result": 193,
        "resultContent": "b:63,5,;p:72,7,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 17,
        "result": 322,
        "resultContent": "b:11,33,;p:2,67,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 18,
        "result": 322,
        "resultContent": "b:29,25,;p:9,50,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 19,
        "result": 338,
        "resultContent": "b:22,24,;p:4,44,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 20,
        "result": 34,
        "resultContent": "b:66,28,;p:11,32,48"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 21,
        "result": 34,
        "resultContent": "b:45,8,63;p:7,6,64"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 22,
        "result": 33,
        "resultContent": "b:27,70,;p:2,53,21"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 23,
        "result": 193,
        "resultContent": "b:50,28,;p:46,30,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 24,
        "result": 33,
        "resultContent": "b:21,64,;p:51,64,48"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 25,
        "result": 322,
        "resultContent": "b:45,29,;p:27,2,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 26,
        "result": 33,
        "resultContent": "b:48,67,;p:11,41,33"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 27,
        "result": 33,
        "resultContent": "b:5,22,;p:3,69,13"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 28,
        "result": 193,
        "resultContent": "b:11,49,;p:67,1,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 29,
        "result": 201,
        "resultContent": "b:24,64,;p:71,46,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 30,
        "result": 33,
        "resultContent": "b:50,21,48;p:69,6,61"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 31,
        "result": 36,
        "resultContent": "b:31,52,43;p:73,3,30"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 32,
        "result": 322,
        "resultContent": "b:48,45,;p:48,73,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 33,
        "result": 36,
        "resultContent": "b:41,23,23;p:42,5,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 34,
        "result": 322,
        "resultContent": "b:6,32,;p:72,28,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 35,
        "result": 34,
        "resultContent": "b:5,29,52;p:71,7,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 36,
        "result": 322,
        "resultContent": "b:41,71,;p:68,31,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 37,
        "result": 33,
        "resultContent": "b:32,63,;p:43,50,28"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 38,
        "result": 34,
        "resultContent": "b:3,12,52;p:64,42,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 39,
        "result": 41,
        "resultContent": "b:22,62,;p:42,53,72"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 40,
        "result": 36,
        "resultContent": "b:51,70,10;p:33,32,52"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 41,
        "result": 34,
        "resultContent": "b:71,21,61;p:46,61,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 42,
        "result": 322,
        "resultContent": "b:7,48,;p:25,44,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 43,
        "result": 68,
        "resultContent": "b:26,53,;p:1,25,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 44,
        "result": 68,
        "resultContent": "b:9,10,;p:43,6,"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 45,
        "result": 36,
        "resultContent": "b:21,51,71;p:63,48,51"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 46,
        "result": 42,
        "resultContent": "b:12,52,23;p:32,11,69"
    },
    {
        "gameNo": 113907207,
        "gameNoRound": 47,
        "result": 34,
        "resultContent": "b:70,61,52;p:73,45,29"
    }
]
const bacHistory = new BacHistory()
resultObjArr.forEach(result => {
    const { bankerCardValues, playerCardValues } = bacHistory.ParseResultContent(result.resultContent);
    bacHistory.CalculateHistoryResult(bankerCardValues, playerCardValues);
})
console.log("BreadRoadArray: ",bacHistory.GetBreadArray())
console.log("BreadRoadArray2: ",bacHistory.GetBreadArray2())
console.log("BigRoadArray: ",bacHistory.GetBigRoadArray())
console.log("BigEyeRoadArray: ",bacHistory.GetBigEyeRoadArray())
console.log("SmallRoadArray: ",bacHistory.GetSmallRoadArray())
console.log("CockroachRoadArray: ",bacHistory.GetCockroachRoadArray())
