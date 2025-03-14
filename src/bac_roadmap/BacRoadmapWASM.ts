const { regClass } = Laya;
import { BacRoadmapWASMBase } from "./BacRoadmapWASM.generated";
import { WasmLoader, BaccaratGame } from "xcore-casino";

interface bacResultImgs {
    [key: number]: string
}

enum BaccaratResult32 {
    PLAYER = 10,
    BANKER = 20,
    TIE = 30,
    SUPER_SIX = 40,
    PLAYER_PAIR = 1,
    BANKER_PAIR = 2,
}

const bacResultBreadPlateImgData: bacResultImgs = {
    // banker
    [BaccaratResult32.BANKER]: "resources/game_icons/type61.png",
    [BaccaratResult32.BANKER + BaccaratResult32.BANKER_PAIR]: "resources/game_icons/type62.png",
    [BaccaratResult32.BANKER + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type63.png",
    [BaccaratResult32.BANKER + BaccaratResult32.BANKER_PAIR + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type64.png",

    // super six
    [BaccaratResult32.SUPER_SIX]: "resources/game_icons/type61.png",
    [BaccaratResult32.SUPER_SIX + BaccaratResult32.BANKER_PAIR]: "resources/game_icons/type62.png",
    [BaccaratResult32.SUPER_SIX + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type63.png",
    [BaccaratResult32.SUPER_SIX + BaccaratResult32.BANKER_PAIR + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type64.png",

    // player
    [BaccaratResult32.PLAYER]: "resources/game_icons/type65.png",
    [BaccaratResult32.PLAYER + BaccaratResult32.BANKER_PAIR]: "resources/game_icons/type66.png",
    [BaccaratResult32.PLAYER + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type67.png",
    [BaccaratResult32.PLAYER + BaccaratResult32.BANKER_PAIR + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type68.png",
    // tie
    [BaccaratResult32.TIE]: "resources/game_icons/type69.png",
    [BaccaratResult32.TIE + BaccaratResult32.BANKER_PAIR]: "resources/game_icons/type70.png",
    [BaccaratResult32.TIE + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type71.png",
    [BaccaratResult32.TIE + BaccaratResult32.BANKER_PAIR + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type72.png",
}

const bacResultBigRoadmImgData: bacResultImgs = {
    // banker
    [BaccaratResult32.BANKER]: "resources/game_icons/type01.png",
    [BaccaratResult32.BANKER + BaccaratResult32.BANKER_PAIR]: "resources/game_icons/type02.png",
    [BaccaratResult32.BANKER + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type03.png",
    [BaccaratResult32.BANKER + BaccaratResult32.BANKER_PAIR + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type04.png",
    [BaccaratResult32.BANKER + BaccaratResult32.TIE]: "resources/game_icons/type05.png",
    [BaccaratResult32.BANKER + BaccaratResult32.TIE + BaccaratResult32.BANKER_PAIR]: "resources/game_icons/type06.png",
    [BaccaratResult32.BANKER + BaccaratResult32.TIE + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type07.png",
    [BaccaratResult32.BANKER + BaccaratResult32.TIE + BaccaratResult32.BANKER_PAIR + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type08.png",

    // player
    [BaccaratResult32.PLAYER]: "resources/game_icons/type09.png",
    [BaccaratResult32.PLAYER + BaccaratResult32.BANKER_PAIR]: "resources/game_icons/type10.png",
    [BaccaratResult32.PLAYER + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type11.png",
    [BaccaratResult32.PLAYER + BaccaratResult32.BANKER_PAIR + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type12.png",
    [BaccaratResult32.PLAYER + BaccaratResult32.TIE]: "resources/game_icons/type13.png",
    [BaccaratResult32.PLAYER + BaccaratResult32.TIE + BaccaratResult32.BANKER_PAIR]: "resources/game_icons/type14.png",
    [BaccaratResult32.PLAYER + BaccaratResult32.TIE + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type15.png",
    [BaccaratResult32.PLAYER + BaccaratResult32.TIE + BaccaratResult32.BANKER_PAIR + BaccaratResult32.PLAYER_PAIR]: "resources/game_icons/type16.png",
}

const bacResultBigEyeBoyImgData: bacResultImgs = {
    1: "resources/game_icons/type85.png",
    2: "resources/game_icons/type86.png",
}

const bacResultSmallRoadImgData: bacResultImgs = {
    1: "resources/game_icons/type81.png",
    2: "resources/game_icons/type82.png",
}

const bacResultCockroachPigImgData: bacResultImgs = {
    1: "resources/game_icons/type83.png",
    2: "resources/game_icons/type84.png",
}


@regClass()
export class BacRoadmapWASM extends BacRoadmapWASMBase {
    private roadmapRows: number = 6
    private breadPlateCols: number = 8
    private bigRoadCols: number = 20
    private bigEyeRoadCols: number = 20
    private threestarRoadCols: number = 10
    private smallRoadCols: number = 20
    private cockroachRoadCols: number = 20
    private isResetting: boolean;
    private baccaratGame: BaccaratGame

    onEnable(): void {
        Laya.loader.load("resources/game_icons.atlas").then((res) => {

            // Init WASM
            WasmLoader.debug = true
            WasmLoader.asyncLoad().then(() => {
                this.baccaratGame = new BaccaratGame()
                this.baccaratGame.info().then(res => {
                    console.log(res)
                })
                this.setupRoadmapUI()
                this.SetHistoryData()
            })
        })
    }

    private setupRoadmapUI(): void {
        // bead plate road
        this.bead_plate_road_panel.scrollType = Laya.ScrollType.Horizontal
        this.bead_plate_road_panel.elasticEnabled = true
        this.bead_plate_road_panel.mouseEnabled = true
        const { width: beadPlateRoadWidth, height: beadPlateRoadHeight } = this.bead_plate_road_panel
        this.bead_plate_road_sprite.size(beadPlateRoadWidth, beadPlateRoadHeight)
        this.setupControl(this.bead_plate_road_panel, this.roadmapRows, this.breadPlateCols)

        // big road
        this.big_road_panel.scrollType = Laya.ScrollType.Horizontal
        this.big_road_panel.elasticEnabled = true
        this.big_road_panel.mouseEnabled = true
        const { width: bigRoadWidth, height: bigRoadHeight } = this.big_road_panel
        this.bead_plate_road_sprite.size(bigRoadWidth, bigRoadHeight)
        this.setupControl(this.big_road_panel, this.roadmapRows, this.bigRoadCols)

        // big eye road
        this.big_eye_road_panel.scrollType = Laya.ScrollType.Horizontal
        this.big_eye_road_panel.elasticEnabled = true
        this.big_eye_road_panel.mouseEnabled = true
        const { width: bigEyeRoadWidth, height: bigEyeRoadHeight } = this.big_eye_road_panel
        this.bead_plate_road_sprite.size(bigEyeRoadWidth, bigEyeRoadHeight)
        this.setupControl(this.big_eye_road_panel, this.roadmapRows, this.bigEyeRoadCols)

        // three star road
        this.thee_star_road_panel.scrollType = Laya.ScrollType.Horizontal
        this.thee_star_road_panel.elasticEnabled = true
        this.thee_star_road_panel.mouseEnabled = true
        const { width: threestarRoadWidth, height: threestarRoadHeight } = this.thee_star_road_panel
        this.bead_plate_road_sprite.size(threestarRoadWidth, threestarRoadHeight)
        this.setupControl(this.thee_star_road_panel, this.roadmapRows, this.cockroachRoadCols)

        // small road
        this.small_road_panel.scrollType = Laya.ScrollType.Horizontal
        this.small_road_panel.elasticEnabled = true
        this.small_road_panel.mouseEnabled = true
        const { width: smallRoadWidth, height: smallRoadHeight } = this.small_road_panel
        this.bead_plate_road_sprite.size(smallRoadWidth, smallRoadHeight)
        this.setupControl(this.small_road_panel, this.roadmapRows, this.smallRoadCols)

        // cockroach road
        this.cockroach_road_panel.scrollType = Laya.ScrollType.Horizontal
        this.cockroach_road_panel.elasticEnabled = true
        this.cockroach_road_panel.mouseEnabled = true
        const { width: cockroachRoadWidth, height: cockroachRoadHeight } = this.cockroach_road_panel
        this.bead_plate_road_sprite.size(cockroachRoadWidth, cockroachRoadHeight)
        this.setupControl(this.cockroach_road_panel, this.roadmapRows, this.cockroachRoadCols)
    }

    private setupControl(roadmapPanel: Laya.Panel, rows: number, cols: number): void {
        const roadmapBox = roadmapPanel.parent as Laya.Box
        const { width, height } = roadmapPanel
        const controlWrapper = new Laya.Box(true);
        controlWrapper.size(width, height)
        controlWrapper.name = "control-container";

        const createControlButton = (iconPath: string): Laya.Box => {
            const icon = new Laya.Image(iconPath);
            icon.alpha = 0.3;
            icon.centerX = 0;
            icon.centerY = 0;
            icon.color = "#000000"

            const container = new Laya.Box(true);
            container.width = roadmapBox.width / 2;
            container.height = roadmapBox.height;
            container.centerY = 0;
            container.addChild(icon);
            return container;
        };

        const cmdWidth = roadmapPanel.width / cols;
        const cmdHeight = roadmapPanel.height / rows;
        const drawWidth = Math.min(cmdHeight, cmdWidth);

        const prevContainer = createControlButton("resources/arrow-leftside.png");
        prevContainer.left = 0
        prevContainer.on(Laya.Event.CLICK, () => {
            roadmapPanel.refresh()
            roadmapPanel.hScrollBar.value -= drawWidth
        })
        const nextContainer = createControlButton("resources/arrow-rightside.png");
        nextContainer.right = 0
        nextContainer.on(Laya.Event.CLICK, () => {
            roadmapPanel.refresh()
            roadmapPanel.hScrollBar.value += drawWidth
        })

        controlWrapper.addChild(prevContainer);
        controlWrapper.addChild(nextContainer);
        roadmapBox.addChild(controlWrapper)
    }

    Reset() {
        // this.SetHistoryData()
        this.bead_plate_road_sprite.graphics.clear()
        this.big_road_sprite.graphics.clear()
        this.big_eye_road_sprite.graphics.clear()
        this.small_road_sprite.graphics.clear()
        this.cockroach_road_sprite.graphics.clear()
        this.thee_star_road_sprite.graphics.clear()
    }

    private extractResult(result: number) {
        if (result >= 1000 && result <= 9999) {
            // Extract main result and convert to enum value (BANKER=20, PLAYER=10, TIE=30)
            const firstDigit = Math.floor(result / 1000);
            let main: number;
            if (firstDigit === 1) {
                main = BaccaratResult32.PLAYER; // Player: 10
            } else if (firstDigit === 2) {
                main = BaccaratResult32.BANKER; // Banker: 20
            } else if (firstDigit === 3) {
                main = BaccaratResult32.TIE; // Tie: 30
            } else if (firstDigit === 4) {
                main = BaccaratResult32.SUPER_SIX // Super Six: 40
            } else {
                main = 0;
            }

            const pair = Math.floor((result % 1000) / 100);
            const tieCount = result % 100;

            return { main, pair, tieCount };
        } else if (result >= 0 && result < 100) {
            // For simpler formats, handle differently
            // Extract first digit to determine main result
            const firstDigit = Math.floor(result / 10);
            let main: number;
            if (firstDigit === 1) {
                main = BaccaratResult32.PLAYER; // Player: 10
            } else if (firstDigit === 2) {
                main = BaccaratResult32.BANKER; // Banker: 20
            } else if (firstDigit === 3) {
                main = BaccaratResult32.TIE; // Tie: 30
            } else if (firstDigit === 4) {
                main = BaccaratResult32.SUPER_SIX // Super Six: 40
            } else {
                main = 0;
            }

            const pair = result % 10;

            return { main, pair, tieCount: 0 };
        }

        return { main: 0, pair: 0, tieCount: 0 };
    }

    SetHistoryData() {
        let testHistoryData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 201))
        console.log(testHistoryData)
        this.baccaratGame.roadmaps(testHistoryData).then(res => {
            if (res.code != 0) {
                throw new Error(res.message)
            }
            console.log(res.data)
            const roadmap = res.data
            this.GetHistoryFragment1(roadmap.history, this.breadPlateCols, this.roadmapRows, this.bead_plate_road_panel, this.SetHistoryItem1.bind(this))
            this.GetHistoryFragment2(roadmap.bigroad, this.bigRoadCols, this.roadmapRows, this.big_road_panel, this.SetHistoryItem2.bind(this))
            this.GetHistoryFragment2(roadmap.bigeyeboy, this.bigEyeRoadCols, this.roadmapRows, this.big_eye_road_panel, this.SetHistoryItem3.bind(this))
            this.GetHistoryFragment2(roadmap.smallroad, this.smallRoadCols, this.roadmapRows, this.small_road_panel, this.SetHistoryItem4.bind(this))
            this.GetHistoryFragment2(roadmap.cockroach, this.cockroachRoadCols, this.roadmapRows, this.cockroach_road_panel, this.SetHistoryItem5.bind(this))
            this.GetHistoryFragment2(roadmap.three_road, this.threestarRoadCols, 3, this.thee_star_road_panel, this.SetHistoryItem2.bind(this))
        })

    }

    SetHistoryItem1(cmd: Laya.DrawImageCmd, result: number, x?: number, y?: number, sprite?: Laya.Sprite) {
        if (!cmd) return;

        try {
            const { main, pair } = this.extractResult(result);
            const imgUrl = bacResultBreadPlateImgData[main + pair];

            if (imgUrl) {
                const texture = Laya.loader.getRes(imgUrl);
                if (texture) {
                    cmd.texture = texture;
                } else {
                    console.warn(`Texture not loaded for ${imgUrl}`);
                }
            }
        } catch (error) {
            console.error("Error in SetHistoryItem1:", error, "Result:", result);
        }
    }

    SetHistoryItem2(cmd: Laya.DrawImageCmd, result: number, x?: number, y?: number, sprite?: Laya.Sprite): void {
        // result eg: 0000, 1: winner, 2: pair, 3,4: tie_count
        if (!cmd) return;

        try {
            const { main, pair, tieCount } = this.extractResult(result);

            // Calculate the key to use for lookup in bacResultBigRoadmImgData
            let lookupKey = main + pair;

            // If tieCount is greater than 0, add the TIE value to the key
            if (tieCount > 0) {
                lookupKey += BaccaratResult32.TIE;

                // Add tie count text to the UI if coordinates and sprite are provided
                if (x !== undefined && y !== undefined && sprite) {
                    this.addTieCountText(sprite, tieCount, x, y, cmd.width);
                }
            }

            const imgUrl = bacResultBigRoadmImgData[lookupKey];
            if (imgUrl) {
                const texture = Laya.loader.getRes(imgUrl);
                if (texture) {
                    cmd.texture = texture;
                } else {
                    console.warn(`Texture not loaded for ${imgUrl} (key: ${lookupKey})`);
                }
            } else {
                console.warn(`No image URL found for key: ${lookupKey} (main: ${main}, pair: ${pair}, tieCount: ${tieCount})`);
            }
        } catch (error) {
            console.error("Error in SetHistoryItem2:", error, "Result:", result);
        }
    }

    // Helper method to add tie count text
    private addTieCountText(sprite: Laya.Sprite, tieCount: number, x: number, y: number, width: number): void {
        if (tieCount <= 0) return;

        const tieText = new Laya.Text();
        tieText.text = tieCount.toString();
        tieText.fontSize = Math.floor(width * 0.7); // Size proportional to the icon
        tieText.color = "#000000";
        tieText.bold = true;
        tieText.stroke = 2;
        tieText.strokeColor = "#ffffff";

        // Calculate the center position of the icon
        const iconCenterX = x + (width / 2);
        const iconCenterY = y + (width / 2);

        // Center the text by setting its pivot point to its center
        tieText.pivotX = tieText.width / 2;
        tieText.pivotY = tieText.height / 2;

        // Position at the center of the icon
        tieText.x = iconCenterX;
        tieText.y = iconCenterY;

        // Add to sprite
        sprite.addChild(tieText);
    }

    GetHistoryFragment1(arr: number[], col: number, row: number, panel: Laya.Panel, callback: (cmd: Laya.DrawImageCmd, result: number, x: number, y: number, sprite: Laya.Sprite) => void, isAsk: boolean = false): void {
        const matrix = [];
        for (let i = 0; i < arr.length; i += row) {
            matrix.push(arr.slice(i, i + row));
        }
        const lastX = matrix.length - 1;
        const lastY = matrix[lastX].length - 1;
        this.fillTexture(matrix, row, col, panel, callback, isAsk, lastX, lastY);
    }

    GetHistoryFragment2(arr: number[][], col: number, row: number, panel: Laya.Panel, callback: (cmd: Laya.DrawImageCmd, result: number, x: number, y: number, sprite: Laya.Sprite) => void, isAsk: boolean = false): void {
        const matrix = Array.from({ length: arr.length }, () => Array(row).fill(0));
        let available = row, x = -1, y = -1;
        arr.forEach((row, i) => {
            available = matrix[i].filter(element => element === 0).length - 1;
            row.forEach((col, j) => {
                x = i;
                y = j;
                if (j > available) {
                    x = i + (j - available);
                    y = available;
                    if (!matrix[x]) { matrix[x] = Array(5).fill(0); }
                }
                matrix[x][y] = col;
            });
        });
        this.fillTexture(matrix, row, col, panel, callback, isAsk, x, y);
    }

    SetHistoryItem3(cmd: Laya.DrawImageCmd, result: number, x?: number, y?: number, sprite?: Laya.Sprite): void {
        if (!cmd) return;

        try {
            const imgUrl = bacResultBigEyeBoyImgData[result];
            if (imgUrl) {
                const texture = Laya.loader.getRes(imgUrl);
                if (texture) {
                    cmd.texture = texture;
                } else {
                    console.warn(`Texture not loaded for ${imgUrl}`);
                }
            }
        } catch (error) {
            console.error("Error in SetHistoryItem3:", error, "Result:", result);
        }
    }

    SetHistoryItem4(cmd: Laya.DrawImageCmd, result: number, x?: number, y?: number, sprite?: Laya.Sprite): void {
        if (!cmd) return;

        try {
            const imgUrl = bacResultSmallRoadImgData[result];
            if (imgUrl) {
                const texture = Laya.loader.getRes(imgUrl);
                if (texture) {
                    cmd.texture = texture;
                } else {
                    console.warn(`Texture not loaded for ${imgUrl}`);
                }
            }
        } catch (error) {
            console.error("Error in SetHistoryItem4:", error, "Result:", result);
        }
    }

    SetHistoryItem5(cmd: Laya.DrawImageCmd, result: number, x?: number, y?: number, sprite?: Laya.Sprite): void {
        if (!cmd) return;

        try {
            const imgUrl = bacResultCockroachPigImgData[result];
            if (imgUrl) {
                const texture = Laya.loader.getRes(imgUrl);
                if (texture) {
                    cmd.texture = texture;
                } else {
                    console.warn(`Texture not loaded for ${imgUrl}`);
                }
            }
        } catch (error) {
            console.error("Error in SetHistoryItem5:", error, "Result:", result);
        }
    }

    private fillTexture(matrix: number[][], row: number, col: number, panel: Laya.Panel, callback: (cmd: Laya.DrawImageCmd, result: number, x: number, y: number, sprite: Laya.Sprite) => void, isAsk: boolean, lastX: number = -1, lastY: number = -1): void {
        try {
            const sprite = panel.getChildAt(0) as Laya.Sprite;
            sprite.graphics.clear();

            // Clear existing tie count text elements
            for (let i = sprite.numChildren - 1; i >= 0; i--) {
                if (sprite.getChildAt(i) instanceof Laya.Text) {
                    sprite.removeChildAt(i);
                }
            }

            const panelParent = panel.parent as Laya.Box;
            const cmdWidth = panelParent.width / col;
            const cmdHeight = panelParent.height / row;
            const drawWidth = Math.min(cmdHeight, cmdWidth);
            let lastCmd: Laya.DrawImageCmd | null = null;
            panel.set_width(cmdWidth * (col - 1));

            matrix.forEach((col: number[], colIndex: number) => {
                col.forEach((cell, cellIndex) => {
                    if (cell) {
                        const cmd = new Laya.DrawImageCmd();
                        cmd.width = drawWidth * 0.8;
                        cmd.height = drawWidth * 0.8;
                        cmd.x = colIndex * cmdWidth + cmdWidth / 2 - (drawWidth / 2.5);
                        cmd.y = cellIndex * cmdHeight + cmdHeight / 2 - (drawWidth / 2.5);
                        callback(cmd, cell, cmd.x, cmd.y, sprite);
                        sprite.graphics.addCmd(cmd);
                        if (colIndex === lastX && cellIndex === lastY) {
                            lastCmd = cmd;
                        }
                    }
                });
            });

            if (lastCmd && isAsk) {
                let isVisible: boolean = true;
                const toggle = () => {
                    if (isVisible) {
                        sprite.graphics.removeCmd(lastCmd);
                    } else {
                        sprite.graphics.addCmd(lastCmd);
                    }
                    isVisible = !isVisible;
                };

                const start = () => {
                    Laya.timer.loop(500, this, toggle);
                    Laya.timer.once(5000, this, stop);
                };

                const stop = () => {
                    Laya.timer.clear(this, toggle);
                    sprite.graphics.removeCmd(lastCmd);
                    if (!this.isResetting) {
                        this.isResetting = true;
                        Laya.timer.once(1000, this, () => {
                            this.isResetting = false;
                        });
                    }
                };

                start();
            }

            sprite.width = matrix.length * cmdWidth;
            Laya.timer.frameOnce(1, this, () => {
                try {
                    panel.refresh();
                    panel.scrollTo((lastX - 4) * cmdWidth);
                } catch (error) {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}