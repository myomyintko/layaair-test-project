interface IdentityDictionary {
    [key: string]: string;
}
export default class RoadmapUtilities {
    identityDictionary: IdentityDictionary;
    matrix!: number[][];
    cols!: number;
    previousCoordinates!: [number, number];

    constructor() {
        this.identityDictionary = {
            1: "odd",
            2: "even",
            3: "odd",
            4: "even",
        };
    }

    get oddIdentities() {
        const identities: string[] = [];
        for (const key in this.identityDictionary) {
            if (this.identityDictionary[key] === "odd") {
                identities.push(key);
            }
        }
        return identities;
    }

    get evenIdentities() {
        const identities: string[] = [];
        for (const key in this.identityDictionary) {
            if (this.identityDictionary[key] === "even") {
                identities.push(key);
            }
        }
        return identities;
    }

    /**
     * Used as utility getter for sub classes
     */
    get hasFullRow() {
        return this.matrix.some((row: any[]) => {
            return !!row[this.cols - 1];
        });
    }

    /**
     * Used as utility getter for sub classes
     */
    truncateFirstColumn() {
        const tail = ([, ...t]: any[]) => t;

        return this.matrix.map((row: [any?, ...any[]]) => {
            return [...tail(row), 0];
        });
    }

    get roadmap() {
        return this.matrix.map((row: any[]) => {
            return row.map((col: { value: any }) => {
                return col ? col.value : 0;
            });
        });
    }

    /**
     * Used as utility getter for sub classes
     */
    get lastColumn() {
        const [prevRow, prevCol] = this.previousCoordinates;

        return this.matrix[prevRow][prevCol] || null;
    }
}
