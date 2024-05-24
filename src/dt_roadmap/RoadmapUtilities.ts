import _get from 'lodash/get';

interface IdentityDictionary {
    [key: string]: 'banker' | 'player' | 'tie';
}

export default class RoadmapUtilities {
    identityDictionary: IdentityDictionary;
    matrix: any[][];
    cols: number;
    previousCoordinates: [number, number];

    constructor() {
        this.identityDictionary = {
            b: 'banker', // banker
            p: 'player', // player
            t: 'tie', // tie
            q: 'banker', // banker banker-pair
            w: 'banker', // banker banker-pair player-pair
            e: 'banker', // banker player-pair
            f: 'player', // player banker-pair
            g: 'player', // player banker-pair player-pair
            h: 'player', // player player-pair
            i: 'tie', // tie banker-pair
            j: 'tie', // tie banker-pair player-pair
            k: 'tie', // tie player-pair
            l: 'banker', // banker
            m: 'banker', // banker banker-pair
            n: 'banker', // banker banker-pair player-pair
            o: 'banker' // banker player-pair
        };

        this.matrix = [];
        this.cols = 0;
        this.previousCoordinates = [0, 0];
    }

    get bankerIdentities(): string[] {
        return Object.entries(this.identityDictionary)
            .filter(([_, value]) => value === 'banker')
            .map(([key]) => key);
    }

    get playerIdentities(): string[] {
        return Object.entries(this.identityDictionary)
            .filter(([_, value]) => value === 'player')
            .map(([key]) => key);
    }

    get tieIdentities(): string[] {
        return Object.entries(this.identityDictionary)
            .filter(([_, value]) => value === 'tie')
            .map(([key]) => key);
    }

    /**
     * Used as utility getter for sub classes
     */
    get hasFullRow(): boolean {
        return this.matrix.some(row => {
            return !!row[this.cols - 1];
        });
    }

    /**
     * Used as utility getter for sub classes
     */
    truncateFirstColumn(): any[][] {
        return this.matrix.map(row => {
            return [...row.slice(1), null];
        });
    }

    get roadmap(): number[][] {
        return this.matrix.map(row => {
            return row.map(col => {
                return col ? col.value : 0;
            });
        });
    }

    /**
     * Used as utility getter for sub classes
     */
    get lastColumn(): any {
        const [prevRow, prevCol] = this.previousCoordinates;
        return this.matrix[prevRow][prevCol] || null;
    }

    getCoordinatesByIndex(matrix: any[][], index: number): [number, number] | false {
        for (let rowIdx = 0; rowIdx < matrix.length; rowIdx++) {
            const row = matrix[rowIdx];

            for (let colIdx = 0; colIdx < row.length; colIdx++) {
                const col = row[colIdx];
                if ((col).index === index) {
                    return [rowIdx, colIdx];
                }
            }
        }

        return false;
    }

    getColumnLength(matrix: any[][], columnIdx: number): number {
        const coordinates: [number, number] = [0, columnIdx];
        const column = matrix[coordinates[0]][coordinates[1]];
        const rootIdentity = this.identityDictionary[column.value.filter((value: string) => value !== "t")[0]];

        /**
         * If initial column is empty, return 0
         */
        if (!column) {
            return 0;
        }

        /**
         * Starting with one which includes the root node
         */
        let traversalCount = 1;
        let lastIndex = column.index;
        let isEnd = false;

        while (!isEnd) {
            /**
             * Check bottom if have the same identity and is the next index
             */
            const bottomCol = _get(matrix, [coordinates[0] + 1, coordinates[1]], {});
            if (
                bottomCol.index === lastIndex + 1 &&
                rootIdentity === this.identityDictionary[bottomCol.value.filter((value: string) => value !== "t")[0]]
            ) {
                lastIndex = bottomCol.index;
                traversalCount++;
                coordinates[0]++;
                continue;
            }

            /**
             * Check right if have the same identity and is the next index
             */
            const rightCol = _get(matrix, [coordinates[0], coordinates[1] + 1], {});
            if (
                rightCol.index === lastIndex + 1 &&
                rootIdentity === this.identityDictionary[rightCol.value.filter((value: string) => value !== "t")[0]]
            ) {
                lastIndex = rightCol.index;
                traversalCount++;
                coordinates[1]++;
                continue;
            }

            isEnd = true;
        }

        return traversalCount;
    }
}
