// const cardMaps: { [key: number]: { value: string; suit: string } } = {
//   1: { value: "A", suit: "C" }, 2: { value: "2", suit: "C" }, 3: { value: "3", suit: "C" }, 4: { value: "4", suit: "C" },
//   5: { value: "5", suit: "C" }, 6: { value: "6", suit: "C" }, 7: { value: "7", suit: "C" }, 8: { value: "8", suit: "C" },
//   9: { value: "9", suit: "C" }, 10: { value: "10", suit: "C" }, 11: { value: "J", suit: "C" }, 12: { value: "Q", suit: "C" },
//   13: { value: "K", suit: "C" },

//   21: { value: "A", suit: "S" }, 22: { value: "2", suit: "S" }, 23: { value: "3", suit: "S" }, 24: { value: "4", suit: "S" },
//   25: { value: "5", suit: "S" }, 26: { value: "6", suit: "S" }, 27: { value: "7", suit: "S" }, 28: { value: "8", suit: "S" },
//   29: { value: "9", suit: "S" }, 30: { value: "10", suit: "S" }, 31: { value: "J", suit: "S" }, 32: { value: "Q", suit: "S" },
//   33: { value: "K", suit: "S" },

//   41: { value: "A", suit: "H" }, 42: { value: "2", suit: "H" }, 43: { value: "3", suit: "H" }, 44: { value: "4", suit: "H" },
//   45: { value: "5", suit: "H" }, 46: { value: "6", suit: "H" }, 47: { value: "7", suit: "H" }, 48: { value: "8", suit: "H" },
//   49: { value: "9", suit: "H" }, 50: { value: "10", suit: "H" }, 51: { value: "J", suit: "H" }, 52: { value: "Q", suit: "H" },
//   53: { value: "K", suit: "H" },

//   61: { value: "A", suit: "D" }, 62: { value: "2", suit: "D" }, 63: { value: "3", suit: "D" }, 64: { value: "4", suit: "D" },
//   65: { value: "5", suit: "D" }, 66: { value: "6", suit: "D" }, 67: { value: "7", suit: "D" }, 68: { value: "8", suit: "D" },
//   69: { value: "9", suit: "D" }, 70: { value: "10", suit: "D" }, 71: { value: "J", suit: "D" }, 72: { value: "Q", suit: "D" },
//   73: { value: "K", suit: "D" },
// };

// function getCardValue(part: string): { value: string; suit: string }[] {
//   return part
//     .split(",")
//     .map((card) => card.match(/\d+/))
//     .map((match) => (match ? parseInt(match[0]) : 0))
//     .filter((val) => val > 0)
//     .map((val) => cardMaps[val]);
// }

// function calculateHandValue(cards: number[]): number {
//   return cards.reduce((sum, card) => sum + card, 0) % 10;
// }

// function calculateKAndSuffix(bankerCards: number[], playerCards: number[], bankerPair: boolean, playerPair: boolean): { k: number; suffix: number; result: string } {
//   const playerValue = calculateHandValue(playerCards);
//   const bankerValue = calculateHandValue(bankerCards);

//   let k = 0;
//   let suffix = 0;
//   let result = "";

//   if (isNaturalWin(bankerCards, playerCards)) {
//     k = 10;
//   }

//   const isTie = bankerValue === playerValue;
//   const isBankerWin = bankerValue > playerValue;
//   const isPlayerWin = !isTie && !isBankerWin;
//   const isBothPairs = bankerPair && playerPair;
//   const isTwoCardHands = playerCards.length === 2 && bankerCards.length === 2;

