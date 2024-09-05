const { regClass } = Laya;
import { DgtgRoadmapRenderBase } from "./DgtgRoadmapRender.generated";
import * as historyData from "./ds.json"

interface dgtgResultImgs {
    dgTgData1ResultDom1: string
    dgTgData1ResultDom2: string
    dgTgData1ResultDom4: string

    dgTgData2ResultDom1: string
    dgTgData2ResultDom5: string
    dgTgData2ResultDom2: string
    dgTgData2ResultDom6: string

    dgTgData3ResultDom1: string
    dgTgData3ResultDom2: string

    dgTgData4ResultDom1: string
    dgTgData4ResultDom2: string

    dgTgData5ResultDom1: string
    dgTgData5ResultDom2: string
}

const dgtgResultImgData: dgtgResultImgs = {
    dgTgData1ResultDom1: "resources/game_icons/type73.png", // dragon
    dgTgData1ResultDom2: "resources/game_icons/type77.png", // tiger
    dgTgData1ResultDom4: "resources/game_icons/type69.png", // tie

    dgTgData2ResultDom1: "resources/game_icons/dgtg-type01.png", // dragon
    dgTgData2ResultDom5: "resources/game_icons/dgtg-type05.png", // dragon
    dgTgData2ResultDom2: "resources/game_icons/dgtg-type09.png", // tiger
    dgTgData2ResultDom6: "resources/game_icons/dgtg-type13.png", // tiger

    dgTgData3ResultDom1: "resources/game_icons/type85.png",
    dgTgData3ResultDom2: "resources/game_icons/type86.png",

    dgTgData4ResultDom1: "resources/game_icons/type81.png",
    dgTgData4ResultDom2: "resources/game_icons/type82.png",

    dgTgData5ResultDom1: "resources/game_icons/type83.png",
    dgTgData5ResultDom2: "resources/game_icons/type84.png",
}

const basePathMap: { [key: number]: string } = {
    1: "cr2", // dragon
    2: "cr1", // tiger
    4: "cr3", // tie
};

const dgtgResult6ImgData = (result: number, point: number) => {
    const basePath = basePathMap[result];
    return basePath ? `resources/game_icons/${basePath}_${point}.png` : undefined;
}

@regClass()
export class DgtgRoadmapRender extends DgtgRoadmapRenderBase {
    private defaultUI: "icon" | "point" = "icon"
    private currentUI = this.defaultUI
    private roadmapRows: number = 6
    private breadPlateCols: number
    private bigRoadCols: number
    private bigEyeRoadCols: number
    private smallRoadCols: number
    private cockroachRoadCols: number
    private isResetting: boolean = false

    onEnable(): void {
        this.layoutUI2().then(() => {
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
        })
    }

