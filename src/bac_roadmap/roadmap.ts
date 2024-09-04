
type resultType = "player" | "banker" | "tie"

interface resultTypeMap {
    [key: number]: resultType
}

class BacRoadmapUtils {
    private resultTypes: resultTypeMap = {
        1: 'banker', 9: 'banker', 17: 'banker', 25: 'banker', 5: 'banker', 13: 'banker', 21: 'banker', 29: 'banker',
        2: 'player', 10: 'player', 18: 'player', 26: 'player', 6: 'player', 14: 'player', 22: 'player', 30: 'player',
        4: 'tie', 12: 'tie', 20: 'tie', 28: 'tie',
    }

    GetResultType(result: number): resultType | null {
        return this.resultTypes[result & 31] || null;
    }

    IsValidIndex<T>(array: T[], index: number): boolean {
        return index >= 0 && index < array.length;
    }

    GetColumnLength(array: number[]): number {
        return array.reduce((total, element) => total + (element === 0 ? 1 : 0), 0)
    }

    ConvertToMatrix(array: number[]): number[][] {
        const matrix: number[][] = []
        let tempArr: number[] = []

        array.forEach((value, _) => {
            if (tempArr.length === 0) {
                tempArr.push(value)
            } else {
                if (tempArr[tempArr.length - 1] === value) {
                    tempArr.push(value)
                } else {
                    matrix.push(tempArr)
                    tempArr = []
                    tempArr.push(value)
                }
            }
        })

        if (tempArr.length > 0) {
            matrix.push(tempArr)
        }

        return matrix
    }

    CustomGet<T, K extends keyof T>(object: T, path: (string | number | symbol)[], defaultValue?: K): K {
        let result: any = object;

        for (let key of path) {
            if (result === undefined || result === null) {
                return defaultValue as K;
            }
            result = result[key];
        }

        return (result === undefined ? defaultValue : result) as K;
    }
}

interface RoadmapOptions {
    results: number[];
}

class BacRoadmap extends BacRoadmapUtils {
    results: number[] = [];
    breadplate: BacBreadPlate;
    bigRoad: BacBigRoad;
    bigEyeBoy: BacBigEyeBoy;
    smallRoad: BacSmallRoad;
    cockroachPig: BacCockroachPig;

    constructor(_options?: RoadmapOptions) {
        super()
        this.results = _options?.results || []
        this.breadplate = new BacBreadPlate(this.results)
        this.bigRoad = new BacBigRoad(this.results)
        this.bigEyeBoy = new BacBigEyeBoy(this.bigRoad.matrix2)
        this.smallRoad = new BacSmallRoad(this.bigRoad.matrix2)
        this.cockroachPig = new BacCockroachPig(this.bigRoad.matrix2)
    }

    push(key: number): void {
        this.results.push(key)
        this.breadplate.push(key)
        this.bigRoad.push(key)

        roadmap.bigRoad.format(roadmap.bigRoad.matrix)

        this.bigEyeBoy.bigRoadMatrix = this.bigRoad.matrix2
        this.bigEyeBoy.traverseBigRoadScheme()

        this.smallRoad.bigRoadMatrix = this.bigRoad.matrix2
        this.smallRoad.traverseBigRoadScheme()

        this.cockroachPig.bigRoadMatrix = this.bigRoad.matrix2
        this.cockroachPig.traverseBigRoadScheme()
    }

    pop(): void {
        this.breadplate.pop()
        this.bigRoad.pop()
        this.bigEyeBoy.pop()
        this.smallRoad.pop()
        this.cockroachPig.pop()
    }

