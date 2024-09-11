type bacResultType = "player" | "banker" | "tie"

interface bacResultTypeMap {
    [key: number]: bacResultType
}

export class BacRoadmapUtils {
    private resultTypes: bacResultTypeMap

    constructor() {
        this.resultTypes = {
            1: 'banker', 9: 'banker', 17: 'banker', 25: 'banker', 5: 'banker', 13: 'banker', 21: 'banker', 29: 'banker',
            2: 'player', 10: 'player', 18: 'player', 26: 'player', 6: 'player', 14: 'player', 22: 'player', 30: 'player',
            4: 'tie', 12: 'tie', 20: 'tie', 28: 'tie',
        }
    }

    Number2ResultType(result: number): bacResultType | null {
        return this.resultTypes[result & 31] || null;
    }

    IsValidIndex<T>(array: T[], index: number): boolean {
        return index >= 0 && index < array.length;
    }

    GetColumnLength(array: number[]): number {
        return array.reduce((total, element) => total + (element === 0 ? 1 : 0), 0)
    }

    TraverseBigRoadScheme(bigRoadMatrix: number[][], startIndex: number, margin: number, callback: (result: number) => void): void {
        bigRoadMatrix.forEach((col, colIndex) => {
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
                            const prevColALength = this.GetColumnLength(bigRoadMatrix[colIndex - 1])

                            /**
                             * Get the ${margin} column to the right
                             */
                            const prevColBLength = this.GetColumnLength(bigRoadMatrix[colIndex - margin])
                            callback(prevColALength === prevColBLength ? 1 : 2)
                        } else {
                            /**
                             * If non first row, check the left col and the upper left column
                             */
                            const tempIdx = margin - 1
                            const leftColLowerIndex = this.IsValidIndex(bigRoadMatrix[colIndex - tempIdx], cellIndex)
                            const leftColLowerIdentity = this.Number2ResultType(bigRoadMatrix[colIndex - tempIdx][cellIndex])

                            const leftColUpperIndex = this.IsValidIndex(bigRoadMatrix[colIndex - tempIdx], cellIndex - 1)
                            const leftColUpperIdentity = this.Number2ResultType(bigRoadMatrix[colIndex - tempIdx][cellIndex - 1])

                            const isMatch = [
                                leftColLowerIndex === leftColUpperIndex,
                                leftColLowerIdentity === leftColUpperIdentity
                            ].every(Boolean);
                            callback(isMatch ? 1 : 2)
                        }
                    }
                })
            }
        })
    }
}

export class BacRoadmap extends BacRoadmapUtils {
    results: number[] = [];
    breadplate: BacBreadPlate;
    bigRoad: BacBigRoad;
    bigEyeBoy: BacBigEyeBoy;
    smallRoad: BacSmallRoad;
    cockroachPig: BacCockroachPig;

    constructor(_results: number[] = []) {
        super()
        this.results = _results || []
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
        this.bigRoad.format()

        this.bigEyeBoy.reset()
        this.bigEyeBoy.TraverseBigRoadScheme(this.bigRoad.matrix2, 0, 2, this.bigEyeBoy.push.bind(this.bigEyeBoy))

        this.smallRoad.reset()
        this.smallRoad.TraverseBigRoadScheme(this.bigRoad.matrix2, 2, 3, this.smallRoad.push.bind(this.smallRoad))

        this.cockroachPig.reset()
        this.cockroachPig.TraverseBigRoadScheme(this.bigRoad.matrix2, 2, 4, this.cockroachPig.push.bind(this.cockroachPig))
    }

    pop(): void {
        this.breadplate.pop()
        this.bigRoad.pop()
        this.bigEyeBoy.pop()
        this.smallRoad.pop()
        this.cockroachPig.pop()
    }

    getPrediction(key: number): { bigEyeAsk: number, smallAsk: number, cockroachPigAsk: number } {
        this.push(key);
        const bigEyeAsk = this.bigEyeBoy.previousIdentity;
        const smallAsk = this.smallRoad.previousIdentity;
        const cockroachPigAsk = this.cockroachPig.previousIdentity;
        const result = {
            bigEyeAsk,
            smallAsk,
            cockroachPigAsk
        };
        this.pop();
        return result;
    }
}

export class BacBreadPlate extends BacRoadmapUtils {
    results: number[] = []
    matrix: number[] = []
    matrix2: number[] = []
    previousIdentity: bacResultType | null = null

    constructor(_results: number[] = []) {
        super()
        this.results = _results
        this.results.forEach(this.push.bind(this));
    }

    push(key: number): void {
        const keyStr = key.toString()
        if (keyStr.length >= 4) {
            key = parseInt(keyStr.slice(0, keyStr.length - 2))
        }

        const identity = this.Number2ResultType(key)
        if (!identity) {
            console.warn(`${key} is not a valid key`)
            return
        }
        this.matrix2.push(Number(keyStr))
        this.matrix.push(key)

        this.previousIdentity = identity
    }

    pop() {
        if (this.matrix.length > 0) {
            this.matrix.pop()
            this.previousIdentity = this.Number2ResultType(this.matrix[this.matrix.length - 1])
        } else {
            this.previousIdentity = null
        }
    }
}

