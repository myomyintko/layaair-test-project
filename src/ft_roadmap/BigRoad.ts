import RoadmapUtilities from "./RoadmapUtilities";

import { findLastIndex, defaultsDeep, get } from "lodash";

export default class BigRoad extends RoadmapUtilities {
    declare matrix: any;
    declare previousCoordinates: [number, number];
    previousIdentity: any;
    index: number;
    rows: number;
    declare cols: number;
    declare identityDictionary: any;
    
    constructor(_options: { rows: any; cols: any }) {
        super();

        /**
         * Define options
         */
        const options = defaultsDeep(_options, {
            rows: 6,
            cols: 20,
        });

        this.rows = options.rows || 6;
        this.cols = options.cols || 20;

        /**
         * Define initial values
         */
        this.previousCoordinates = [0, 0];
        this.previousIdentity = null;
        this.index = 0;

        this.matrix = Array.from({ length: this.rows }, () => {
            return Array.from({ length: this.cols }, () => 0);
        });
    }

    getNextCoordinate(identity: any) {
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
        const [prevRow, prevCol] = JSON.parse(
            JSON.stringify(this.previousCoordinates),
        );

        const prevColValue = get(this.matrix[prevRow][prevCol], "value");

        this.previousCoordinates = [nextRow, nextCol];
        this.previousIdentity = identity;

        this.matrix[nextRow][nextCol] = {
            value: key,
            index: this.index++,
        };

        if (this.hasFullRow) {
            this.matrix = this.truncateFirstColumn();
            this.previousCoordinates = [nextRow, nextCol - 1];
        }
    }
}