    getPrediction(key: 1 | 2): { bigEyeAsk: number, smallAsk: number, cockroachPigAsk: number } {
        this.push(key)
        const bigEyeAsk = this.bigEyeBoy.previousIdentity
        const smallAsk = this.smallRoad.previousIdentity
        const cockroachPigAsk = this.cockroachPig.previousIdentity
        console.log("bigEyePred:", this.bigEyeBoy.matrix, this.bigEyeBoy.previousCoordinates, this.bigEyeBoy.previousIdentity)
        console.log("smallRoadPred:", this.smallRoad.matrix, this.smallRoad.previousCoordinates, this.smallRoad.previousIdentity)
        console.log("cockroachPred:", this.cockroachPig.matrix, this.cockroachPig.previousCoordinates, this.cockroachPig.previousIdentity)
        this.pop()
        return {
            bigEyeAsk,
            smallAsk,
            cockroachPigAsk
        }
    }
}

class BacBreadPlate extends BacRoadmapUtils {
    results: number[] = []
    matrix: number[] = []

    constructor(_results: number[] = []) {
        super()
        this.results = _results
        this.results.forEach(this.push.bind(this));
    }

    push(key: number): void {
        const identity = this.GetResultType(key)
        if (!identity) {
            console.warn(`${key} is not a valid key`)
            return
        }
        this.matrix.push(key)
    }

    pop() {
        if (this.matrix.length > 0) {
            this.matrix.pop()
        }
    }
}

class BacBigRoad extends BacRoadmapUtils {
    results: number[] = []
    previousIdentity: resultType | null = null
    matrix: number[][] = []
    matrix2: number[][] = []

    constructor(_results: number[] = []) {
        super()
        this.results = _results
        // let startIndex = 0
        // while (startIndex < this.result.length && this.GetResultType(this.result[startIndex]) === "tie") {
        //     startIndex++
        // }

        // if (startIndex > 0) {
        //     this.result = this.result.slice(startIndex)
        //     this.result[0] += 4 // add tie
        // }
        this.results.forEach(this.push.bind(this));
        this.format(this.matrix)
    }

    format(data: number[][]) {
        const col = 6
        let lastX = -1, lastY = -1, avaliableLength = col
        const matrix: number[][] = Array.from({ length: data.length }, () => Array(col).fill(0))

        data.forEach((row, rowIndex) => {
            avaliableLength = matrix[rowIndex].filter(item => !item).length - 1
            row.forEach((col, colIndex) => {
                lastX = rowIndex
                lastY = colIndex
                if (colIndex > avaliableLength) {
                    lastX = rowIndex + (colIndex - avaliableLength)
                    lastY = avaliableLength
                    if (!(matrix[lastX])) {
                        matrix[lastX] = Array(col).fill(0)
                    }
                }
                matrix[lastX][lastY] = col
            })
        })
        this.matrix2 = matrix
    }

    push(key: number): void {
        const identity = this.GetResultType(key);
        if (!identity) {
            console.warn(`${key} is not a valid key`);
            return;
        }

        const lastRowIndex = this.matrix.length - 1;
        const lastRow = this.matrix[lastRowIndex];

        if (this.matrix.length === 0) {
            this.matrix.push([key]);
            this.previousIdentity = identity
        } else if (identity === "tie" && this.previousIdentity !== "tie") {
            lastRow[lastRow.length - 1] += 4;
            this.previousIdentity = this.GetResultType(lastRow[lastRow.length - 1])
        } else if (this.previousIdentity === identity) {
            lastRow.push(key);
            this.previousIdentity = identity
        } else {
            this.matrix.push([key]);
            this.previousIdentity = identity
        }
    }

    pop(): void {
        if (this.matrix.length > 0) {
            const lastRowIndex = this.matrix.length - 1;
            const lastRow = this.matrix[lastRowIndex];

            lastRow.pop();

            if (lastRow.filter(col => col > 0).length === 0) {
                this.matrix.pop();
            }
        }
    }
}

class BacBigEyeBoy extends BacRoadmapUtils {
    bigRoadMatrix: number[][] = []
    matrix: number[][] = []
    previousCoordinates: [number, number] = [0, 0]
    previousIdentity: number = 0