    private layoutUI1(): Promise<void> {
        return new Promise((resolve) => {
            this.size(896, 281);
            this.bgColor = "#A9A9A8"

            const widthPercent = (percent: number, mainWidth: number) => mainWidth * (percent / 100);
            const heightPercent = (percent: number, mainHeight: number) => mainHeight * (percent / 100);

            this.roadmap.size(this.width, this.height);
            this.roadmap.pos(0, 0)
            // breadplate box
            this.breadPlateCols = 8
            this.bead_plate_road_box.size(widthPercent(38.62, this.roadmap.width), this.roadmap.height);
            this.bead_plate_road_box.pos(0, 0)
            let bgImg = this.bead_plate_road_box.getChildByName("Image") as Laya.Image
            bgImg.skin = `resources/cardroad_bg_${this.breadPlateCols.toString().padStart(2, '0')}.png`
            // bigroad box
            this.bigRoadCols = 20
            this.big_road_box.size(widthPercent(61.27, this.roadmap.width), heightPercent(49.82, this.roadmap.height))
            this.big_road_box.pos(this.bead_plate_road_box.width + 1, 0)
            bgImg = this.big_road_box.getChildByName("Image") as Laya.Image
            bgImg.skin = `resources/cardroad_bg_${this.bigRoadCols.toString().padStart(2, '0')}.png`
            // threebox
            this.three_road_box.size(widthPercent(61.27, this.roadmap.width), heightPercent(49.82, this.roadmap.height))
            this.three_road_box.pos(this.bead_plate_road_box.width + 1, this.big_road_box.height)
            bgImg = this.three_road_box.getChildByName("Image") as Laya.Image
            bgImg.skin = `resources/cardroad_bg_${this.bigRoadCols.toString().padStart(2, '0')}.png`
            // bigeyebox
            this.bigEyeRoadCols = 40
            this.big_eye_road_box.size(this.three_road_box.width, heightPercent(50, this.three_road_box.height))
            this.big_eye_road_box.pos(0, 0)
            //smallbox
            this.smallRoadCols = 20
            this.small_road_box.size(widthPercent(50.09, this.three_road_box.width), heightPercent(50, this.three_road_box.height))
            this.small_road_box.pos(0, this.big_eye_road_box.height)
            // cockroachbox
            this.cockroachRoadCols = 20
            this.cockroach_road_box.size(widthPercent(50.09, this.three_road_box.width), heightPercent(50, this.three_road_box.height))
            this.cockroach_road_box.pos(this.small_road_box.width, this.big_eye_road_box.height)

            // prediction box
            this.predictions.visible = false
            // this.predictions.size(widthPercent(8.28, this.width), heightPercent(84.34, this.height));
            // this.predictions.pos(this.roadmap.width + 1, 0)
            // this.wenlu_Xian.size(this.predictions.width, heightPercent(50, this.predictions.height - 1))
            // this.wenlu_Xian.pos(0, 0)
            // this.wenlu_Zhuang.size(this.predictions.width, heightPercent(50, this.predictions.height - 1))
            // this.wenlu_Zhuang.pos(0, this.wenlu_Xian.height + 1)
            // switch box
            this.switchBtn.visible = false
            // this.switchBtn.size(widthPercent(8.28, this.width), heightPercent(15.30, this.height));
            // this.switchBtn.pos(this.roadmap.width + 1, this.predictions.height + 1)
            resolve()
        })
    }

    private layoutUI2(): Promise<void> {
        return new Promise((resolve) => {
            this.size(978, 281);
            this.bgColor = "#A9A9A8"

            const widthPercent = (percent: number, mainWidth: number) => mainWidth * (percent / 100);
            const heightPercent = (percent: number, mainHeight: number) => mainHeight * (percent / 100);

            this.roadmap.size(widthPercent(91.63, this.width), this.height);
            this.roadmap.pos(0, 0)
            // breadplate box
            this.breadPlateCols = 8
            this.bead_plate_road_box.size(widthPercent(38.62, this.roadmap.width), this.roadmap.height);
            this.bead_plate_road_box.pos(0, 0)
            let bgImg = this.bead_plate_road_box.getChildByName("Image") as Laya.Image
            bgImg.skin = `resources/cardroad_bg_${this.breadPlateCols.toString().padStart(2, '0')}.png`
            // bigroad box
            this.bigRoadCols = 20
            this.big_road_box.size(widthPercent(61.27, this.roadmap.width), heightPercent(49.82, this.roadmap.height))
            this.big_road_box.pos(this.bead_plate_road_box.width + 1, 0)
            bgImg = this.big_road_box.getChildByName("Image") as Laya.Image
            bgImg.skin = `resources/cardroad_bg_${this.bigRoadCols.toString().padStart(2, '0')}.png`
            // threebox
            this.three_road_box.size(widthPercent(61.27, this.roadmap.width), heightPercent(49.82, this.roadmap.height))
            this.three_road_box.pos(this.bead_plate_road_box.width + 1, this.big_road_box.height)
            bgImg = this.three_road_box.getChildByName("Image") as Laya.Image
            bgImg.skin = `resources/cardroad_bg_${this.bigRoadCols.toString().padStart(2, '0')}.png`
            // bigeyebox
            this.bigEyeRoadCols = 40
            this.big_eye_road_box.size(this.three_road_box.width, heightPercent(50, this.three_road_box.height))
            this.big_eye_road_box.pos(0, 0)
            //smallbox
            this.smallRoadCols = 20
            this.small_road_box.size(widthPercent(50.09, this.three_road_box.width), heightPercent(50, this.three_road_box.height))
            this.small_road_box.pos(0, this.big_eye_road_box.height)
            // cockroachbox
            this.cockroachRoadCols = 20
            this.cockroach_road_box.size(widthPercent(50.09, this.three_road_box.width), heightPercent(50, this.three_road_box.height))
            this.cockroach_road_box.pos(this.small_road_box.width, this.big_eye_road_box.height)

            // prediction box
            this.predictions.size(widthPercent(8.28, this.width), heightPercent(84.34, this.height));
            this.predictions.pos(this.roadmap.width + 1, 0)
            this.wenlu_Xian.size(this.predictions.width, heightPercent(50, this.predictions.height - 1))
            this.wenlu_Xian.pos(0, 0)
            this.wenlu_Zhuang.size(this.predictions.width, heightPercent(50, this.predictions.height - 1))
            this.wenlu_Zhuang.pos(0, this.wenlu_Xian.height + 1)
            // switch box
            this.switchBtn.size(widthPercent(8.28, this.width), heightPercent(15.30, this.height));
            this.switchBtn.pos(this.roadmap.width + 1, this.predictions.height + 1)
            resolve()
        })
    }

