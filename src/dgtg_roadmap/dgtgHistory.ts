import * as data from "./ds.json"
interface card {
    value: string,
    suit: string,
    color: string
}

interface cardsMap {
    [key: number]: card
}

class DgtgHistory {
    private cards: cardsMap = {
        1: { value: "A", suit: "C", color: "B" }, 2: { value: "2", suit: "C", color: "B" }, 3: { value: "3", suit: "C", color: "B" }, 4: { value: "4", suit: "C", color: "B" },
        5: { value: "5", suit: "C", color: "B" }, 6: { value: "6", suit: "C", color: "B" }, 7: { value: "7", suit: "C", color: "B" }, 8: { value: "8", suit: "C", color: "B" },
        9: { value: "9", suit: "C", color: "B" }, 10: { value: "10", suit: "C", color: "B" }, 11: { value: "J", suit: "C", color: "B" }, 12: { value: "Q", suit: "C", color: "B" },
        13: { value: "K", suit: "C", color: "B" },

        21: { value: "A", suit: "S", color: "B" }, 22: { value: "2", suit: "S", color: "B" }, 23: { value: "3", suit: "S", color: "B" }, 24: { value: "4", suit: "S", color: "B" },
        25: { value: "5", suit: "S", color: "B" }, 26: { value: "6", suit: "S", color: "B" }, 27: { value: "7", suit: "S", color: "B" }, 28: { value: "8", suit: "S", color: "B" },
        29: { value: "9", suit: "S", color: "B" }, 30: { value: "10", suit: "S", color: "B" }, 31: { value: "J", suit: "S", color: "B" }, 32: { value: "Q", suit: "S", color: "B" },
        33: { value: "K", suit: "S", color: "B" },

        41: { value: "A", suit: "H", color: "R" }, 42: { value: "2", suit: "H", color: "R" }, 43: { value: "3", suit: "H", color: "R" }, 44: { value: "4", suit: "H", color: "R" },
        45: { value: "5", suit: "H", color: "R" }, 46: { value: "6", suit: "H", color: "R" }, 47: { value: "7", suit: "H", color: "R" }, 48: { value: "8", suit: "H", color: "R" },
        49: { value: "9", suit: "H", color: "R" }, 50: { value: "10", suit: "H", color: "R" }, 51: { value: "J", suit: "H", color: "R" }, 52: { value: "Q", suit: "H", color: "R" },
        53: { value: "K", suit: "H", color: "R" },

        61: { value: "A", suit: "D", color: "R" }, 62: { value: "2", suit: "D", color: "R" }, 63: { value: "3", suit: "D", color: "R" }, 64: { value: "4", suit: "D", color: "R" },
        65: { value: "5", suit: "D", color: "R" }, 66: { value: "6", suit: "D", color: "R" }, 67: { value: "7", suit: "D", color: "R" }, 68: { value: "8", suit: "D", color: "R" },
        69: { value: "9", suit: "D", color: "R" }, 70: { value: "10", suit: "D", color: "R" }, 71: { value: "J", suit: "D", color: "R" }, 72: { value: "Q", suit: "D", color: "R" },
        73: { value: "K", suit: "D", color: "R" },
    }

    ParseResultContent(resultContent: string): { dragonCardValues: card, tigerCardValues: card } {
        const [dragonHand, tigerHand] = resultContent
            .split(";")
            .map((side) => side.split(":")[1]);
        return {
            dragonCardValues: this.getCardValue(dragonHand),
            tigerCardValues: this.getCardValue(tigerHand),
        };
    }

    private extractCardValue(card: card): number {
        const { value } = card;
        return value === "A"
            ? 1
            : value === "J"
                ? 11
                : value === "Q"
                    ? 12
                    : value === "K"
                        ? 13
                        : parseInt(value, 10);
    }

    private getCardValue(part: string): card {
        const match = part
            .split(",")
            .map((card) => card.match(/\d+/))
            .find((match) => match && parseInt(match[0]) > 0);

        return match ? this.cards[parseInt(match[0])] : {} as card
    }

    private calculateSuffix(dragonCard: number, tigerCard: number): { suffix: number; result: string } {
        let suffix = 0;
        let result = "";

        const isTie = dragonCard === tigerCard;
        const isDragonWin = dragonCard > tigerCard;
        const isTigerWin = !isTie && !isDragonWin;

        if (isTie) {
            suffix = 4;
            result = "T:";
        } else if (isDragonWin) {
            suffix = 1;
            result = "Dg:";
        } else if (isTigerWin) {
            suffix = 2;
            result = "Tg:";
        }

        return { suffix, result };
    }

    CalculateHistoryResult(dragonCardValue: card, tigerCardValue: card): void {
        // Extract card values
        const dragonValue = this.extractCardValue(dragonCardValue);
        const tigerValue = this.extractCardValue(tigerCardValue);

        // Padding values to two digits
        const dragonValueString = dragonValue.toString().padStart(2, '0');
        const tigerValueString = tigerValue.toString().padStart(2, '0');

        // Calculate suffix and result
        const { suffix, result } = this.calculateSuffix(dragonValue, tigerValue);

        // Dragon properties
        const { color: dragonColor } = dragonCardValue;
        const isDragonOdd = dragonValue % 2 !== 0;

        // Tiger properties
        const { color: tigerColor } = tigerCardValue;
        const isTigerOdd = tigerValue % 2 !== 0;

        // Log the result
        console.log(`
            Cards: {
                Dragon: ${JSON.stringify(dragonCardValue)} (${dragonValue}),
                Tiger: ${JSON.stringify(tigerCardValue)} (${tigerValue}),
            },
            Winner: ${result}${suffix}${tigerValueString}${dragonValueString},
            Dragon Odd: ${isDragonOdd},
            Dragon Even: ${!isDragonOdd},
            Dragon Color: ${dragonColor},

            Tiger Odd: ${isTigerOdd},
            Tiger Even: ${!isTigerOdd},
            Tiger Color: ${tigerColor}
        `);
    }
}

const dgtgHistory = new DgtgHistory()
data.resultObjArr.forEach(result => {
    const { dragonCardValues, tigerCardValues } = dgtgHistory.ParseResultContent(result.resultContent);
    dgtgHistory.CalculateHistoryResult(dragonCardValues, tigerCardValues);
})