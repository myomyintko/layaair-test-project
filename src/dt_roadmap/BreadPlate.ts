import _get from 'lodash/get';
import _defaultsDeep from 'lodash/defaultsDeep';
import RoadmapUtilities from './RoadmapUtilities';

interface Options {
  results?: string[];
  rows?: number;
  cols?: number;
}

export default class BreadPlate extends RoadmapUtilities {
  results: string[];
  rows: number;
  cols: number;
  previousCoordinates: [number, number];
  previousIdentity: string | null;
  index: number;
  matrix: any[][];

  constructor(_options: Options) {
    super();

    const options: Options = _defaultsDeep(_options, {
      results: [],
      rows: 6,
      cols: 9
    });

    this.results = options.results || [];
    this.rows = options.rows || 6;
    this.cols = options.cols || 9;

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

  private getNextCoordinates(): [number, number] {
    const [prevRow, prevColumn] = this.previousCoordinates;

    /**
     * If initial data
     */
    if (this.previousIdentity === null) {
      return [0, 0];
    }

    /**
     * Check if the next row is still available
     */
    const initialPosition = _get(this.matrix, [prevRow + 1, prevColumn]);

    if (initialPosition === 0) {
      return [prevRow + 1, prevColumn];
    }

    /**
     * Else, just move to the next column on the first row
     */
    return [0, prevColumn + 1];
  }

  push(key: string): void {
    const identity = this.identityDictionary[key];

    if (!identity) {
      console.warn(`${key} is not a valid key.`);
      return;
    }

    const [row, column] = this.getNextCoordinates();

    this.previousCoordinates = [row, column];
    this.previousIdentity = identity;

    this.matrix[row][column] = {
      value: key,
      index: this.index++
    };

    if (this.hasFullRow) {
      this.matrix = this.truncateFirstColumn();
      this.previousCoordinates = [row, column - 1];
    }
  }
}