//   if (isTie) {
//     k = isTwoCardHands ? 2 : 1;
//     if (isBothPairs) {
//       suffix = 28;
//       result = "T:both";
//     } else if (bankerPair) {
//       suffix = 12;
//       result = "T:banker";
//     } else if (playerPair) {
//       suffix = 20;
//       result = "T:player";
//     } else {
//       suffix = 4;
//       result = "T:";
//     }
//   } else if (isBankerWin) {
//     k = isTwoCardHands ? 6 : 1;
//     if (isBothPairs) {
//       suffix = 25;
//       result = "B:both";
//     } else if (bankerPair) {
//       suffix = 9;
//       result = "B:banker";
//     } else if (playerPair) {
//       suffix = 17;
//       result = "B:player";
//     } else {
//       suffix = 1;
//       const bankerFirstHandValue = calculateHandValue(bankerCards.slice(0, 2));
//       result = bankerFirstHandValue >= 8 ? "B:natural" : "B:";
//     }
//   } else if (isPlayerWin) {
//     k = isTwoCardHands ? 10 : 1;
//     if (isBothPairs) {
//       suffix = 26;
//       result = "P:both";
//     } else if (bankerPair) {
//       suffix = 10;
//       result = "P:banker";
//     } else if (playerPair) {
//       suffix = 18;
//       result = "P:player";
//     } else {
//       suffix = 2;
//       const playerFirstHandValue = calculateHandValue(playerCards.slice(0, 2));
//       result = playerFirstHandValue >= 8 ? "P:natural" : "P:";
//     }
//   }

//   return { k, suffix, result };
// }

// function extractCardValues(part: { value: string; suit: string }[]): number[] {
//   return part.map(({ value }) =>
//     value === "A"
//       ? 1
//       : ["J", "Q", "K"].includes(value)
//         ? 0
//         : parseInt(value, 10) % 10
//   );
// }

// function parseResultContent(resultContent: string): { bankerCardValues: { value: string; suit: string }[], playerCardValues: { value: string; suit: string }[] } {
//   const [bankerHand, playerHand] = resultContent
//     .split(";")
//     .map((side) => side.split(":")[1]);
//   return {
//     bankerCardValues: getCardValue(bankerHand),
//     playerCardValues: getCardValue(playerHand),
//   };
// }

// function isNaturalWin(bankerCards: number[], playerCards: number[]): boolean {
//   const bankerValue = calculateHandValue(bankerCards);
//   const playerValue = calculateHandValue(playerCards);

//   return (
//     (playerCards.length === 2 && (playerValue === 8 || playerValue === 9)) ||
//     (bankerCards.length === 2 && (bankerValue === 8 || bankerValue === 9))
//   );
// }

// function isPerfectPair(bankerCardValues: { value: string; suit: string }[], playerCardValues: { value: string; suit: string }[]) {
//   return (
//     (bankerCardValues.length === 2 &&
//       playerCardValues.length === 2 &&
//       bankerCardValues[0].value === bankerCardValues[1].value &&
//       bankerCardValues[0].suit === bankerCardValues[1].suit) ||
//     (playerCardValues[0].value === playerCardValues[1].value &&
//       playerCardValues[0].suit === playerCardValues[1].suit)
//   );
// }

// function hasPair(cards: { value: string; suit: string }[], pairType?: "face" | "suit"): boolean {
//   return pairType === "face"
//     ? cards[0].value === cards[1].value
//     : pairType === "suit"
//       ? cards[0].suit === cards[1].suit
//       : cards[0].value === cards[1].value || cards[0].suit === cards[1].suit;
// }

// function isSmallOrBig(cards: number[]): string {
//   const count = cards.length;
//   return count === 4 ? "Small" : count >= 5 && count <= 6 ? "Big" : "Invalid";
// }

// function isSuper6(bankerHandValue: number, playerHandValue: number): boolean {
//   return bankerHandValue > playerHandValue && bankerHandValue === 6;
// }

// function isDragonBonus(bankerCards: number[], playerCards: number[]): string {
//   const bankerValue = calculateHandValue(bankerCards);
//   const playerValue = calculateHandValue(playerCards);
//   const margin = Math.abs(bankerValue - playerValue);
//   let bonusType =
//     bankerValue > playerValue ? "Banker Dragon Bonus" : "Player Dragon Bonus";

//   if (isNaturalWin(bankerCards, playerCards) && margin < 9) {
//     bonusType += " Natural Win";
//   } else if ([9, 8, 7, 6, 5, 4].includes(margin)) {
//     bonusType += ` with ${margin} points`;
//   } else {
//     bonusType = "No Dragon Bonus";
//   }

//   return bonusType;
// }

// function calculateFinalResult(bankerCardValues: { value: string; suit: string }[], playerCardValues: { value: string; suit: string }[]): { result: string; k: number; suffix: number } {
//   // calculate pairs
//   const bankerPair = hasPair(bankerCardValues, "face");
//   const playerPair = hasPair(playerCardValues, "face");
//   const perfectPair = isPerfectPair(bankerCardValues, playerCardValues);
//   const eitherPair = bankerPair || playerPair;