    constructor(_bigRoadMatrix: number[][] = []) {
        super()
        this.bigRoadMatrix = _bigRoadMatrix
        this.traverseBigRoadScheme()
    }

    reset(): void {
        this.matrix = []
        this.previousCoordinates = [0, 0]
        this.previousIdentity = 0
    }

    traverseBigRoadScheme(): void {
        this.reset()
        const startIndex: number = 0
        const margin: number = 2
        this.bigRoadMatrix.forEach((col, colIndex) => {
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
                            const prevColALength = this.GetColumnLength(this.bigRoadMatrix[colIndex - 1])

                            /**
                             * Get the ${margin} column to the right
                             */
                            const prevColBLength = this.GetColumnLength(this.bigRoadMatrix[colIndex - margin])
                            this.push(prevColALength === prevColBLength ? 1 : 2)
                        } else {
                            /**
                             * If non first row, check the left col and the upper left column
                             */
                            const tempIdx = margin - 1
                            const leftColLowerIndex = this.IsValidIndex(this.bigRoadMatrix[colIndex - tempIdx], cellIndex)
                            const leftColLowerIdentity = this.GetResultType(this.bigRoadMatrix[colIndex - tempIdx][cellIndex])

                            const leftColUpperIndex = this.IsValidIndex(this.bigRoadMatrix[colIndex - tempIdx], cellIndex - 1)
                            const leftColUpperIdentity = this.GetResultType(this.bigRoadMatrix[colIndex - tempIdx][cellIndex - 1])

                            const isMatch = [
                                leftColLowerIndex === leftColUpperIndex,
                                leftColLowerIdentity === leftColUpperIdentity
                            ].every(Boolean);
                            this.push(isMatch ? 1 : 2)
                        }
                    }
                })
            }
        })
    }

    push(key: 0 | 1 | 2): void {
        if (![1, 2].includes(key)) {
            console.warn(`${key} is not a valid color.`);
            return;
        }
        if (this.matrix.length <= 0) {
            this.matrix.push([key])
        } else {
            const lastRowIndex = this.matrix.length - 1;
            if (this.previousIdentity === key) {
                this.matrix[lastRowIndex].push(key)
            } else {
                this.matrix.push([key])
            }
        }
        this.previousIdentity = key
        const lastRowIndex = this.matrix.length - 1;
        const lastRow = this.matrix[lastRowIndex];
        const lastColIndex = lastRow.length - 1
        this.previousCoordinates = [lastRowIndex, lastColIndex]
    }

    pop(): void {
        const [prevRow, prevCol] = this.previousCoordinates;
        if (this.matrix[prevRow] && prevCol < this.matrix[prevRow].length) {
            this.matrix[prevRow].splice(prevCol, 1);

            if (this.matrix[prevRow].length === 0) {
                this.matrix.splice(prevRow, 1);
            }
        }

        // Reset previousCoordinates to the new last element
        if (this.matrix.length > 0) {
            const lastRowIndex = this.matrix.length - 1;
            const lastRow = this.matrix[lastRowIndex];
            const lastColIndex = lastRow.length - 1;
            this.previousCoordinates = [lastRowIndex, lastColIndex];
            this.previousIdentity = lastRow[lastColIndex];
        } else {
            // Handle case where the matrix is empty
            this.previousCoordinates = [0, 0];
            this.previousIdentity = 0;
        }
    }

}

class BacSmallRoad extends BacRoadmapUtils {
    bigRoadMatrix: number[][] = []
    previousIdentity: number = 0
    matrix: number[][] = []
    previousCoordinates: [number, number] = [0, 0]

    constructor(_bigRoadMatrix: number[][] = []) {
        super()
        this.bigRoadMatrix = _bigRoadMatrix
        this.traverseBigRoadScheme()
    }

    reset(): void {
        this.matrix = []
        this.previousCoordinates = [0, 0]
        this.previousIdentity = 0
    }

