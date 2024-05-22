import { defaultsDeep } from "lodash";

import BigRoad from "./BigRoad";

interface ConfigType {
    bigroad: { show_options: boolean; rows: number; cols: number };
}

export default class Roadmap {
    results: number[];
    config: any;
    bigroad: BigRoad;
    
    constructor(_options: { config: ConfigType }) {
        const options = defaultsDeep(_options, {
            results: [],
            config: {
                bigroad: {
                    show_options: false,
                    rows: 6,
                    cols: 100,
                },
            },
        });

        for (const key in options) {
            this[key as keyof this] = options[key];
        }

        this.bigroad = new BigRoad({
            rows: this.config.bigroad.rows,
            cols: this.config.bigroad.cols,
        });
    }

    push(key: number) {
        this.results.push(key);

        this.bigroad.push(key);
    }
}