//   // Extract card values
//   const bankerCardValuesNumeric = extractCardValues(bankerCardValues);
//   const playerCardValuesNumeric = extractCardValues(playerCardValues);

//   // Calculate hand values
//   const bankerHandValue = calculateHandValue(bankerCardValuesNumeric);
//   const playerHandValue = calculateHandValue(playerCardValuesNumeric);

//   const super6 = isSuper6(bankerHandValue, playerHandValue);
//   const dragonBonusType = isDragonBonus(
//     bankerCardValuesNumeric,
//     playerCardValuesNumeric
//   );

//   // Determine hand type
//   const smallOrBig = isSmallOrBig([
//     ...bankerCardValuesNumeric,
//     ...playerCardValuesNumeric,
//   ]);

//   // Calculate k and suffix
//   const { k, suffix, result } = calculateKAndSuffix(
//     bankerCardValuesNumeric,
//     playerCardValuesNumeric,
//     bankerPair,
//     playerPair
//   );

//   return {
//     result,
//     k,
//     suffix,
//   };
// }

// function generateBeadArray(
//   resultObjArr: {
//     gameNo: number;
//     gameNoRound: number;
//     result: number;
//     resultContent: string;
//   }[]
// ) {
//   const data: string[] = [];
//   resultObjArr.forEach((item, index) => {
//     const { bankerCardValues, playerCardValues } = parseResultContent(
//       item.resultContent
//     );
//     const { k, suffix, result } = calculateFinalResult(
//       bankerCardValues,
//       playerCardValues
//     );
//     data.push(result + ";" + (k * 32 + suffix));
//   });
//   return data;
// }

// function removeStartTie(data: string[]) {
//   let n = 0;
//   for (let x = 0; x < data.length; x++) {
//     if (!data[x].startsWith("T")) {
//       n = x;
//       break;
//     }
//   }
//   return data.slice(n);
// }

// function generateBigRoadArray(data: string[]) {
//   data = removeStartTie(data);
//   const resp: string[][] = [];
//   let tmp: string[] = [];
//   data.forEach((val, _) => {
//     const result = val.split(";");
//     if (result.length === 2) {
//       const prefix = result[0].split(":")[0];
//       if (tmp.length == 0) {
//         tmp.push(prefix + ";");
//       } else {
//         if (prefix == "T") {
//           tmp[tmp.length - 1] = tmp[tmp.length - 1] + result[0];
//         } else if (tmp[tmp.length - 1].startsWith(prefix)) {
//           tmp.push(prefix + ";");
//         } else {
//           resp.push(tmp);
//           tmp = [];
//           tmp.push(prefix + ";");
//         }
//       }
//     }
//   });
//   if (tmp.length !== 0) {
//     resp.push(tmp);
//   }
//   return resp;
// }

// function generateMatrixArray(data: string[]) {
//   const resp: string[][] = [];
//   let tmp: string[] = [];
//   data.forEach((val, _) => {
//     if (tmp.length == 0) {
//       tmp.push(val);
//     } else {
//       if (tmp[tmp.length - 1] === val) {
//         tmp.push(val);
//       } else {
//         resp.push(tmp);
//         tmp = [];
//         tmp.push(val);
//       }
//     }
//   });
//   if (tmp.length !== 0) {
//     resp.push(tmp);
//   }
//   return resp;
// }

// function toRoadMap(data: string[][]): [string[][], number, number, number] {
//   const col = 6;
//   let x = -1,
//     y = -1;
//   const matrix: string[][] = Array.from({ length: data.length }, () =>
//     Array(col).fill("")
//   );
//   let available = col;
//   data.forEach((row, i) => {
//     available = matrix[i].filter((element) => element.length === 0).length - 1;
//     row.forEach((col, j) => {
//       x = i;
//       y = j;
//       if (j > available) {
//         x = i + (j - available);
//         y = available;
//         if (!matrix[x]) {
//           matrix[x] = Array(col).fill("");
//         }
//       }
//       matrix[x][y] = col;
//     });
//   });
//   return [matrix, x, y, available];
// }

// function generateBigEyeBoyArray(big_road: string[][]) {
//   const isIndexValid = (arr: any[], index: number) => index >= 0 && index < arr.length;
//   const getCount = (arr: string[]) => arr.reduce((acc, obj) => {
//     return acc + (obj.length === 0 ? 1 : 0);
//   }, 0);
//   const arr: string[] = [];

