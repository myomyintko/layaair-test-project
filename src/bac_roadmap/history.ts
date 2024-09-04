interface card {
    value: string,
    suit: string
}

interface cardsMap {
    [key: number]: card
}

class BacHistory {
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
    }
}

const resultObjArr =
    [
        {
            "gameNo": 113908004,
            "gameNoRound": 1,
            "result": 41,
            "resultContent": "b:53,73,45;p:51,4,12"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 2,
            "result": 33,
            "resultContent": "b:24,50,;p:49,2,51"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 3,
            "result": 42,
            "resultContent": "b:32,52,45;p:3,28,25"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 4,
            "result": 193,
            "resultContent": "b:50,69,;p:24,49,"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 5,
            "result": 34,
            "resultContent": "b:65,47,21;p:45,8,1"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 6,
            "result": 33,
            "resultContent": "b:68,49,;p:25,27,31"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 7,
            "result": 33,
            "resultContent": "b:6,47,53;p:12,73,72"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 8,
            "result": 322,
            "resultContent": "b:2,68,;p:64,45,"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 9,
            "result": 33,
            "resultContent": "b:27,28,;p:47,5,30"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 10,
            "result": 34,
            "resultContent": "b:63,53,8;p:5,48,6"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 11,
            "result": 42,
            "resultContent": "b:70,10,61;p:53,31,23"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 12,
            "result": 36,
            "resultContent": "b:11,70,1;p:30,44,7"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 13,
            "result": 34,
            "resultContent": "b:65,50,6;p:26,61,"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 14,
            "result": 322,
            "resultContent": "b:4,42,;p:66,62,"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 15,
            "result": 33,
            "resultContent": "b:22,43,;p:44,48,42"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 16,
            "result": 201,
            "resultContent": "b:9,69,;p:3,48,"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 17,
            "result": 68,
            "resultContent": "b:9,10,;p:61,28,"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 18,
            "result": 193,
            "resultContent": "b:47,42,;p:27,44,"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 19,
            "result": 34,
            "resultContent": "b:65,13,;p:1,69,68"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 20,
            "result": 34,
            "resultContent": "b:28,23,71;p:13,71,26"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 21,
            "result": 33,
            "resultContent": "b:41,43,25;p:11,33,24"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 22,
            "result": 34,
            "resultContent": "b:29,43,41;p:71,41,8"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 23,
            "result": 34,
            "resultContent": "b:46,33,;p:45,68,44"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 24,
            "result": 338,
            "resultContent": "b:31,53,;p:29,69,"
        },
        {
            "gameNo": 113908004,
            "gameNoRound": 25,
            "result": 33,
            "resultContent": "b:70,26,;p:50,41,71"
        }
    ]
const bacHistory = new BacHistory()
resultObjArr.forEach(result => {
    const { bankerCardValues, playerCardValues } = bacHistory.ParseResultContent(result.resultContent);
    bacHistory.CalculateHistoryResult(bankerCardValues, playerCardValues);
})