    traverseBigRoadScheme(): void {
        this.reset()
        const startIndex: number = 2
        const margin: number = 3
        this.bigRoadMatrix.forEach((col, colIndex) => {
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
                            const prevColALength = this.GetColumnLength(this.bigRoadMatrix[colIndex - 1])

                            /**
                             * Get the ${margin} column to the right
                             */
                            const prevColBLength = this.GetColumnLength(this.bigRoadMatrix[colIndex - margin])
                            this.push(prevColALength === prevColBLength ? 1 : 2)
                        } else {
                            /**
                             * If non first row, check the left col and the upper left column
                             */
                            const tempIdx = margin - 1
                            const leftColLowerIndex = this.IsValidIndex(this.bigRoadMatrix[colIndex - tempIdx], cellIndex)
                            const leftColUpperIndex = this.IsValidIndex(this.bigRoadMatrix[colIndex - tempIdx], cellIndex - 1)
                            const leftColLowerIdentity = this.GetResultType(this.bigRoadMatrix[colIndex - tempIdx][cellIndex])
                            const leftColUpperIdentity = this.GetResultType(this.bigRoadMatrix[colIndex - tempIdx][cellIndex - 1])

                            const isMatch = [
                                leftColLowerIndex === leftColUpperIndex,
                                leftColLowerIdentity === leftColUpperIdentity
                            ].every(Boolean);
                            this.push(isMatch ? 1 : 2)
                        }
                    }
                })
            }
        })
    }

    private push(key: 0 | 1 | 2): void {
        if (![1, 2].includes(key)) {
            console.warn(`${key} is not a valid color.`);
            return;
        }
        if (this.matrix.length <= 0) {
            this.matrix.push([key])
        } else {
            const lastRowIndex = this.matrix.length - 1;
            if (this.previousIdentity === key) {
                this.matrix[lastRowIndex].push(key)
            } else {
                this.matrix.push([key])
            }
        }
        this.previousIdentity = key
        const lastRowIndex = this.matrix.length - 1;
        const lastRow = this.matrix[lastRowIndex];
        const lastColIndex = lastRow.length - 1
        this.previousCoordinates = [lastRowIndex, lastColIndex]
    }

    pop(): void {
        const [prevRow, prevCol] = this.previousCoordinates;
        if (this.matrix[prevRow] && prevCol < this.matrix[prevRow].length) {
            this.matrix[prevRow].splice(prevCol, 1);

            if (this.matrix[prevRow].length === 0) {
                this.matrix.splice(prevRow, 1);
            }
        }

        // Reset previousCoordinates to the new last element
        if (this.matrix.length > 0) {
            const lastRowIndex = this.matrix.length - 1;
            const lastRow = this.matrix[lastRowIndex];
            const lastColIndex = lastRow.length - 1;
            this.previousCoordinates = [lastRowIndex, lastColIndex];
            this.previousIdentity = lastRow[lastColIndex];
        } else {
            // Handle case where the matrix is empty
            this.previousCoordinates = [0, 0];
            this.previousIdentity = 0;
        }
    }
}

class BacCockroachPig extends BacRoadmapUtils {
    bigRoadMatrix: number[][] = []
    previousIdentity: number = 0;
    matrix: number[][] = []
    previousCoordinates: [number, number] = [0, 0]

    constructor(_bigRoadMatrix: number[][] = []) {
        super()
        this.bigRoadMatrix = _bigRoadMatrix
        this.traverseBigRoadScheme()
    }

    reset(): void {
        this.matrix = []
        this.previousCoordinates = [0, 0]
        this.previousIdentity = 0
    }

