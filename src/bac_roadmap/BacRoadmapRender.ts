const { regClass } = Laya;
import { BacRoadmapRenderBase } from "./BacRoadmapRender.generated";
import * as historyData from "./ds.json"

interface bacResultImgs {
    bacData1ResultDom1: string
    bacData1ResultDom9: string
    bacData1ResultDom17: string
    bacData1ResultDom25: string
    bacData1ResultDom2: string
    bacData1ResultDom10: string
    bacData1ResultDom18: string
    bacData1ResultDom26: string
    bacData1ResultDom4: string
    bacData1ResultDom12: string
    bacData1ResultDom20: string
    bacData1ResultDom28: string

    bacData2ResultDom1: string
    bacData2ResultDom9: string
    bacData2ResultDom17: string
    bacData2ResultDom25: string
    bacData2ResultDom5: string
    bacData2ResultDom13: string
    bacData2ResultDom21: string
    bacData2ResultDom29: string
    bacData2ResultDom2: string
    bacData2ResultDom10: string
    bacData2ResultDom18: string
    bacData2ResultDom26: string
    bacData2ResultDom6: string
    bacData2ResultDom14: string
    bacData2ResultDom22: string
    bacData2ResultDom30: string

    bacData3ResultDom1: string
    bacData3ResultDom2: string

    bacData4ResultDom1: string
    bacData4ResultDom2: string

    bacData5ResultDom1: string
    bacData5ResultDom2: string
}

const bacResultImgData: bacResultImgs = {
    // banker
    bacData1ResultDom1: "resources/game_icons/type61.png",
    bacData1ResultDom9: "resources/game_icons/type62.png",
    bacData1ResultDom17: "resources/game_icons/type63.png",
    bacData1ResultDom25: "resources/game_icons/type64.png",
    // player
    bacData1ResultDom2: "resources/game_icons/type65.png",
    bacData1ResultDom10: "resources/game_icons/type66.png",
    bacData1ResultDom18: "resources/game_icons/type67.png",
    bacData1ResultDom26: "resources/game_icons/type68.png",
    // tie
    bacData1ResultDom4: "resources/game_icons/type69.png",
    bacData1ResultDom12: "resources/game_icons/type70.png",
    bacData1ResultDom20: "resources/game_icons/type71.png",
    bacData1ResultDom28: "resources/game_icons/type72.png",

    // banker
    bacData2ResultDom1: "resources/game_icons/type01.png",
    bacData2ResultDom9: "resources/game_icons/type02.png",
    bacData2ResultDom17: "resources/game_icons/type03.png",
    bacData2ResultDom25: "resources/game_icons/type04.png",
    bacData2ResultDom5: "resources/game_icons/type05.png",
    bacData2ResultDom13: "resources/game_icons/type06.png",
    bacData2ResultDom21: "resources/game_icons/type07.png",
    bacData2ResultDom29: "resources/game_icons/type08.png",

    // player
    bacData2ResultDom2: "resources/game_icons/type09.png",
    bacData2ResultDom10: "resources/game_icons/type10.png",
    bacData2ResultDom18: "resources/game_icons/type11.png",
    bacData2ResultDom26: "resources/game_icons/type12.png",
    bacData2ResultDom6: "resources/game_icons/type13.png",
    bacData2ResultDom14: "resources/game_icons/type14.png",
    bacData2ResultDom22: "resources/game_icons/type15.png",
    bacData2ResultDom30: "resources/game_icons/type16.png",

    bacData3ResultDom1: "resources/game_icons/type85.png",
    bacData3ResultDom2: "resources/game_icons/type86.png",

    bacData4ResultDom1: "resources/game_icons/type81.png",
    bacData4ResultDom2: "resources/game_icons/type82.png",

    bacData5ResultDom1: "resources/game_icons/type83.png",
    bacData5ResultDom2: "resources/game_icons/type84.png",
}

const basePathMap: { [key: number]: string } = {
    1: "cr1",
    9: "cr11",
    17: "cr6",
    25: "cr16",

    2: "cr2",
    10: "cr12",
    18: "cr7",
    26: "cr17",

    4: "cr3",
    12: "cr13",
    20: "cr8",
    28: "cr18"
};

const bacResult6ImgData = (result: number, point: number) => {
    const basePath = basePathMap[result];
    return basePath ? `resources/game_icons/${basePath}_${point}.png` : undefined;
}

@regClass()
export class BacRoadmapRender extends BacRoadmapRenderBase {
    private defaultUI: "icon" | "point" = "icon"
    private currentUI = this.defaultUI
    private roadmapRows: number = 6
    private breadPlateCols: number = 6
    private bigRoadCols: number = 16
    private bigEyeRoadCols: number = 20
    private smallRoadCols: number = 10
    private cockroachRoadCols: number = 10
    private isResetting: boolean = false