export class BacBigRoad extends BacRoadmapUtils {
    results: number[] = []
    previousIdentity: bacResultType | null = null
    matrix: number[][] = []
    matrix2: number[][] = []
    hasTieBeenAdded: boolean = false

    constructor(_results: number[] = []) {
        super()
        this.results = _results
        this.results.forEach(this.push.bind(this));
        this.format()
    }

    format() {
        const col = 6
        let lastX = -1, lastY = -1, avaliableLength = col
        const matrix: number[][] = Array.from({ length: this.matrix.length }, () => Array(col).fill(0))

        this.matrix.forEach((row, rowIndex) => {
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
        console.log(key)
        const keyStr = key.toString()
        if (keyStr.length >= 4) {
            key = parseInt(keyStr.slice(0, keyStr.length - 2))
            console.log('keyStr.length=>4', key)
        }

        const identity = this.Number2ResultType(key);
        if (!identity) {
            console.warn(`${key} is not a valid key`);
            return;
        }

        const lastRowIndex = this.matrix.length - 1;
        const lastRow = this.matrix[lastRowIndex];

        if (identity === "tie") {
            if (this.previousIdentity && this.previousIdentity !== "tie" && !this.hasTieBeenAdded) {
                lastRow[lastRow.length - 1] += 4;
                this.hasTieBeenAdded = true;
            }
        } else if (identity === this.previousIdentity) {
            this.hasTieBeenAdded = false
            lastRow.push(key);
        } else {
            this.hasTieBeenAdded = false
            this.matrix.push([key]);
        }

        // Update the previousIdentity
        if (this.matrix.length > 0 && this.matrix[this.matrix.length - 1].length > 0) {
            this.previousIdentity = this.Number2ResultType(
                this.matrix[this.matrix.length - 1][this.matrix[this.matrix.length - 1].length - 1]
            );
        } else {
            this.previousIdentity = null;
        }
    }

    pop(): void {
        if (this.matrix.length === 0) return;

        const lastRow = this.matrix[this.matrix.length - 1];
        lastRow.pop();

        if (lastRow.length === 0) {
            this.matrix.pop();
        }

        // Update previousIdentity
        if (this.matrix.length > 0 && this.matrix[this.matrix.length - 1].length > 0) {
            const lastRow = this.matrix[this.matrix.length - 1];
            this.previousIdentity = this.Number2ResultType(lastRow[lastRow.length - 1]);
        } else {
            this.previousIdentity = null;
        }
    }
}

export class BacBigEyeBoy extends BacRoadmapUtils {
    matrix: number[][] = []
    previousCoordinates: [number, number] = [-1, -1]
    previousIdentity: number = 0

    constructor(_bigRoadMatrix: number[][] = []) {
        super()
        this.TraverseBigRoadScheme(_bigRoadMatrix, 0, 2, this.push.bind(this))
    }

    reset(): void {
        this.matrix = []
        this.previousCoordinates = [-1, -1]
        this.previousIdentity = 0
    }

    push(key: number): void {
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
            this.previousCoordinates = [-1, -1];
            this.previousIdentity = 0;
        }
    }
}

export class BacSmallRoad extends BacRoadmapUtils {
    previousIdentity: number = 0
    matrix: number[][] = []
    previousCoordinates: [number, number] = [-1, -1]

    constructor(_bigRoadMatrix: number[][] = []) {
        super()
        this.TraverseBigRoadScheme(_bigRoadMatrix, 2, 3, this.push.bind(this))
    }

    reset(): void {
        this.matrix = []
        this.previousCoordinates = [-1, -1]
        this.previousIdentity = 0
    }

    push(key: number): void {
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
            this.previousCoordinates = [-1, -1];
            this.previousIdentity = 0;
        }
    }
}

export class BacCockroachPig extends BacRoadmapUtils {
    previousIdentity: number = 0;
    matrix: number[][] = []
    previousCoordinates: [number, number] = [-1, -1]

    constructor(_bigRoadMatrix: number[][] = []) {
        super()
        this.TraverseBigRoadScheme(_bigRoadMatrix, 2, 4, this.push.bind(this))
    }

    reset(): void {
        this.matrix = []
        this.previousCoordinates = [-1, -1]
        this.previousIdentity = 0
    }

    push(key: number): void {
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
            this.previousCoordinates = [-1, -1];
            this.previousIdentity = 0;
        }
    }
}

// const roadmap = new BacRoadmap(historyData.dataArr1)
// console.log("breadplate:", roadmap.breadplate.matrix)
// console.log("breadplate2:", roadmap.breadplate.matrix2)
// console.log("bigroad:", roadmap.bigRoad.matrix, roadmap.bigRoad.previousIdentity)
// console.log("bigeyeboy:", roadmap.bigEyeBoy.matrix, roadmap.bigEyeBoy.previousCoordinates, roadmap.bigEyeBoy.previousIdentity)
// console.log("smallroad:", roadmap.smallRoad.matrix, roadmap.smallRoad.previousCoordinates, roadmap.smallRoad.previousIdentity)
// console.log("cockroachPig:", roadmap.cockroachPig.matrix, roadmap.cockroachPig.previousCoordinates, roadmap.cockroachPig.previousIdentity)
// console.log("banker:",roadmap.getPrediction(1))
// console.log("player:",roadmap.getPrediction(2))