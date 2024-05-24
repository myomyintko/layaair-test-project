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
  value: string[];
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

    this.results = _options.results || [];
    this.rows = _options.rows || 6;
    this.cols = _options.cols || 26;

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

  push(key: string): void {

    const identity = this.identityDictionary[key];

    if (!identity) {
      console.warn(`${key} is not a valid key.`);
      return;
    }

    const isTie = this.tieIdentities.includes(key);
    const [nextRow, nextCol] = this.getNextCoordinate(identity);
    const [prevRow, prevCol] = this.previousCoordinates;

    const prevColCell = this.matrix[prevRow][prevCol] as Cell
    const prevColValue = _get(prevColCell, 'value');

    let isPrevTie: boolean = false;
    if (prevColValue) {
      isPrevTie = this.tieIdentities.includes(prevColValue[prevColValue.length - 1]);
    }

    // Handle case where previous is a tie and current is not
    if (!isTie && isPrevTie) {
      if (nextRow !== 0 || nextCol !== 0) {
        this.previousCoordinates = [nextRow, nextCol];
        this.previousIdentity = identity
        this.matrix[nextRow][nextCol] = {
          value: [key],
          index: this.index++,
          tie_count: isTie ? 1 : 0
        };
      } else {
        prevColCell.value.push(key);
        this.previousIdentity = identity
      }
      return
    }

    // Handle case where current is a tie and previous is not
    if (isTie && !isPrevTie) {
      if (prevColCell) {
        prevColCell.value.push(key);
        prevColCell.tie_count++;
      } else {
        this.previousCoordinates = [nextRow, nextCol];
        this.matrix[nextRow][nextCol] = {
          value: [key],
          index: this.index++,
          tie_count: isTie ? 1 : 0
        };
      }
      return;
    }

    // Handle case where current and previous are tie
    if (isTie && isPrevTie) {
      prevColCell.value.push(key);
      prevColCell.tie_count++;
      return;
    }

    // Handle other case
    this.previousCoordinates = [nextRow, nextCol];
    this.previousIdentity = identity;

    this.matrix[nextRow][nextCol] = {
      value: [key],
      index: this.index++,
      tie_count: isTie ? 1 : 0
    };

    if (this.hasFullRow) {
      this.matrix = this.truncateFirstColumn();
      this.previousCoordinates = [nextRow, nextCol - 1];
    }
  }

  pop(): void {
    if (this.index === 0) {
      console.warn("No elements to pop.");
      return;
    }

    const [row, column] = this.previousCoordinates

    let cellData = this.matrix[row][column];

    if (Array.isArray(cellData.value) && cellData.value.length > 1) {
      cellData.value.pop();
      cellData.tie_count--;
      this.previousIdentity = this.identityDictionary[cellData.value[cellData.value.length - 1]];
    } else {
      this.matrix[row][column] = 0;
      this.index--;

      if (this.index > 0) {
        const lastCoordinates = this.getCoordinatesByIndex(this.matrix, this.index - 1);
        if (lastCoordinates) {
          const [lastRow, lastColumn] = lastCoordinates;
          this.previousCoordinates = [lastRow, lastColumn];
          const lastIdentityKey = this.matrix[lastRow][lastColumn].value;
          this.previousIdentity = this.identityDictionary[lastIdentityKey];
        } else {
          this.previousCoordinates = [0, 0];
          this.previousIdentity = null;
        }
      } else {
        this.previousCoordinates = [0, 0];
        this.previousIdentity = null;
      }
    }
  }
}
