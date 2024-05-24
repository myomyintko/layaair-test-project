import RoadmapUtilities from './RoadmapUtilities';
import BigRoad from './BigRoad';

import _get from 'lodash/get';
import _defaultsDeep from 'lodash/defaultsDeep';
import _findLastIndex from 'lodash/findLastIndex';

interface Options {
    bigRoadMatrix: any[];
    rows: number;
    cols: number;
}

export default class BigEyeBoy extends RoadmapUtilities {
    rows: number;
    cols: number;
    bigRoadMatrix: any[][];
    previousCoordinates: [number, number];
    previousColor: string | null;
    index: number;
    matrix: any[][];

    constructor(_options: Options) {
        super();

        this.rows = _options.rows || 6;
        this.cols = _options.cols || 9;
        this.bigRoadMatrix = _options.bigRoadMatrix || []

        this.traverseBigRoadScheme()
    }

    private reset(): void {
        /**
         * Define initial values
         */
        this.previousCoordinates = [0, 0];
        this.previousColor = null;
        this.index = 0;

        this.matrix = Array.from({ length: this.rows }, () => {
            return Array.from({ length: this.cols }, () => 0);
        });
    }

    traverseBigRoadScheme(): void {
        this.reset();

        /**
         * https://www.livecasinocomparer.com/live-casino-games/live-baccarat/baccarat-roadmaps
         * The Starting point corresponds to cell B2 on the Big Road scorecard.
         * If B2 is empty, the starting point is C1
         */

        const B2: [number, number] = [1, 1];
        const C1: [number, number] = [0, 2];

        const b2HasValue = this.bigRoadMatrix[B2[0]][B2[1]];
        const c1HasValue = this.bigRoadMatrix[C1[0]][C1[1]];

        if (!c1HasValue && !b2HasValue) {
            return;
        }

        let [initialRow, initialCol] = b2HasValue ? B2 : C1;

        while (true) {
            const col = this.bigRoadMatrix[initialRow][initialCol];
            const isFirstRow = initialRow === 0;

            const nextCoordinates = this.getCoordinatesByIndex(this.bigRoadMatrix, col.index + 1);

            /**
             * If first row, check the lengths of previous 2 columns
             */
            if (isFirstRow) {
                /**
                 * Get the column exactly to the right
                 */
                const prevColALength = this.getColumnLength(this.bigRoadMatrix, initialCol - 1);

                /**
                 * Get the 2nd column to the right
                 */
                const prevColBLength = this.getColumnLength(this.bigRoadMatrix, initialCol - 2);

                this.push(prevColALength === prevColBLength ? 'red' : 'blue', {
                    big_road_index: col.index
                });

                if (nextCoordinates) {
                    initialRow = nextCoordinates[0];
                    initialCol = nextCoordinates[1];
                    continue;
                } else {
                    break;
                }
            }

            /**
             * If non first row, check the left col and the upper left column
             */
            const leftColLower = this.bigRoadMatrix[initialRow][initialCol - 1];
            const leftColUpper = this.bigRoadMatrix[initialRow - 1][initialCol - 1];

            let leftColLowerValue, leftColUpperValue
            if (leftColLower) {
                leftColLowerValue = leftColLower.value.filter((value: string) => value !== "t")[0]
            }

            if (leftColUpper) {
                leftColUpperValue = leftColUpper.value.filter((value: string) => value !== "t")[0]
            }

            const leftColLowerIdentity = this.identityDictionary[leftColLowerValue];
            const leftColUpperIdentity = this.identityDictionary[leftColUpperValue];

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

            this.push(isMatch ? 'red' : 'blue', {
                big_road_index: col.index
            });

            if (nextCoordinates) {
                initialRow = nextCoordinates[0];
                initialCol = nextCoordinates[1];
                continue;
            } else {
                break;
            }
        }
    }

    private getNextCoordinates(color: string): [number, number] {
        const [prevRow, prevColumn] = this.previousCoordinates;

        /**
         * If initial data
         */
        if (this.previousColor === null) {
            return [0, 0];
        }

        /**
         * If same identity
         */
        if (this.previousColor === color) {
            const bottomPosition = _get(this.matrix, [prevRow + 1, prevColumn]);

            /**
             * If bottom position is empty
             */
            if (bottomPosition === 0) {
                return [prevRow + 1, prevColumn];
            }

            /**
             * Else, just increment column to the right
             */
            return [prevRow, prevColumn + 1];
        }

        /**
         * Fallback. If not the same identity
         */
        const lastColIdx = _findLastIndex(this.matrix[0], Boolean);
        const initialPosition = _get(this.matrix, [0, lastColIdx]);

        if (initialPosition === 0) {
            return [0, lastColIdx];
        }

        /**
         * Else, just increment column to the right
         */
        return [0, lastColIdx + 1];
    }

    push(color: string, _options: { big_road_index?: number } = {}): void {
        if (!['red', 'blue'].includes(color)) {
            console.warn(`${color} is not a valid color.`);
            return;
        }

        const options = Object.assign({
            big_road_index: undefined
        }, _options);

        const [row, column] = this.getNextCoordinates(color);

        this.previousCoordinates = [row, column];
        this.previousColor = color;

        this.matrix[row][column] = {
            value: color,
            index: this.index++,
            big_road_index: options.big_road_index
        };

        if (this.hasFullRow) {
            this.matrix = this.truncateFirstColumn();
            this.previousCoordinates = [row, column - 1];
        }
    }

    pop(): void {
        if (this.index === 0) {
            console.warn("No elements to pop.");
            return;
        }

        let [row, column] = this.previousCoordinates;
        if (this.index > 0) {
            this.matrix[row][column] = 0;
            this.index--;
            const lastCoordinates = this.getCoordinatesByIndex(this.matrix, this.index - 1);
            if (lastCoordinates) {
                const lastRow = lastCoordinates[0]
                const lastCol = lastCoordinates[1]
                this.previousCoordinates = [lastRow, lastCol]
                this.previousColor = this.matrix[lastRow][lastCol].value;
            }
        } else {
            this.previousCoordinates = [0, 0]
            this.previousColor = null;
        }
    }
}