    private layoutUI3(): Promise<void> {
        return new Promise((resolve) => {
            this.size(1299, 216);
            this.bgColor = "#A9A9A8"

            const widthPercent = (percent: number, mainWidth: number) => mainWidth * (percent / 100);
            const heightPercent = (percent: number, mainHeight: number) => mainHeight * (percent / 100);

            this.roadmap.size(widthPercent(87.99, this.width), this.height);
            this.roadmap.pos(0, 0)
            // breadplate box
            this.breadPlateCols = 12
            this.bead_plate_road_box.size(widthPercent(36.93, this.roadmap.width), this.roadmap.height);
            this.bead_plate_road_box.pos(0, 0)
            let bgImg = this.bead_plate_road_box.getChildByName("Image") as Laya.Image
            bgImg.skin = `resources/cardroad_bg_${this.breadPlateCols.toString().padStart(2, '0')}.png`
            // bigroad box
            this.bigRoadCols = 33
            this.big_road_box.size(widthPercent(63.16, this.roadmap.width), heightPercent(50, this.roadmap.height))
            this.big_road_box.pos(this.bead_plate_road_box.width, 0)
            bgImg = this.big_road_box.getChildByName("Image") as Laya.Image
            bgImg.skin = `resources/cardroad_bg_${this.bigRoadCols.toString().padStart(2, '0')}.png`
            // threebox
            this.three_road_box.size(widthPercent(63.16, this.roadmap.width), heightPercent(50, this.roadmap.height))
            this.three_road_box.pos(this.bead_plate_road_box.width, this.big_road_box.height)
            bgImg = this.three_road_box.getChildByName("Image") as Laya.Image
            bgImg.skin = `resources/cardroad_bg_${this.bigRoadCols.toString().padStart(2, '0')}.png`
            // bigeyebox
            this.bigEyeRoadCols = 11
            this.big_eye_road_box.size(widthPercent(33.33, this.three_road_box.width), this.three_road_box.height)
            this.big_eye_road_box.pos(0, 0)
            //smallbox
            this.smallRoadCols = 11
            this.small_road_box.size(widthPercent(33.33, this.three_road_box.width), this.three_road_box.height)
            this.small_road_box.pos(this.big_eye_road_box.width, 0)
            // cockroachbox
            this.cockroachRoadCols = 11
            this.cockroach_road_box.size(widthPercent(33.33, this.three_road_box.width), this.three_road_box.height)
            this.cockroach_road_box.pos(this.small_road_box.width * 2, 0)

            // prediction box
            this.predictions.size(widthPercent(11.85, this.width), this.height);
            this.predictions.pos(this.roadmap.width + 1, 0)

            this.wenlu_Xian.size(this.predictions.width, heightPercent(50, this.predictions.height - 1))
            this.wenlu_Xian.pos(0, 0)
            let wenluLbl = this.wenlu_Xian.getChildByName("titleLbl") as Laya.Label
            wenluLbl.rotation = 0
            wenluLbl.centerX = 0
            wenluLbl.y = 20

            let wenluBox = this.wenlu_Xian.getChildByName("road_box") as Laya.Sprite
            wenluBox.size(120, 30)
            wenluBox.pos((this.wenlu_Xian.width - wenluBox.width) / 2, this.wenlu_Xian.height - wenluBox.height - 15)
            let wenluImg3 = wenluBox.getChildAt(0) as Laya.Image
            wenluImg3.size(15, 15)
            wenluImg3.centerY = 0
            wenluImg3.left = 14

            let wenluImg4 = wenluBox.getChildAt(1) as Laya.Image
            wenluImg4.size(15, 15)
            wenluImg4.centerY = 0
            wenluImg4.centerX = 0

            let wenluImg5 = wenluBox.getChildAt(2) as Laya.Image
            wenluImg5.size(15, 15)
            wenluImg5.centerY = 0
            wenluImg5.right = 14

            this.wenlu_Zhuang.size(this.predictions.width, heightPercent(50, this.predictions.height - 1))
            this.wenlu_Zhuang.pos(0, this.wenlu_Xian.height + 1)
            wenluLbl = this.wenlu_Zhuang.getChildByName("titleLbl") as Laya.Label
            wenluLbl.rotation = 0
            wenluLbl.centerX = 0
            wenluLbl.y = 20

            wenluBox = this.wenlu_Zhuang.getChildByName("road_box") as Laya.Sprite
            wenluBox.size(120, 30)
            wenluBox.pos((this.wenlu_Zhuang.width - wenluBox.width) / 2, this.wenlu_Zhuang.height - wenluBox.height - 15)
            wenluImg3 = wenluBox.getChildAt(0) as Laya.Image
            wenluImg3.size(15, 15)
            wenluImg3.centerY = 0
            wenluImg3.left = 14

            wenluImg4 = wenluBox.getChildAt(1) as Laya.Image
            wenluImg4.size(15, 15)
            wenluImg4.centerY = 0
            wenluImg4.centerX = 0

            wenluImg5 = wenluBox.getChildAt(2) as Laya.Image
            wenluImg5.size(15, 15)
            wenluImg5.centerY = 0
            wenluImg5.right = 14

            // switch box
            this.switchBtn.visible = false
            resolve()
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
            dataArr1PlayerAsk.push(1)
            const dataArr2PlayerAsk = this.AddOneResultToArr2(historyData.dataArr2, 1)
            const dataArr3PlayerAsk = this.AddOneResultToArr2(historyData.dataArr3, historyData.dragonAsk3)
            const dataArr4PlayerAsk = this.AddOneResultToArr2(historyData.dataArr4, historyData.dragonAsk4)
            const dataArr5PlayerAsk = this.AddOneResultToArr2(historyData.dataArr5, historyData.dragonAsk5)
            const dataArr6PlayerAsk = historyData.dataArr6.slice()
            dataArr6PlayerAsk.push(1e4)

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

        const dragonAsk3 = wenluXianRoadBox.getChildByName("wenlu3") as Laya.Image
        dragonAsk3.skin = historyData.dragonAsk3 === 1 ? "resources/game_icons/type85.png" : "resources/game_icons/type86.png"
        const dragonAsk4 = wenluXianRoadBox.getChildByName("wenlu4") as Laya.Image
        dragonAsk4.skin = historyData.dragonAsk4 === 1 ? "resources/game_icons/type81.png" : "resources/game_icons/type82.png"
        const dragonAsk5 = wenluXianRoadBox.getChildByName("wenlu5") as Laya.Image
        dragonAsk5.skin = historyData.dragonAsk5 === 1 ? "resources/game_icons/type83.png" : "resources/game_icons/type84.png"

        const wenluZhuangRoadBox = this.wenlu_Zhuang.getChildByName("road_box") as Laya.Box
        wenluZhuangRoadBox.on(Laya.Event.CLICK, this, () => {
            Laya.timer.clearAll(this)

            const dataArr1BankerAsk = historyData.dataArr1.slice()
            dataArr1BankerAsk.push(2)
            const dataArr2BankerAsk = this.AddOneResultToArr2(historyData.dataArr2, 2)
            const dataArr3BankerAsk = this.AddOneResultToArr2(historyData.dataArr3, historyData.tigerAsk3)
            const dataArr4BankerAsk = this.AddOneResultToArr2(historyData.dataArr4, historyData.tigerAsk4)
            const dataArr5BankerAsk = this.AddOneResultToArr2(historyData.dataArr5, historyData.tigerAsk5)
            const dataArr6BankerAsk = historyData.dataArr6.slice()
            dataArr6BankerAsk.push(2e4)

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

        const tigerAsk3 = wenluZhuangRoadBox.getChildByName("wenlu3") as Laya.Image
        tigerAsk3.skin = historyData.tigerAsk3 === 1 ? "resources/game_icons/type85.png" : "resources/game_icons/type86.png"
        const tigerAsk4 = wenluZhuangRoadBox.getChildByName("wenlu4") as Laya.Image
        tigerAsk4.skin = historyData.tigerAsk4 === 1 ? "resources/game_icons/type81.png" : "resources/game_icons/type82.png"
        const tigerAsk5 = wenluZhuangRoadBox.getChildByName("wenlu5") as Laya.Image
        tigerAsk5.skin = historyData.tigerAsk5 === 1 ? "resources/game_icons/type83.png" : "resources/game_icons/type84.png"
    }

    SetHistoryItem1(cmd: Laya.DrawImageCmd, result: number) {
        if (cmd) {
            const imgUrl = dgtgResultImgData["dgTgData1ResultDom" + (result & 31) as keyof dgtgResultImgs]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    SetHistoryItem2(cmd: Laya.DrawImageCmd, result: number): void {
        if (cmd) {
            const imgUrl = dgtgResultImgData["dgTgData2ResultDom" + (result & 31) as keyof dgtgResultImgs]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    SetHistoryItem3(cmd: Laya.DrawImageCmd, result: number): void {
        if (cmd) {
            const imgUrl = dgtgResultImgData["dgTgData3ResultDom" + (result & 3) as keyof dgtgResultImgs]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    SetHistoryItem4(cmd: Laya.DrawImageCmd, result: number): void {
        if (cmd) {
            const imgUrl = dgtgResultImgData["dgTgData4ResultDom" + (result & 3) as keyof dgtgResultImgs]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    SetHistoryItem5(cmd: Laya.DrawImageCmd, result: number): void {
        if (cmd) {
            const imgUrl = dgtgResultImgData["dgTgData5ResultDom" + (result & 3) as keyof dgtgResultImgs]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    SetHistoryItem6(cmd: Laya.DrawImageCmd, result: number): void {
        if (cmd) {
            const resultStr = result.toString()
            const g = parseInt(resultStr.slice(0, resultStr.length - 4)) & 31
            if ([1e4, 2e4].includes(result)) {
                const imgUrl = dgtgResultImgData["dgTgData1ResultDom" + (g & 31) as keyof dgtgResultImgs]
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
                    imgUrl = dgtgResult6ImgData(g, parseInt(resultStr.slice(-2)) % 20)
                    break;
                default:
                    imgUrl = dgtgResult6ImgData(g, parseInt(resultStr.slice(-4, -2)) % 20)
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