//   big_road.forEach((val, idx) => {
//     if (idx > 0) {
//       val.forEach((ele, idx1) => {
//         if (!(idx === 1 && idx1 === 0) && ele.length !== 0) {
//           if (idx1 === 0) {
//             if (getCount(big_road[idx - 1]) === getCount(big_road[idx - 2])) {
//               arr.push("R");
//             } else {
//               arr.push("B");
//             }
//           } else {
//             if (
//               isIndexValid(big_road[idx - 1], idx1) ===
//               isIndexValid(big_road[idx - 1], idx1 - 1) &&
//               big_road[idx - 1][idx1].split(";")[0] ===
//               big_road[idx - 1][idx1 - 1].split(";")[0]
//             ) {
//               arr.push("R");
//             } else {
//               arr.push("B");
//             }
//           }
//         }
//       });
//     }
//   });
//   console.log(generateMatrixArray(arr));
// }

// function generateSmallRoadArray(big_road: string[][]) {
//   const isIndexValid = (arr: any[], index: number) => index >= 0 && index < arr.length;
//   const getCount = (arr: string[]) => arr.reduce((acc, obj) => {
//     return acc + (obj.length === 0 ? 1 : 0);
//   }, 0);
//   const arr: string[] = [];
//   big_road.forEach((val, idx) => {
//     if (idx > 2) {
//       val.forEach((ele, idx1) => {
//         if (!(idx === 2 && idx1 === 0) && ele.length !== 0) {
//           if (idx1 === 0) {
//             if (getCount(big_road[idx - 1]) === getCount(big_road[idx - 3])) {
//               arr.push("R");
//             } else {
//               arr.push("B");
//             }
//           } else {
//             if (
//               isIndexValid(big_road[idx - 2], idx1) ===
//               isIndexValid(big_road[idx - 2], idx1 - 1) &&
//               big_road[idx - 2][idx1].split(";")[0] ===
//               big_road[idx - 2][idx1 - 1].split(";")[0]
//             ) {
//               arr.push("R");
//             } else {
//               arr.push("B");
//             }
//           }
//         }
//       });
//     }
//   });
//   console.log(generateMatrixArray(arr));
// }

// function generateCockraochRoadArray(big_road: string[][]) {
//   const isIndexValid = (arr: any[], index: number) => index >= 0 && index < arr.length;
//   const getCount = (arr: string[]) => arr.reduce((acc, obj) => {
//     return acc + (obj.length === 0 ? 0 : 1);
//   }, 0);
//   const arr: string[] = [];
//   big_road.forEach((val, idx) => {
//     if (idx > 2) {
//       val.forEach((ele, idx1) => {
//         if (!(idx === 3 && idx1 === 0) && ele.length !== 0) {
//           if (idx1 === 0) {
//             if (getCount(big_road[idx - 1]) === getCount(big_road[idx - 4])) {
//               arr.push("R");
//             } else {
//               arr.push("B");
//             }
//           } else {
//             if (
//               isIndexValid(big_road[idx - 3], idx1) ===
//               isIndexValid(big_road[idx - 3], idx1 - 1) &&
//               big_road[idx - 3][idx1].split(";")[0] ===
//               big_road[idx - 3][idx1 - 1].split(";")[0]
//             ) {
//               arr.push("R");
//             } else {
//               arr.push("B");
//             }
//           }
//         }
//       });
//     }
//   });
//   console.log(generateMatrixArray(arr));
// }
// console.log("Big Eye : ", generateOtherRoad(bigRoadMap, 0, 2));

