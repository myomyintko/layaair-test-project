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

    findValueInMatrix(matrix: any[][], value: number): { rowIndex: number, colIndex: number } | null {
        for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
            const row = matrix[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const col = row[colIndex];
                if (col.index === value) {
                    return { rowIndex, colIndex };
                }
            }
        }
        return null;
    }
}
