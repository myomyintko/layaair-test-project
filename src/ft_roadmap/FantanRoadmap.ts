import { findLastIndex, get } from "lodash";

interface IdentityDictionary {
    [key: string]: string;
}

export default class FantanRoadmap {
    results: number[];
    declare matrix: any[][]
    declare previousCoordinates: [number, number]
    previousIdentity: string
    index: number
    rows: number
    declare cols: number
    declare identityDictionary: IdentityDictionary

    constructor(results?: number[], rows?: number, cols?: number) {
        this.identityDictionary = {
            1: "odd",
            2: "even",
            3: "odd",
            4: "even"
        }

        this.results = results || []
        this.rows = rows || 6
        this.cols = cols || 10

        this.previousCoordinates = [0, 0]
        this.previousIdentity = null
        this.index = 0

        this.matrix = Array.from({ length: this.rows }, () => {
            return Array.from({ length: this.cols }, () => 0)
        })

        this.results.forEach(this.push.bind(this))
    }

    private getNextCoordinate(identity: any) {
        const [prevRow, prevColumn] = this.previousCoordinates;

        /**
         * If initial data
         */
        if (this.previousIdentity === null) {
            return [0, 0];
        }

        /**
         * If same identity
         */
        if (this.previousIdentity === identity) {
            const bottomPosition = get(this.matrix, [prevRow + 1, prevColumn]);

            /**
             * Bottom position is empty
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
        const lastColIdx = findLastIndex(this.matrix[0], Boolean);
        const initialPosition = get(this.matrix, [0, lastColIdx]);

        if (initialPosition === 0) {
            return [0, lastColIdx];
        }

        /**
         * Else, just increment column to the right
         */
        return [0, lastColIdx + 1];
    }

    push(key: number) {
        const identity = this.identityDictionary[key];

        if (!identity) {
            return console.warn(`${key} is not a valid key.`);
        }

        const [nextRow, nextCol] = this.getNextCoordinate(identity);

        this.previousCoordinates = [nextRow, nextCol];
        this.previousIdentity = identity;

        this.matrix[nextRow][nextCol] = {
            value: key,
            index: this.index++,
        };
    }
}