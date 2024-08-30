const { regClass } = Laya;
import { BacRoadmapBase } from "./BacRoadmap.generated";
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
    bacData1ResultDom1: "resources/game_icons/type61.png",
    bacData1ResultDom9: "resources/game_icons/type62.png",
    bacData1ResultDom17: "resources/game_icons/type63.png",
    bacData1ResultDom25: "resources/game_icons/type64.png",
    bacData1ResultDom2: "resources/game_icons/type65.png",
    bacData1ResultDom10: "resources/game_icons/type66.png",
    bacData1ResultDom18: "resources/game_icons/type67.png",
    bacData1ResultDom26: "resources/game_icons/type68.png",
    bacData1ResultDom4: "resources/game_icons/type69.png",
    bacData1ResultDom12: "resources/game_icons/type70.png",
    bacData1ResultDom20: "resources/game_icons/type71.png",
    bacData1ResultDom28: "resources/game_icons/type72.png",

    bacData2ResultDom1: "resources/game_icons/type01.png",
    bacData2ResultDom9: "resources/game_icons/type02.png",
    bacData2ResultDom17: "resources/game_icons/type03.png",
    bacData2ResultDom25: "resources/game_icons/type04.png",
    bacData2ResultDom5: "resources/game_icons/type05.png",
    bacData2ResultDom13: "resources/game_icons/type06.png",
    bacData2ResultDom21: "resources/game_icons/type07.png",
    bacData2ResultDom29: "resources/game_icons/type08.png",
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
    9: "cr6",
    17: "cr11",
    25: "cr16",
    2: "cr2",
    10: "cr7",
    18: "cr12",
    26: "cr17",
    4: "cr3",
    12: "cr8",
    20: "cr13",
    28: "cr18"
};

const bacResult6ImgData = (result: number, point: number) => {
    const basePath = basePathMap[result];
    return basePath ? `resources/game_icons/${basePath}_${point}.png` : undefined;
}

@regClass()
export class BacRoadmap extends BacRoadmapBase {
    private defaultUI: "icon" | "point" = "icon"
    private currentUI = this.defaultUI

    onEnable(): void {
        Laya.loader.load("resources/game_icons.atlas").then(async (res) => {
            this.setupRoadmapUI()
            if (this.currentUI === "icon") {
                await this.GetHistoryFragment1(historyData.dataArr1, 6, 6, this.bead_plate_road_panel, this.SetHistoryItem1)
            } else if(this.currentUI==="point"){
                await this.GetHistoryFragment1(historyData.dataArr6, 6, 6, this.bead_plate_road_panel, this.SetHistoryItem6)
            }
            await this.GetHistoryFragment2(historyData.dataArr2, 16, 6, this.big_road_panel, this.SetHistoryItem2)
            await this.GetHistoryFragment2(historyData.dataArr3, 20, 6, this.big_eye_road_panel, this.SetHistoryItem3)
            await this.GetHistoryFragment2(historyData.dataArr4, 10, 6, this.small_road_panel, this.SetHistoryItem4)
            await this.GetHistoryFragment2(historyData.dataArr5, 10, 6, this.cockroach_road_panel, this.SetHistoryItem5)
            this.setWenluData()

            this.switchBtn.clickHandler = new Laya.Handler(this, async () => {
                this.currentUI = this.currentUI === "icon" ? "point" : "icon"
                if (this.currentUI === "point") {
                    await this.GetHistoryFragment1(historyData.dataArr6, 6, 6, this.bead_plate_road_panel, this.SetHistoryItem6)
                } else if (this.currentUI === "icon") {
                    await this.GetHistoryFragment1(historyData.dataArr1, 6, 6, this.bead_plate_road_panel, this.SetHistoryItem1)
                }
            })
        })
    }