    traverseBigRoadScheme(): void {
        this.reset()
        const startIndex: number = 2
        const margin: number = 4
        this.bigRoadMatrix.forEach((col, colIndex) => {
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
                            const prevColALength = this.GetColumnLength(this.bigRoadMatrix[colIndex - 1])

                            /**
                             * Get the ${margin} column to the right
                             */
                            const prevColBLength = this.GetColumnLength(this.bigRoadMatrix[colIndex - margin])
                            this.push(prevColALength === prevColBLength ? 1 : 2)
                        } else {
                            /**
                             * If non first row, check the left col and the upper left column
                             */
                            const tempIdx = margin - 1
                            const leftColLowerIndex = this.IsValidIndex(this.bigRoadMatrix[colIndex - tempIdx], cellIndex)
                            const leftColUpperIndex = this.IsValidIndex(this.bigRoadMatrix[colIndex - tempIdx], cellIndex - 1)
                            const leftColLowerIdentity = this.GetResultType(this.bigRoadMatrix[colIndex - tempIdx][cellIndex])
                            const leftColUpperIdentity = this.GetResultType(this.bigRoadMatrix[colIndex - tempIdx][cellIndex - 1])

                            const isMatch = [
                                leftColLowerIndex === leftColUpperIndex,
                                leftColLowerIdentity === leftColUpperIdentity
                            ].every(Boolean);
                            this.push(isMatch ? 1 : 2)
                        }
                    }
                })
            }
        })
    }

    private push(key: 0 | 1 | 2): void {
        if (![1, 2].includes(key)) {
            console.warn(`${key} is not a valid color.`);
            return;
        }
        if (this.matrix.length <= 0) {
            this.matrix.push([key])
        } else {
            const lastRowIndex = this.matrix.length - 1;
            if (this.previousIdentity === key) {
                this.matrix[lastRowIndex].push(key)
            } else {
                this.matrix.push([key])
            }
        }
        this.previousIdentity = key
        const lastRowIndex = this.matrix.length - 1;
        const lastRow = this.matrix[lastRowIndex];
        const lastColIndex = lastRow.length - 1
        this.previousCoordinates = [lastRowIndex, lastColIndex]
    }

    pop(): void {
        const [prevRow, prevCol] = this.previousCoordinates;
        if (this.matrix[prevRow] && prevCol < this.matrix[prevRow].length) {
            this.matrix[prevRow].splice(prevCol, 1);

            if (this.matrix[prevRow].length === 0) {
                this.matrix.splice(prevRow, 1);
            }
        }

        // Reset previousCoordinates to the new last element
        if (this.matrix.length > 0) {
            const lastRowIndex = this.matrix.length - 1;
            const lastRow = this.matrix[lastRowIndex];
            const lastColIndex = lastRow.length - 1;
            this.previousCoordinates = [lastRowIndex, lastColIndex];
            this.previousIdentity = lastRow[lastColIndex];
        } else {
            // Handle case where the matrix is empty
            this.previousCoordinates = [0, 0];
            this.previousIdentity = 0;
        }
    }
}

const testData = [
    41,
    33,
    42,
    193,
    34,
    33,
    33,
    322,
    33,
    34,
    42,
    36,
    34,
    322,
    33,
    201,
    68,
    193,
    34,
    34,
    33,
    34,
    34,
    338,
    33
]
const roadmap = new BacRoadmap({ results: testData })
console.log("breadplate:", roadmap.breadplate.matrix)
console.log("bigroad:", roadmap.bigRoad.matrix, roadmap.bigRoad.previousIdentity)
console.log("bigroad2:", roadmap.bigRoad.matrix2, roadmap.bigRoad.previousIdentity)
console.log("bigeyeboy:", roadmap.bigEyeBoy.matrix, roadmap.bigEyeBoy.previousCoordinates, roadmap.bigEyeBoy.previousIdentity)
console.log("smallroad:", roadmap.smallRoad.matrix, roadmap.smallRoad.previousCoordinates, roadmap.smallRoad.previousIdentity)
console.log("cockroachPig:", roadmap.cockroachPig.matrix, roadmap.cockroachPig.previousCoordinates, roadmap.cockroachPig.previousIdentity)
console.log(roadmap.getPrediction(2))