// function generateOtherRoad(arr: string[][], startPoint: number, diff: number) {
//   const resp: string[] = [];
//   const isIndexValid = (arr: any[], index: number) => index >= 0 && index < arr.length;
//   const getCount = (arr: string[]) => arr.reduce((acc, obj) => {
//     return acc + (obj.length == 0 ? 1 : 0);
//   }, 0);
//   arr.forEach((val, idx) => {
//     if (idx > startPoint) {
//       val.forEach((ele, idx1) => {
//         if (!(idx === diff - 1 && idx1 === 0) && ele.length !== 0) {
//           if (idx1 === 0) {
//             if (getCount(arr[idx - 1]) === getCount(arr[idx - diff])) {
//               resp.push("R");
//             } else {
//               resp.push("B");
//             }
//           } else {
//             const tmpIdx = diff - 1;
//             if (
//               isIndexValid(arr[idx - tmpIdx], idx1) ===
//               isIndexValid(arr[idx - tmpIdx], idx1 - 1) &&
//               arr[idx - tmpIdx][idx1] !== undefined &&
//               arr[idx - tmpIdx][idx1 - 1] !== undefined &&
//               arr[idx - tmpIdx][idx1].split(";")[0] ===
//               arr[idx - tmpIdx][idx1 - 1].split(";")[0]
//             ) {
//               resp.push("R");
//             } else {
//               resp.push("B");
//             }
//           }
//         }
//       });
//     }
//   });
//   return generateMatrixArray(resp);
// }

// interface PreResult {
//   value: string;
//   x?: number;
//   y?: number;
// }

// function getPrediction(big_road: string[][], preResult: string, lastX: number, lastY: number, available: number) {
//   let bigRoad: PreResult = {
//     value: preResult,
//   };
//   const col = 6;
//   const fdata = big_road[lastX][lastY];
//   console.log(fdata);
//   if (fdata.startsWith(preResult)) {
//     if (lastY + 1 > available) {
//       bigRoad.x = lastX + 1;
//       bigRoad.y = lastY;
//     } else {
//       bigRoad.x = lastX;
//       bigRoad.y = lastY + 1;
//     }
//   } else {
//     bigRoad.x = lastX + 1;
//     bigRoad.y = 0;
//   }
//   if (!big_road[bigRoad.x]) {
//     big_road[bigRoad.x] = Array(col).fill("");
//   }
//   big_road[bigRoad.x][bigRoad.y] = preResult;
//   console.log("BigRoad Prediction: ", bigRoad.value);
//   console.log("Big Eye Prediction: ", predictOther(big_road, 0, 2, bigRoad));
//   console.log("Small Road Prediction: ", predictOther(big_road, 2, 3, bigRoad));
//   console.log("Cockroach Road Prediction: ", predictOther(big_road, 2, 4, bigRoad));
// }

// function predictOther(big_road: string[][], startPoint: number, diff: number, pred: PreResult) {
//   const isIndexValid = (arr: any[], index: number) => index >= 0 && index < arr.length;
//   const getCount = (arr: string[]) => arr.reduce((acc, obj) => {
//     return acc + (obj.length == 0 ? 1 : 0);
//   }, 0);
//   if (pred.x && pred.y !== undefined && pred.x > startPoint) {
//     if (!(pred.x === diff - 1 && pred.y === 0) && pred.value.length !== 0) {
//       if (pred.y === 0) {
//         if (
//           getCount(big_road[pred.x - 1]) === getCount(big_road[pred.x - diff])
//         ) {
//           return "R";
//         } else {
//           return "B";
//         }
//       } else {
//         const tmpIdx = diff - 1;
//         if (
//           isIndexValid(big_road[pred.x - tmpIdx], pred.y) ===
//           isIndexValid(big_road[pred.x - tmpIdx], pred.y - 1) &&
//           big_road[pred.x - tmpIdx][pred.y] !== undefined &&
//           big_road[pred.x - tmpIdx][pred.y - 1] !== undefined &&
//           big_road[pred.x - tmpIdx][pred.y].split(";")[0] ===
//           big_road[pred.x - tmpIdx][pred.y - 1].split(";")[0]
//         ) {
//           return "R";
//         } else {
//           return "B";
//         }
//       }
//     }
//   }
//   return "";
// }