    onEnable(): void {
        Laya.loader.load("resources/game_icons.atlas").then((res) => {
            this.setupRoadmapUI()
            this.SetHistoryData()
            this.setWenluData()
            this.switchBtn.clickHandler = new Laya.Handler(this, () => {
                this.currentUI = this.currentUI === "icon" ? "point" : "icon"
                if (this.currentUI === "point") {
                    this.GetHistoryFragment1(historyData.dataArr6, this.breadPlateCols, this.roadmapRows, this.bead_plate_road_panel, this.SetHistoryItem6)
                } else if (this.currentUI === "icon") {
                    this.GetHistoryFragment1(historyData.dataArr1, this.breadPlateCols, this.roadmapRows, this.bead_plate_road_panel, this.SetHistoryItem1)
                }
            })
        })
    }

    Reset() {
        this.SetHistoryData()
    }

    SetHistoryData() {
        if (this.currentUI === "icon") {
            this.GetHistoryFragment1(historyData.dataArr1, this.breadPlateCols, this.roadmapRows, this.bead_plate_road_panel, this.SetHistoryItem1)
        } else if (this.currentUI === "point") {
            this.GetHistoryFragment1(historyData.dataArr6, this.breadPlateCols, this.roadmapRows, this.bead_plate_road_panel, this.SetHistoryItem6)
        }
        this.GetHistoryFragment2(historyData.dataArr2, this.bigRoadCols, this.roadmapRows, this.big_road_panel, this.SetHistoryItem2)
        this.GetHistoryFragment2(historyData.dataArr3, this.bigEyeRoadCols, this.roadmapRows, this.big_eye_road_panel, this.SetHistoryItem3)
        this.GetHistoryFragment2(historyData.dataArr4, this.smallRoadCols, this.roadmapRows, this.small_road_panel, this.SetHistoryItem4)
        this.GetHistoryFragment2(historyData.dataArr5, this.cockroachRoadCols, this.roadmapRows, this.cockroach_road_panel, this.SetHistoryItem5)
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

    private AddOneResultToArr2(arr: any, ask: number) {
        arr = arr.slice();
        if (0 != ask)
            if (0 == arr.length) arr.push([ask]);
            else {
                var c = arr[arr.length - 1];
                0 != (c[c.length - 1] & ask)
                    ? ((c = c.slice()), c.push(ask), (arr[arr.length - 1] = c))
                    : arr.push([ask]);
            }
        return arr;
    }

    private setWenluData(): void {
        const wenluXianRoadBox = this.wenlu_Xian.getChildByName("road_box") as Laya.Box
        wenluXianRoadBox.on(Laya.Event.CLICK, this, () => {
            Laya.timer.clearAll(this)
            const dataArr1PlayerAsk = historyData.dataArr1.slice()
            dataArr1PlayerAsk.push(2)
            const dataArr2PlayerAsk = this.AddOneResultToArr2(historyData.dataArr2, 2)
            const dataArr3PlayerAsk = this.AddOneResultToArr2(historyData.dataArr3, historyData.playerAsk3)
            const dataArr4PlayerAsk = this.AddOneResultToArr2(historyData.dataArr4, historyData.playerAsk4)
            const dataArr5PlayerAsk = this.AddOneResultToArr2(historyData.dataArr5, historyData.playerAsk5)
            const dataArr6PlayerAsk = historyData.dataArr6.slice()
            dataArr6PlayerAsk.push(2e2)

            if (this.currentUI === "icon") {
                this.GetHistoryFragment1(dataArr1PlayerAsk, this.breadPlateCols, this.roadmapRows, this.bead_plate_road_panel, this.SetHistoryItem1, true)
            } else if (this.currentUI === "point") {
                this.GetHistoryFragment1(dataArr6PlayerAsk, this.breadPlateCols, this.roadmapRows, this.bead_plate_road_panel, this.SetHistoryItem6, true)
            }
            this.GetHistoryFragment2(dataArr2PlayerAsk, this.bigRoadCols, this.roadmapRows, this.big_road_panel, this.SetHistoryItem2, true)
            this.GetHistoryFragment2(dataArr3PlayerAsk, this.bigEyeRoadCols, this.roadmapRows, this.big_eye_road_panel, this.SetHistoryItem3, true)
            this.GetHistoryFragment2(dataArr4PlayerAsk, this.smallRoadCols, this.roadmapRows, this.small_road_panel, this.SetHistoryItem4, true)
            this.GetHistoryFragment2(dataArr5PlayerAsk, this.cockroachRoadCols, this.roadmapRows, this.cockroach_road_panel, this.SetHistoryItem5, true)
        })

        const playerAsk3 = wenluXianRoadBox.getChildByName("wenlu3") as Laya.Image
        playerAsk3.skin = historyData.playerAsk3 === 1 ? "resources/game_icons/type85.png" : "resources/game_icons/type86.png"
        const playerAsk4 = wenluXianRoadBox.getChildByName("wenlu4") as Laya.Image
        playerAsk4.skin = historyData.playerAsk4 === 1 ? "resources/game_icons/type81.png" : "resources/game_icons/type82.png"
        const playerAsk5 = wenluXianRoadBox.getChildByName("wenlu5") as Laya.Image
        playerAsk5.skin = historyData.playerAsk5 === 1 ? "resources/game_icons/type83.png" : "resources/game_icons/type84.png"

        const wenluZhuangRoadBox = this.wenlu_Zhuang.getChildByName("road_box") as Laya.Box
        wenluZhuangRoadBox.on(Laya.Event.CLICK, this, () => {
            Laya.timer.clearAll(this)

            const dataArr1BankerAsk = historyData.dataArr1.slice()
            dataArr1BankerAsk.push(1)
            const dataArr2BankerAsk = this.AddOneResultToArr2(historyData.dataArr2, 1)
            const dataArr3BankerAsk = this.AddOneResultToArr2(historyData.dataArr3, historyData.bankerAsk3)
            const dataArr4BankerAsk = this.AddOneResultToArr2(historyData.dataArr4, historyData.bankerAsk4)
            const dataArr5BankerAsk = this.AddOneResultToArr2(historyData.dataArr5, historyData.bankerAsk5)
            const dataArr6BankerAsk = historyData.dataArr6.slice()
            dataArr6BankerAsk.push(1e2)

            if (this.currentUI === "icon") {
                this.GetHistoryFragment1(dataArr1BankerAsk, this.breadPlateCols, this.roadmapRows, this.bead_plate_road_panel, this.SetHistoryItem1, true)
            } else if (this.currentUI === "point") {
                this.GetHistoryFragment1(dataArr6BankerAsk, this.breadPlateCols, this.roadmapRows, this.bead_plate_road_panel, this.SetHistoryItem6, true)
            }
            this.GetHistoryFragment2(dataArr2BankerAsk, this.bigRoadCols, this.roadmapRows, this.big_road_panel, this.SetHistoryItem2, true)
            this.GetHistoryFragment2(dataArr3BankerAsk, this.bigEyeRoadCols, this.roadmapRows, this.big_eye_road_panel, this.SetHistoryItem3, true)
            this.GetHistoryFragment2(dataArr4BankerAsk, this.smallRoadCols, this.roadmapRows, this.small_road_panel, this.SetHistoryItem4, true)
            this.GetHistoryFragment2(dataArr5BankerAsk, this.cockroachRoadCols, this.roadmapRows, this.cockroach_road_panel, this.SetHistoryItem5, true)
        })

        const bankerAsk3 = wenluZhuangRoadBox.getChildByName("wenlu3") as Laya.Image
        bankerAsk3.skin = historyData.bankerAsk3 === 1 ? "resources/game_icons/type85.png" : "resources/game_icons/type86.png"
        const bankerAsk4 = wenluZhuangRoadBox.getChildByName("wenlu4") as Laya.Image
        bankerAsk4.skin = historyData.bankerAsk4 === 1 ? "resources/game_icons/type81.png" : "resources/game_icons/type82.png"
        const bankerAsk5 = wenluZhuangRoadBox.getChildByName("wenlu5") as Laya.Image
        bankerAsk5.skin = historyData.bankerAsk5 === 1 ? "resources/game_icons/type83.png" : "resources/game_icons/type84.png"
    }

    SetHistoryItem1(cmd: Laya.DrawImageCmd, result: number) {
        if (cmd) {
            const imgUrl = bacResultImgData["bacData1ResultDom" + (result & 31) as keyof bacResultImgs]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    SetHistoryItem2(cmd: Laya.DrawImageCmd, result: number): void {
        if (cmd) {
            const imgUrl = bacResultImgData["bacData2ResultDom" + (result & 31) as keyof bacResultImgs]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    SetHistoryItem3(cmd: Laya.DrawImageCmd, result: number): void {
        if (cmd) {
            const imgUrl = bacResultImgData["bacData3ResultDom" + (result & 3) as keyof bacResultImgs]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    SetHistoryItem4(cmd: Laya.DrawImageCmd, result: number): void {
        if (cmd) {
            const imgUrl = bacResultImgData["bacData4ResultDom" + (result & 3) as keyof bacResultImgs]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    SetHistoryItem5(cmd: Laya.DrawImageCmd, result: number): void {
        if (cmd) {
            const imgUrl = bacResultImgData["bacData5ResultDom" + (result & 3) as keyof bacResultImgs]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    SetHistoryItem6(cmd: Laya.DrawImageCmd, result: number): void {
        if (cmd) {
            const resultStr = result.toString()
            const g = parseInt(resultStr.slice(0, resultStr.length - 2)) & 31
            if ([1e2, 2e2].includes(result)) {
                const imgUrl = bacResultImgData["bacData1ResultDom" + (g & 31) as keyof bacResultImgs]
                if (imgUrl) {
                    cmd.texture = Laya.loader.getRes(imgUrl)
                }
                return
            }
            let imgUrl: string
            switch (g) {
                case 1:
                case 9:
                case 17:
                case 25:
                    imgUrl = bacResult6ImgData(g, parseInt(resultStr.slice(-1)))
                    break;
                default:
                    imgUrl = bacResult6ImgData(g, parseInt(resultStr.slice(-2, -1)))
                    break
            }
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    GetHistoryFragment1(arr: number[], col: number, row: number, panel: Laya.Panel, callback: (cmd: Laya.DrawImageCmd, result: number) => void, isAsk: boolean = false): void {
        const matrix = [];
        for (let i = 0; i < arr.length; i += row) {
            matrix.push(arr.slice(i, i + row));
        }
        const lastX = matrix.length - 1;
        const lastY = matrix[lastX].length - 1
        this.fillTexture(matrix, row, col, panel, callback, isAsk, lastX, lastY)
    }

    GetHistoryFragment2(arr: number[][], col: number, row: number, panel: Laya.Panel, callback: (cmd: Laya.DrawImageCmd, result: number) => void, isAsk: boolean = false): void {
        const matrix = Array.from({ length: arr.length }, () => Array(row).fill(0));
        let available = row, x = -1, y = -1
        arr.forEach((row, i) => {
            available = matrix[i].filter(element => element === 0).length - 1
            row.forEach((col, j) => {
                x = i
                y = j
                if (j > available) {
                    x = i + (j - available)
                    y = available
                    if (!matrix[x]) { matrix[x] = Array(5).fill(0) }
                }
                matrix[x][y] = col
            })
        })
        this.fillTexture(matrix, row, col, panel, callback, isAsk, x, y)
    }

    private fillTexture(matrix: number[][], row: number, col: number, panel: Laya.Panel, callback: (cmd: Laya.DrawImageCmd, result: number) => void, isAsk: boolean, lastX: number = -1, lastY: number = -1): void {
        try {
            const sprite = panel.getChildAt(0) as Laya.Sprite;
            sprite.graphics.clear();

            const panelParent = panel.parent as Laya.Box
            const cmdWidth = panelParent.width / col;
            const cmdHeight = panelParent.height / row;
            const drawWidth = Math.min(cmdHeight, cmdWidth);
            let lastCmd: Laya.DrawImageCmd | null = null;
            panel.set_width(cmdWidth * (col - 1))

            matrix.forEach((col: number[], colIndex: number) => {
                col.forEach((cell, cellIndex) => {
                    if (cell) {
                        const cmd = new Laya.DrawImageCmd();
                        cmd.width = drawWidth * 0.8;
                        cmd.height = drawWidth * 0.8;
                        cmd.x = colIndex * cmdWidth + cmdWidth / 2 - (drawWidth / 2.5);
                        cmd.y = cellIndex * cmdHeight + cmdHeight / 2 - (drawWidth / 2.5);
                        callback(cmd, cell);
                        sprite.graphics.addCmd(cmd);
                        if (colIndex === lastX && cellIndex === lastY) {
                            lastCmd = cmd
                        }
                    }
                });
            });

            if (lastCmd && isAsk) {
                let isVisible: boolean = true;
                const toggle = () => {
                    if (isVisible) {
                        sprite.graphics.removeCmd(lastCmd)
                    } else {
                        sprite.graphics.addCmd(lastCmd)
                    }
                    isVisible = !isVisible
                }

                const start = () => {
                    Laya.timer.loop(500, this, toggle)
                    Laya.timer.once(5000, this, stop);
                }

                const stop = () => {
                    Laya.timer.clear(this, toggle);
                    sprite.graphics.removeCmd(lastCmd)
                    if (!this.isResetting) {
                        this.isResetting = true
                        this.Reset()
                        Laya.timer.once(1000, this, () => {
                            this.isResetting = false
                        })
                    }
                }

                start()
            }

            sprite.width = matrix.length * cmdWidth
            Laya.timer.frameOnce(1, this, () => {
                try {
                    panel.refresh();
                    panel.scrollTo((lastX - 4) * cmdWidth)
                } catch (error) {
                    console.log(error)
                }
            });
        } catch (error) {
            console.log(error)
        }
    }
}