import _findLastIndex from 'lodash/findLastIndex';
import _defaultsDeep from 'lodash/defaultsDeep';
import _get from 'lodash/get';
import RoadmapUtilities from './RoadmapUtilities';

interface Options {
  results?: string[];
  rows?: number;
  cols?: number;
}

interface Cell {
  value: string;
  index: number;
  tie_count: number;
}

export default class BigRoad extends RoadmapUtilities {
  results: string[];
  rows: number;
  cols: number;
  previousCoordinates: [number, number];
  previousIdentity: string | null;
  index: number;

  constructor(_options: Options) {
    super();

    /**
     * Define options
     */
    const options: Options = _defaultsDeep(_options, {
      results: [],
      rows: 6,
      cols: 26
    });

    this.results = options.results || [];
    this.rows = options.rows || 6;
    this.cols = options.cols || 26;

    /**
     * Define initial values
     */
    this.previousCoordinates = [0, 0];
    this.previousIdentity = null;
    this.index = 0;

    this.matrix = Array.from({ length: this.rows }, () => {
      return Array.from({ length: this.cols }, () => 0);
    });

    /**
     * Push results
     */
    this.results.forEach(this.push.bind(this));
  }

  private getNextCoordinate(identity: string): [number, number] {
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
      const bottomPosition = _get(this.matrix, [prevRow + 1, prevColumn]);

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

  // push(key: string): void {
  //   const identity = this.identityDictionary[key];

  //   if (!identity) {
  //     console.warn(`${key} is not a valid key.`);
  //     return;
  //   }

  //   const isTie = this.tieIdentities.includes(key);

  //   const [nextRow, nextCol] = this.getNextCoordinate(identity);
  //   const [prevRow, prevCol] = [...this.previousCoordinates];

  //   const prevColValue = _get(this.matrix[prevRow][prevCol], 'value');
  //   const isAnotherTie = isTie && this.tieIdentities.includes(prevColValue);

  //   /**
  //    * If previous col is tie and the current identity
  //    * is also tie
  //    */
  //   if (isAnotherTie) {
  //     (this.matrix[prevRow][prevCol] as Cell).tie_count++;
  //     return;
  //   }

  //   this.previousCoordinates = [nextRow, nextCol];
  //   this.previousIdentity = identity;

  //   this.matrix[nextRow][nextCol] = {
  //     value: key,
  //     index: this.index++,
  //     tie_count: isTie ? 1 : 0
  //   };

  //   if (this.hasFullRow) {
  //     this.matrix = this.truncateFirstColumn();
  //     this.previousCoordinates = [nextRow, nextCol - 1];
  //   }
  // }

  // push(key: string): void {
  //   const identity = this.identityDictionary[key];

  //   if (!identity) {
  //     console.warn(`${key} is not a valid key.`);
  //     return;
  //   }

  //   const isTie = this.tieIdentities.includes(key);

  //   const [nextRow, nextCol] = this.getNextCoordinate(identity);
  //   const [prevRow, prevCol] = [...this.previousCoordinates];

  //   const prevColValue = _get(this.matrix[prevRow][prevCol], 'value');
  //   const isPrevTie = Array.isArray(prevColValue);
  //   const isAnotherTie = isTie && isPrevTie;

  //   /**
  //    * If current key is tie and the previous value is also a tie,
  //    * update the previous coordinate.
  //    */
  //   if (isAnotherTie) {
  //     prevColValue.push(key);
  //     (this.matrix[prevRow][prevCol] as Cell).tie_count++;
  //     return;
  //   }

  //   /**
  //    * If current key is a tie but the previous value is not a tie,
  //    * update the previous coordinate by making the value an array.
  //    */
  //   if (isTie && !isPrevTie) {
  //     this.matrix[prevRow][prevCol] = {
  //       value: [prevColValue, key],
  //       index: this.index,
  //       tie_count: 1
  //     };
  //     return;
  //   }

  //   /**
  //    * If the current key is not a tie but the previous value is a tie,
  //    * add the current key to the previous coordinate's value.
  //    */
  //   if (!isTie && isPrevTie) {
  //     prevColValue.push(key);
  //     return;
  //   }

  //   // Update the coordinates and identity for non-tie cases or new entries
  //   this.previousCoordinates = [nextRow, nextCol];
  //   this.previousIdentity = identity;

  //   this.matrix[nextRow][nextCol] = {
  //     value: [key],
  //     index: this.index++,
  //     tie_count: isTie ? 1 : 0
  //   };
  // }

  push(key: string): void {
    const identity = this.identityDictionary[key];

    if (!identity) {
      console.warn(`${key} is not a valid key.`);
      return;
    }

    const isTie = this.tieIdentities.includes(key);

    const [nextRow, nextCol] = this.getNextCoordinate(identity);
    const [prevRow, prevCol] = [...this.previousCoordinates];

    const prevColValue = _get(this.matrix[prevRow][prevCol], 'value');
    const isPrevTie = Array.isArray(prevColValue);

    /**
     * If current key is a tie and the previous value is also a tie,
     * update the previous coordinate.
     */
    if (isTie && isPrevTie) {
      prevColValue.push(key);
      (this.matrix[prevRow][prevCol] as Cell).tie_count++;
      return;
    }

    /**
     * If current key is a tie but the previous value is not a tie,
     * update the previous coordinate by making the value an array.
     */
    if (isTie && !isPrevTie) {
      this.matrix[prevRow][prevCol] = {
        value: [prevColValue, key],
        index: this.index,
        tie_count: 1
      };
      return;
    }

    /**
     * If the current key is not a tie but the previous value is a tie,
     * add the current key to the previous coordinate's value.
     */
    if (!isTie && isPrevTie) {
      prevColValue.push(key);
      return;
    }

    // For all other cases, move to the next coordinates and update the identity
    this.previousCoordinates = [nextRow, nextCol];
    this.previousIdentity = identity;

    this.matrix[nextRow][nextCol] = {
      value: [key],
      index: this.index++,
      tie_count: isTie ? 1 : 0
    };
  }


}
