"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var BacHistory = /** @class */ (function () {
    function BacHistory() {
        this.breadRoadArray = [];
        this.breadRoadArray2 = [];
        this.bigRoadArray = [];
        this.bigRoadFormattedArray = [];
        this.cards = {
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
        };
        this.resultTypes = {
            1: 'banker', 9: 'banker', 17: 'banker', 25: 'banker', 5: 'banker', 13: 'banker', 21: 'banker', 29: 'banker',
            2: 'player', 10: 'player', 18: 'player', 26: 'player', 6: 'player', 14: 'player', 22: 'player', 30: 'player',
            4: 'tie', 12: 'tie', 20: 'tie', 28: 'tie',
        };
    }
    BacHistory.prototype.ParseResultContent = function (resultContent) {
        var _a = resultContent
            .split(";")
            .map(function (side) { return side.split(":")[1]; }), bankerHand = _a[0], playerHand = _a[1];
        return {
            bankerCardValues: this.getCardValue(bankerHand),
            playerCardValues: this.getCardValue(playerHand),
        };
    };
    BacHistory.prototype.extractCardValues = function (part) {
        return part.map(function (_a) {
            var value = _a.value;
            return value === "A"
                ? 1
                : ["J", "Q", "K"].includes(value)
                    ? 0
                    : parseInt(value, 10) % 10;
        });
    };
    BacHistory.prototype.getCardValue = function (part) {
        var _this = this;
        return part
            .split(",")
            .map(function (card) { return card.match(/\d+/); })
            .map(function (match) { return (match ? parseInt(match[0]) : 0); })
            .filter(function (val) { return val > 0; })
            .map(function (val) { return _this.cards[val]; });
    };
    BacHistory.prototype.calculateHandValue = function (cards) {
        return cards.reduce(function (sum, card) { return sum + card; }, 0) % 10;
    };
    BacHistory.prototype.isNaturalWin = function (bankerCards, playerCards) {
        var bankerValue = this.calculateHandValue(bankerCards);
        var playerValue = this.calculateHandValue(playerCards);
        return ((playerCards.length === 2 && (playerValue === 8 || playerValue === 9)) ||
            (bankerCards.length === 2 && (bankerValue === 8 || bankerValue === 9)));
    };
    BacHistory.prototype.isPerfectPair = function (bankerCardValues, playerCardValues) {
        return ((bankerCardValues.length === 2 &&
            playerCardValues.length === 2 &&
            bankerCardValues[0].value === bankerCardValues[1].value &&
            bankerCardValues[0].suit === bankerCardValues[1].suit) ||
            (playerCardValues[0].value === playerCardValues[1].value &&
                playerCardValues[0].suit === playerCardValues[1].suit));
    };
    BacHistory.prototype.hasPair = function (cards, pairType) {
        return pairType === "face"
            ? cards[0].value === cards[1].value
            : pairType === "suit"
                ? cards[0].suit === cards[1].suit
                : cards[0].value === cards[1].value || cards[0].suit === cards[1].suit;
    };
    BacHistory.prototype.isSmallOrBig = function (cards) {
        var count = cards.length;
        return count === 4 ? "Small" : count >= 5 && count <= 6 ? "Big" : "None";
    };
    BacHistory.prototype.isSuper6 = function (bankerHandValue, playerHandValue) {
        return bankerHandValue > playerHandValue && bankerHandValue === 6;
    };
    BacHistory.prototype.isDragonBonus = function (bankerCards, playerCards) {
        var bankerValue = this.calculateHandValue(bankerCards);
        var playerValue = this.calculateHandValue(playerCards);
        var margin = Math.abs(bankerValue - playerValue);
        var bonusType = bankerValue > playerValue ? "Banker Dragon Bonus" : "Player Dragon Bonus";
        if (this.isNaturalWin(bankerCards, playerCards) && margin < 9) {
            bonusType += " Natural Win";
        }
        else if ([9, 8, 7, 6, 5, 4].includes(margin)) {
            bonusType += " with ".concat(margin, " points");
        }
        else {
            bonusType = "None";
        }
        return bonusType;
    };
    BacHistory.prototype.calculateKAndSuffix = function (bankerCards, playerCards, bankerPair, playerPair) {
        var playerValue = this.calculateHandValue(playerCards);
        var bankerValue = this.calculateHandValue(bankerCards);
        var k = 0;
        var suffix = 0;
        var result = "";
        if (this.isNaturalWin(bankerCards, playerCards)) {
            k = 10;
        }
        var isTie = bankerValue === playerValue;
        var isBankerWin = bankerValue > playerValue;
        var isPlayerWin = !isTie && !isBankerWin;
        var isBothPairs = bankerPair && playerPair;
        var isTwoCardHands = playerCards.length === 2 && bankerCards.length === 2;
        if (isTie) {
            k = isTwoCardHands ? 2 : 1;
            if (isBothPairs) {
                suffix = 28;
                result = "T:both";
            }
            else if (bankerPair) {
                suffix = 12;
                result = "T:banker";
            }
            else if (playerPair) {
                suffix = 20;
                result = "T:player";
            }
            else {
                suffix = 4;
                result = "T:";
            }
        }
        else if (isBankerWin) {
            k = isTwoCardHands ? 6 : 1;
            if (isBothPairs) {
                suffix = 25;
                result = "B:both";
            }
            else if (bankerPair) {
                suffix = 9;
                result = "B:banker";
            }
            else if (playerPair) {
                suffix = 17;
                result = "B:player";
            }
            else {
                suffix = 1;
                var bankerFirstHandValue = this.calculateHandValue(bankerCards.slice(0, 2));
                result = bankerFirstHandValue >= 8 ? "B:natural" : "B:";
            }
        }
        else if (isPlayerWin) {
            k = isTwoCardHands ? 10 : 1;
            if (isBothPairs) {
                suffix = 26;
                result = "P:both";
            }
            else if (bankerPair) {
                suffix = 10;
                result = "P:banker";
            }
            else if (playerPair) {
                suffix = 18;
                result = "P:player";
            }
            else {
                suffix = 2;
                var playerFirstHandValue = this.calculateHandValue(playerCards.slice(0, 2));
                result = playerFirstHandValue >= 8 ? "P:natural" : "P:";
            }
        }
        return { k: k, suffix: suffix, result: result };
    };
    BacHistory.prototype.CalculateHistoryResult = function (bankerCardValues, playerCardValues) {
        // calculate pairs
        var bankerPair = this.hasPair(bankerCardValues, "face");
        var playerPair = this.hasPair(playerCardValues, "face");
        var perfectPair = this.isPerfectPair(bankerCardValues, playerCardValues);
        var eitherPair = bankerPair || playerPair;
        // Extract card values
        var bankerCardValuesNumeric = this.extractCardValues(bankerCardValues);
        var playerCardValuesNumeric = this.extractCardValues(playerCardValues);
        // Calculate hand values
        var bankerHandValue = this.calculateHandValue(bankerCardValuesNumeric);
        var playerHandValue = this.calculateHandValue(playerCardValuesNumeric);
        var super6 = this.isSuper6(bankerHandValue, playerHandValue);
        var dragonBonusType = this.isDragonBonus(bankerCardValuesNumeric, playerCardValuesNumeric);
        // Determine hand type
        var smallOrBig = this.isSmallOrBig(__spreadArray(__spreadArray([], bankerCardValuesNumeric, true), playerCardValuesNumeric, true));
        // Calculate k and suffix
        var _a = this.calculateKAndSuffix(bankerCardValuesNumeric, playerCardValuesNumeric, bankerPair, playerPair), k = _a.k, suffix = _a.suffix, result = _a.result;
        this.breadRoadArray.push(k * 32 + suffix);
        this.breadRoadArray2.push(Number("".concat(k * 32 + suffix).concat(playerHandValue).concat(bankerHandValue)));
    };
    BacHistory.prototype.getResultType = function (result) {
        return this.resultTypes[result & 31] || null;
    };
    BacHistory.prototype.GetBreadArray = function () {
        return this.breadRoadArray;
    };
    BacHistory.prototype.GetBreadArray2 = function () {
        return this.breadRoadArray;
    };
    BacHistory.prototype.GetBigRoadArray = function () {
        var _this = this;
        this.bigRoadArray = [];
        var breadRoadArray = (0, lodash_1.cloneDeep)(this.breadRoadArray);
        var tempArray = [];
        var startIndex = 0;
        while (startIndex < breadRoadArray.length && this.getResultType(breadRoadArray[startIndex]) === 'tie') {
            startIndex++;
        }
        if (startIndex > 0) {
            breadRoadArray = breadRoadArray.slice(startIndex);
            breadRoadArray[0] += 4; // add tie
        }
        breadRoadArray.forEach(function (road, index) {
            var identity = _this.getResultType(road);
            if (tempArray.length == 0) {
                tempArray.push(road);
            }
            else {
                if (identity == "tie") {
                    if (_this.getResultType(breadRoadArray[index - 1]) !== "tie") {
                        tempArray[tempArray.length - 1] += 4;
                    }
                }
                else if (_this.getResultType(tempArray[tempArray.length - 1]) === identity) {
                    tempArray.push(road);
                }
                else {
                    _this.bigRoadArray.push(tempArray);
                    tempArray = [];
                    tempArray.push(road);
                }
            }
        });
        if (tempArray.length > 0) {
            this.bigRoadArray.push(tempArray);
        }
        this.bigRoadFormattedArray = this.formatBigRoadArray(this.bigRoadArray).matrix;
        return this.bigRoadArray;
    };
    BacHistory.prototype.formatBigRoadArray = function (array) {
        var col = 6;
        var lastX = -1, lastY = -1, newY = col;
        var matrix = Array.from({ length: array.length }, function () { return Array(col).fill(0); });
        array.forEach(function (row, rowIndex) {
            newY = matrix[rowIndex].filter(function (item) { return !item; }).length - 1;
            row.forEach(function (col, colIndex) {
                lastX = rowIndex;
                lastY = colIndex;
                if (colIndex > newY) {
                    lastX = rowIndex + (colIndex - newY);
                    lastY = newY;
                    if (!(matrix[lastX])) {
                        matrix[lastX] = Array(col).fill(0);
                    }
                }
                matrix[lastX][lastY] = col;
            });
        });
        return { matrix: matrix, lastX: lastX, lastY: lastY, newY: newY };
    };
    BacHistory.prototype.isValidIndex = function (array, index) {
        return index >= 0 && index < array.length;
    };
    BacHistory.prototype.getColumnLength = function (array) {
        return array.reduce(function (total, element) { return total + (element === 0 ? 1 : 0); }, 0);
    };
    BacHistory.prototype.convertToMatrix = function (array) {
        var matrix = [];
        var tempArr = [];
        array.forEach(function (element, index) {
            if (tempArr.length === 0) {
                tempArr.push(element);
            }
            else {
                if (array[array.length - 1] === element) {
                    tempArr.push(element);
                }
                else {
                    matrix.push(tempArr);
                    tempArr = [];
                    tempArr.push(element);
                }
            }
        });
        if (tempArr.length > 0) {
            matrix.push(tempArr);
        }
        return matrix;
    };
    BacHistory.prototype.generateRoadmap = function (bigRoadArray, startIndex, margin) {
        var _this = this;
        var tempArray = [];
        bigRoadArray.forEach(function (col, colIndex) {
            if (colIndex > startIndex) {
                col.forEach(function (cell, cellIndex) {
                    if (!(colIndex === margin - 1 && cellIndex === 0) && cell) {
                        /**
                         * If first row, check the lengths of previous ${margin} columns
                         */
                        if (cellIndex === 0) {
                            /**
                             * Get the column exactly to the right
                             */
                            var prevColALength = _this.getColumnLength(bigRoadArray[colIndex - 1]);
                            /**
                             * Get the ${margin} column to the right
                             */
                            var prevColBLength = _this.getColumnLength(bigRoadArray[colIndex - margin]);
                            if (prevColALength === prevColBLength) {
                                tempArray.push(1);
                            }
                            else {
                                tempArray.push(2);
                            }
                        }
                        else {
                            /**
                             * If non first row, check the left col and the upper left column
                             */
                            var tempIdx = margin - 1;
                            var leftColLower = bigRoadArray[colIndex - tempIdx][cellIndex];
                            var leftColUpper = bigRoadArray[colIndex - tempIdx][cellIndex - 1];
                            var leftColLowerIdentity = _this.getResultType(leftColLower);
                            var leftColUpperIdentity = _this.getResultType(leftColUpper);
                            var isMatch = [
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
                                tempArray.push(1);
                            }
                            else {
                                tempArray.push(2);
                            }
                        }
                    }
                });
            }
        });
        return this.convertToMatrix(tempArray);
    };
    BacHistory.prototype.GetBigEyeRoadArray = function () {
        return this.generateRoadmap(this.bigRoadFormattedArray, 0, 2);
    };
    BacHistory.prototype.GetSmallRoadArray = function () {
        return this.generateRoadmap(this.bigRoadFormattedArray, 2, 3);
    };
    BacHistory.prototype.GetCockroachRoadArray = function () {
        return this.generateRoadmap(this.bigRoadFormattedArray, 2, 4);
    };
    return BacHistory;
}());
var resultObjArr = [
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
];
var bacHistory = new BacHistory();
resultObjArr.forEach(function (result) {
    var _a = bacHistory.ParseResultContent(result.resultContent), bankerCardValues = _a.bankerCardValues, playerCardValues = _a.playerCardValues;
    bacHistory.CalculateHistoryResult(bankerCardValues, playerCardValues);
});
console.log("BreadRoadArray: ", bacHistory.GetBreadArray());
console.log("BreadRoadArray2: ", bacHistory.GetBreadArray2());
console.log("BigRoadArray: ", bacHistory.GetBigRoadArray());
console.log("BigEyeRoadArray: ", bacHistory.GetBigEyeRoadArray());
console.log("SmallRoadArray: ", bacHistory.GetSmallRoadArray());
console.log("CockroachRoadArray: ", bacHistory.GetCockroachRoadArray());