    private setupRoadmapUI(): void {
        // bead plate road
        this.bead_plate_road_panel.scrollType = Laya.ScrollType.Horizontal
        this.bead_plate_road_panel.mouseEnabled = false
        const { width: beadPlateRoadWidth, height: beadPlateRoadHeight } = this.bead_plate_road_panel
        this.bead_plate_road_sprite.size(beadPlateRoadWidth, beadPlateRoadHeight)
        this.bead_plate_road_sprite.autoSize = false

        // big road
        this.big_road_panel.scrollType = Laya.ScrollType.Horizontal
        this.big_road_panel.mouseEnabled = false
        const { width: bigRoadWidth, height: bigRoadHeight } = this.big_road_panel
        this.bead_plate_road_sprite.size(bigRoadWidth, bigRoadHeight)

        // big eye road
        this.big_eye_road_panel.scrollType = Laya.ScrollType.Horizontal
        this.big_eye_road_panel.mouseEnabled = false
        const { width: bigEyeRoadWidth, height: bigEyeRoadHeight } = this.big_eye_road_panel
        this.bead_plate_road_sprite.size(bigEyeRoadWidth, bigEyeRoadHeight)

        // small road
        this.small_road_panel.scrollType = Laya.ScrollType.Horizontal
        this.small_road_panel.mouseEnabled = false
        const { width: smallRoadWidth, height: smallRoadHeight } = this.small_road_panel
        this.bead_plate_road_sprite.size(smallRoadWidth, smallRoadHeight)

        // cockroach road
        this.cockroach_road_panel.scrollType = Laya.ScrollType.Horizontal
        this.cockroach_road_panel.mouseEnabled = false
        const { width: cockroachRoadWidth, height: cockroachRoadHeight } = this.cockroach_road_panel
        this.bead_plate_road_sprite.size(cockroachRoadWidth, cockroachRoadHeight)
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
        wenluXianRoadBox.on(Laya.Event.CLICK, this, async () => {
            Laya.timer.clearAll(this)
            const dataArr1PlayerAsk = historyData.dataArr1.slice()
            dataArr1PlayerAsk.push(2)
            const dataArr2PlayerAsk = this.AddOneResultToArr2(historyData.dataArr2, 2)
            const dataArr3PlayerAsk = this.AddOneResultToArr2(historyData.dataArr3, historyData.playerAsk3)
            const dataArr4PlayerAsk = this.AddOneResultToArr2(historyData.dataArr4, historyData.playerAsk4)
            const dataArr5PlayerAsk = this.AddOneResultToArr2(historyData.dataArr5, historyData.playerAsk5)
            const dataArr6PlayerAsk = historyData.dataArr6.slice()
            dataArr6PlayerAsk.push(200)

            if (this.currentUI === "icon") {
                await this.GetHistoryFragment1(dataArr1PlayerAsk, 6, 6, this.bead_plate_road_panel, this.SetHistoryItem1,true)
            } else if(this.currentUI==="point"){
                await this.GetHistoryFragment1(dataArr6PlayerAsk, 6, 6, this.bead_plate_road_panel, this.SetHistoryItem6,true)
            }
            await this.GetHistoryFragment2(dataArr2PlayerAsk, 16, 6, this.big_road_panel, this.SetHistoryItem2, true)
            await this.GetHistoryFragment2(dataArr3PlayerAsk, 20, 6, this.big_eye_road_panel, this.SetHistoryItem3, true)
            await this.GetHistoryFragment2(dataArr4PlayerAsk, 10, 6, this.small_road_panel, this.SetHistoryItem4, true)
            await this.GetHistoryFragment2(dataArr5PlayerAsk, 10, 6, this.cockroach_road_panel, this.SetHistoryItem5, true)
        })

        const playerAsk3 = wenluXianRoadBox.getChildByName("wenlu3") as Laya.Image
        playerAsk3.skin = historyData.playerAsk3 === 1 ? "resources/game_icons/type85.png" : "resources/game_icons/type86.png"
        const playerAsk4 = wenluXianRoadBox.getChildByName("wenlu4") as Laya.Image
        playerAsk4.skin = historyData.playerAsk4 === 1 ? "resources/game_icons/type81.png" : "resources/game_icons/type82.png"
        const playerAsk5 = wenluXianRoadBox.getChildByName("wenlu5") as Laya.Image
        playerAsk5.skin = historyData.playerAsk5 === 1 ? "resources/game_icons/type83.png" : "resources/game_icons/type84.png"

        const wenluZhuangRoadBox = this.wenlu_Zhuang.getChildByName("road_box") as Laya.Box
        wenluZhuangRoadBox.on(Laya.Event.CLICK, this, async () => {
            Laya.timer.clearAll(this)

            const dataArr1BankerAsk = historyData.dataArr1.slice()
            dataArr1BankerAsk.push(1)
            const dataArr2BankerAsk = this.AddOneResultToArr2(historyData.dataArr2, 1)
            const dataArr3BankerAsk = this.AddOneResultToArr2(historyData.dataArr3, historyData.bankerAsk3)
            const dataArr4BankerAsk = this.AddOneResultToArr2(historyData.dataArr4, historyData.bankerAsk4)
            const dataArr5BankerAsk = this.AddOneResultToArr2(historyData.dataArr5, historyData.bankerAsk5)
            const dataArr6BankerAsk = historyData.dataArr6.slice()
            dataArr6BankerAsk.push(100)

            if (this.currentUI === "icon") {
                await this.GetHistoryFragment1(dataArr1BankerAsk, 6, 6, this.bead_plate_road_panel, this.SetHistoryItem1,true)
            } else if(this.currentUI==="point"){
                await this.GetHistoryFragment1(dataArr6BankerAsk, 6, 6, this.bead_plate_road_panel, this.SetHistoryItem6,true)
            }
            await this.GetHistoryFragment2(dataArr2BankerAsk, 16, 6, this.big_road_panel, this.SetHistoryItem2, true)
            await this.GetHistoryFragment2(dataArr3BankerAsk, 20, 6, this.big_eye_road_panel, this.SetHistoryItem3, true)
            await this.GetHistoryFragment2(dataArr4BankerAsk, 10, 6, this.small_road_panel, this.SetHistoryItem4, true)
            await this.GetHistoryFragment2(dataArr5BankerAsk, 10, 6, this.cockroach_road_panel, this.SetHistoryItem5, true)
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
            console.log(imgUrl, result, g)
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    async GetHistoryFragment1(arr: number[], col: number, row: number, panel: Laya.Panel, callback: (cmd: Laya.DrawImageCmd, result: number) => void, isAsk: boolean = false): Promise<void> {
        const matrix = [];
        for (let i = 0; i < arr.length; i += row) {
            matrix.push(arr.slice(i, i + row));
        }

        await this.fillTexture(matrix, row, col, panel, callback, isAsk)
    }

    async GetHistoryFragment2(arr: number[][], col: number, row: number, panel: Laya.Panel, callback: (cmd: Laya.DrawImageCmd, result: number) => void, isAsk: boolean = false): Promise<void> {
        const matrix = Array.from({ length: arr.length }, () => Array(row).fill(0));
        let available = row
        arr.forEach((row, i) => {
            available = matrix[i].filter(element => element === 0).length - 1
            row.forEach((col, j) => {
                let x = i
                let y = j
                if (j > available) {
                    x = i + (j - available)
                    y = available
                    if (!matrix[x]) { matrix[x] = Array(5).fill(0) }
                }
                matrix[x][y] = col
            })
        })
        await this.fillTexture(matrix, row, col, panel, callback, isAsk)
    }

    private fillTexture(matrix: number[][], row: number, col: number, panel: Laya.Panel, callback: (cmd: Laya.DrawImageCmd, result: number) => void, isAsk: boolean = false): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const sprite = panel.getChildAt(0) as Laya.Sprite;
                sprite.graphics.clear();

                const cmdWidth = panel.width / col;
                const cmdHeight = panel.height / row;
                const drawWidth = Math.min(cmdHeight, cmdWidth);
                let maxIndex = 0;
                let lastCmd: any = null
                matrix.forEach((col: number[], colIndex: number) => {
                    col.forEach((cell, cellIndex) => {
                        maxIndex = Math.max(maxIndex, cellIndex);
                        if (cell) {
                            const cmd = new Laya.DrawImageCmd();
                            cmd.width = drawWidth * 0.7;
                            cmd.height = drawWidth * 0.7;
                            cmd.x = colIndex * cmdWidth + cmdHeight / 2 - (drawWidth / 3);
                            cmd.y = cellIndex * cmdHeight + cmdHeight / 2 - (drawWidth / 3);
                            callback(cmd, cell);
                            sprite.graphics.addCmd(cmd);
                            lastCmd = cmd
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
                    }

                    start()
                }

                sprite.width = maxIndex * cmdWidth;
                Laya.timer.frameOnce(1, this, () => {
                    try {
                        panel.refresh();
                        const scrollBar = panel.hScrollBar;
                        if (scrollBar) {
                            scrollBar.value = scrollBar.max;
                        }
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

}