// const resultObjArr = [
//   {
//     gameNo: 113886169,
//     gameNoRound: 1,
//     result: 49,
//     resultContent: "b:68,66,24;p:13,53,46",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 2,
//     result: 34,
//     resultContent: "b:61,22,62;p:22,25,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 3,
//     result: 50,
//     resultContent: "b:31,25,49;p:3,63,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 4,
//     result: 33,
//     resultContent: "b:68,7,;p:49,1,23",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 5,
//     result: 41,
//     resultContent: "b:11,71,29;p:44,41,29",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 6,
//     result: 33,
//     resultContent: "b:13,44,;p:3,29,71",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 7,
//     result: 330,
//     resultContent: "b:50,30,;p:29,52,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 8,
//     result: 322,
//     resultContent: "b:24,13,;p:32,9,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 9,
//     result: 34,
//     resultContent: "b:32,3,50;p:50,67,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 10,
//     result: 34,
//     resultContent: "b:10,44,69;p:49,44,2",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 11,
//     result: 34,
//     resultContent: "b:69,41,24;p:6,50,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 12,
//     result: 50,
//     resultContent: "b:2,69,43;p:65,65,28",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 13,
//     result: 193,
//     resultContent: "b:9,70,;p:67,69,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 14,
//     result: 33,
//     resultContent: "b:31,41,65;p:61,49,24",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 15,
//     result: 34,
//     resultContent: "b:25,49,61;p:43,72,5",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 16,
//     result: 34,
//     resultContent: "b:30,66,;p:28,7,62",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 17,
//     result: 33,
//     resultContent: "b:61,24,;p:6,68,30",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 18,
//     result: 193,
//     resultContent: "b:43,66,;p:52,51,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 19,
//     result: 322,
//     resultContent: "b:26,31,;p:65,63,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 20,
//     result: 322,
//     resultContent: "b:53,72,;p:21,67,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 21,
//     result: 42,
//     resultContent: "b:52,12,31;p:5,32,21",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 22,
//     result: 33,
//     resultContent: "b:4,46,44;p:6,64,62",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 23,
//     result: 193,
//     resultContent: "b:44,5,;p:12,27,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 24,
//     result: 322,
//     resultContent: "b:27,13,;p:70,8,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 25,
//     result: 36,
//     resultContent: "b:45,42,;p:42,51,45",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 26,
//     result: 33,
//     resultContent: "b:30,7,;p:45,46,2",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 27,
//     result: 322,
//     resultContent: "b:31,63,;p:53,48,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 28,
//     result: 33,
//     resultContent: "b:27,72,;p:30,51,64",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 29,
//     result: 36,
//     resultContent: "b:33,64,52;p:32,11,24",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 30,
//     result: 34,
//     resultContent: "b:71,66,;p:33,32,68",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 31,
//     result: 33,
//     resultContent: "b:43,31,70;p:5,46,11",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 32,
//     result: 201,
//     resultContent: "b:44,4,;p:67,65,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 33,
//     result: 33,
//     resultContent: "b:61,4,;p:42,68,12",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 34,
//     result: 34,
//     resultContent: "b:32,13,61;p:22,53,31",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 35,
//     result: 50,
//     resultContent: "b:25,8,7;p:45,65,67",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 36,
//     result: 34,
//     resultContent: "b:12,25,;p:21,71,48",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 37,
//     result: 322,
//     resultContent: "b:27,30,;p:23,26,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 38,
//     result: 68,
//     resultContent: "b:3,66,;p:9,33,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 39,
//     result: 34,
//     resultContent: "b:29,25,10;p:67,53,",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 40,
//     result: 33,
//     resultContent: "b:66,61,;p:25,12,28",
//   },
//   {
//     gameNo: 113886169,
//     gameNoRound: 41,
//     result: 33,
//     resultContent: "b:46,73,;p:68,62,11",
//   },
// ];

// resultObjArr.forEach(item => {
//   const { bankerCardValues, playerCardValues } = parseResultContent(item.resultContent);
//   const { k, suffix } = calculateFinalResult(bankerCardValues, playerCardValues);

//   const expectK = (item.result - suffix) / 32
//   console.log(`Result for '${item.resultContent}' expect: { result: ${item.result}, k: ${expectK} } outcome: ${k * 32 + suffix},`);
// })

// const data: string[] = generateBeadArray(resultObjArr);
// const bigroad = generateBigRoadArray(data);
// console.log("Big Road : ", bigroad);

// const [bigRoadMap, lastx, lasty, available] = toRoadMap(bigroad);
// console.log("Big Roadmap : ", bigRoadMap, lastx, lasty);
// console.log("Big Eye : ", generateOtherRoad(bigRoadMap, 0, 2));
// console.log("Small Road", generateOtherRoad(bigRoadMap, 2, 3))
// console.log("Cockroach Road", generateOtherRoad(bigRoadMap, 2, 4))

// getPrediction(bigRoadMap, "B;", lastx, lasty, available);
