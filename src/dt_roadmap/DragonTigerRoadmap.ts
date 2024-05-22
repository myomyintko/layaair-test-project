const { regClass, property } = Laya;

import Roadmap from "./Roadmap";
import Box = Laya.Box
import Btn = Laya.Button

@regClass()
export class DragonTigerRoadmap extends Laya.Script {
    beadPlateRoadBox: Box
    bigRoadBox: Box
    bigEyeRoadBox: Box
    smallRoadBox: Box
    cockroachRoadBox: Box

    roadmap: Roadmap
    roadmapBox: Box;
    beadPlatePanel: Laya.Panel;
    beadPlateSprite: Laya.Sprite;
    bigRoadPanel: Laya.Panel;
    bigRoadSprite: Laya.Sprite;
    bigEyeRoadPanel: Laya.Panel;
    bigEyeRoadSprite: Laya.Sprite;
    smallRoadPanel: Laya.Panel;
    smallRoadSprite: Laya.Sprite;
    cockroachRoadPanel: Laya.Panel;
    cockroachRoadSprite: Laya.Sprite;

    onEnable(): void {
        this.initRoadMapBoxs()
        this.initControlBtns()
    }

    initRoadMapBoxs(): void {
        this.roadmapBox = this.owner.getChildByName("roadmap") as Box
        this.initBeadPlateRoad()
        this.initBigRoad()
        this.initBigEyeRoad()
        this.initSmallRoad()
        this.initCockroachRoad()
        this.initRoadmapData()
    }

    initBeadPlateRoad(): void {
        this.beadPlateRoadBox = this.roadmapBox.getChildByName("bead_plate_box") as Box
        this.beadPlatePanel = this.beadPlateRoadBox.getChildByName("panel") as Laya.Panel
        this.beadPlatePanel.scrollType = Laya.ScrollType.Horizontal
        this.beadPlatePanel.elasticEnabled = true
        this.beadPlateSprite = this.beadPlateRoadBox.getChildByName("panel").getChildByName("sprite") as Laya.Sprite
        this.beadPlatePanel.graphics.clear()
    }

    initBigRoad(): void {
        this.bigRoadBox = this.roadmapBox.getChildByName("big_road_box") as Box
        this.bigRoadPanel = this.bigRoadBox.getChildByName("panel") as Laya.Panel
        this.bigRoadPanel.scrollType = Laya.ScrollType.Horizontal
        this.bigRoadPanel.elasticEnabled = true
        this.bigRoadSprite = this.bigRoadBox.getChildByName("panel").getChildByName("sprite") as Laya.Sprite
        this.bigRoadSprite.graphics.clear()
    }

    initBigEyeRoad(): void {
        this.bigEyeRoadBox = this.roadmapBox.getChildByName("three_road_box").getChildByName("big_eye_box") as Box
        this.bigEyeRoadPanel = this.bigEyeRoadBox.getChildByName("panel") as Laya.Panel
        this.bigEyeRoadPanel.scrollType = Laya.ScrollType.Horizontal
        this.bigEyeRoadPanel.elasticEnabled = true
        this.bigEyeRoadSprite = this.bigEyeRoadBox.getChildByName("panel").getChildByName("sprite") as Laya.Sprite
        this.bigEyeRoadSprite.graphics.clear()
    }

    initSmallRoad(): void {
        this.smallRoadBox = this.roadmapBox.getChildByName("three_road_box").getChildByName("small_box") as Box
        this.smallRoadPanel = this.smallRoadBox.getChildByName("panel") as Laya.Panel
        this.smallRoadPanel.scrollType = Laya.ScrollType.Horizontal
        this.smallRoadPanel.elasticEnabled = true
        this.smallRoadSprite = this.smallRoadBox.getChildByName("panel").getChildByName("sprite") as Laya.Sprite
        this.smallRoadSprite.graphics.clear()
    }

    initCockroachRoad(): void {
        this.cockroachRoadBox = this.roadmapBox.getChildByName("three_road_box").getChildByName("cockroach_box") as Box
        this.cockroachRoadPanel = this.cockroachRoadBox.getChildByName("panel") as Laya.Panel
        this.cockroachRoadPanel.scrollType = Laya.ScrollType.Horizontal
        this.cockroachRoadPanel.elasticEnabled = true
        this.cockroachRoadSprite = this.cockroachRoadBox.getChildByName("panel").getChildByName("sprite") as Laya.Sprite
        this.cockroachRoadSprite.graphics.clear()
    }

    initControlBtns(): void {
        const controlBox = this.owner.getChildByName("control") as Box
        const dragonBtn = controlBox.getChildByName("dragon_btn") as Btn
        dragonBtn.clickHandler = new Laya.Handler(this, () => {
            this.roadmap.push("p")
            this.renderRoadmapUI()
        })

        const tigerBtn = controlBox.getChildByName("tiger_btn") as Btn
        tigerBtn.clickHandler = new Laya.Handler(this, () => {
            this.roadmap.push("b")
            this.renderRoadmapUI()
        })

        const tieBtn = controlBox.getChildByName("tie_btn") as Btn
        tieBtn.clickHandler = new Laya.Handler(this, () => {
            this.roadmap.push("t")
            this.renderRoadmapUI()
        })

        const clearBtn = controlBox.getChildByName("clear_btn") as Btn
        clearBtn.clickHandler = new Laya.Handler(this, () => {
            this.initRoadmapData()
            this.beadPlateSprite.graphics.clear()
            this.bigRoadSprite.graphics.clear()
            this.bigEyeRoadSprite.graphics.clear()
            this.smallRoadSprite.graphics.clear()
            this.cockroachRoadSprite.graphics.clear()
        })

        const tdpBtn = controlBox.getChildByName("tdp_btn") as Btn
        tdpBtn.clickHandler = new Laya.Handler(this, () => {
            this.roadmap.push("k")
            this.renderRoadmapUI()
        })

        const ttpBtn = controlBox.getChildByName("ttp_btn") as Btn
        ttpBtn.clickHandler = new Laya.Handler(this, () => {
            this.roadmap.push("i")
            this.renderRoadmapUI()
        })
    }

    initRoadmapData(): void {
        this.roadmap = new Roadmap({
            results: [],
            config: {
                breadplate: {
                    show_options: false,
                    rows: 6,
                    cols: 100,
                },
                bigroad: {
                    show_options: false,
                    rows: 6,
                    cols: 100,
                },
                bigeyeboy: {
                    show_options: false,
                    rows: 6,
                    cols: 100,
                },
                smallroad: {
                    show_options: false,
                    rows: 6,
                    cols: 100,
                },
                cockroachPig: {
                    show_options: false,
                    rows: 6,
                    cols: 100,
                },
            }
        })
    }

    renderRoadmapUI(): void {
        this.renderBeadPlateData()
        this.renderBigRoadData()
        this.renderBigEyeRoadData()
        this.renderSmallRoadmData()
        this.renderCockroachRoadmData()

        console.log(this.roadmap);
    }

    renderBeadPlateData(): void {
        const cmdWidth = this.beadPlateRoadBox.width / 10;
        const cmdHeight = this.beadPlateRoadBox.height / 6;
        const drawWidth = Math.min(cmdWidth, cmdHeight)

        const matrix = this.roadmap.breadplate.matrix;
        let rowIndex = this.roadmap.breadplate.previousCoordinates[0]
        let colIndex = this.roadmap.breadplate.previousCoordinates[1]
        const cell = matrix[rowIndex][colIndex]
        if (cell && cell.value) {
            const centerX = colIndex * cmdWidth + cmdWidth / 2 - drawWidth * 0.4;
            const centerY = rowIndex * cmdHeight + cmdHeight / 2 - drawWidth * 0.4;

            let imgUrl: string;
            switch (cell.value) {
                case "p":
                    imgUrl = "resources/dt/dragon.png";
                    break;
                case "b":
                    imgUrl = "resources/dt/tiger.png";
                    break;
                case "t":
                    imgUrl = "resources/dt/tie.png";
                    break;
                case "k":
                    imgUrl = "resources/dt/tie-blue.png"
                    break;
                case "i":
                    imgUrl = "resources/dt/tie-red.png"
                    break;
                default:
                    break
            }

            if (imgUrl) {
                Laya.loader.load(imgUrl).then(res => {
                    this.beadPlateSprite.graphics.drawImage(res, centerX, centerY, drawWidth * 0.7, drawWidth * 0.7);
                });
            }
        }

        this.beadPlateSprite.width = cmdWidth * (colIndex + 1)
        Laya.timer.frameOnce(1, this, () => {
            this.beadPlatePanel.refresh();
            this.beadPlatePanel.scrollTo(this.beadPlateSprite.width, 0);
        });
    }

    renderBigRoadData(): void {
        const cmdWidth = this.bigRoadBox.width / 20;
        const cmdHeight = this.bigRoadBox.height / 6;
        const boxWidth = Math.min(cmdWidth, cmdHeight)

        const matrix = this.roadmap.bigroad.matrix;
        let rowIndex = this.roadmap.bigroad.previousCoordinates[0]
        let colIndex = this.roadmap.bigroad.previousCoordinates[1]

        const cell = matrix[rowIndex][colIndex]
        if (cell && cell.value) {
            let centerX, centerY
            centerX = colIndex * cmdWidth + cmdWidth / 2 - boxWidth * 0.5;
            centerY = rowIndex * cmdHeight + cmdHeight / 2 - boxWidth * 0.4;

            let imgUrls: string[] = [], tieCount = 0
            for (let i = 0; i < cell.value.length; i++) {
                const item = cell.value[i]
                switch (item) {
                    case "p":
                        imgUrls.push("resources/dt/blue-circle.png")
                        break;
                    case "b":
                        imgUrls.push("resources/dt/red-circle.png")
                        break;
                    case "t":
                        imgUrls.push("resources/dt/tie-stick.png")
                        tieCount++
                        break
                    // case "k":
                    //     imgUrl = "resources/dt/blue-circle-stick.png"
                    //     break
                    // case "i":
                    //     imgUrl = "resources/dt/blue-circle-stick.png"
                    //     break
                    default:
                        break
                }
            }

            Laya.loader.load(imgUrls).then(resp => {
                if (tieCount >= 2) {
                    resp = resp.slice(0, resp.length - tieCount)
                    // this.bigRoadSprite.graphics.fillText(tieCount.toString(), centerX, centerY, "8px Arial", "#000000", "center")
                }

                resp.forEach((res: any) => {
                    this.bigRoadSprite.graphics.drawImage(res, centerX, centerY, boxWidth * 0.7, boxWidth * 0.7);
                })
            });
        }

        // this.bigRoadSprite.autoSize = true
        Laya.timer.frameOnce(1, this, () => {
            this.bigRoadPanel.refresh();
            this.bigRoadPanel.scrollTo(cmdWidth * colIndex, 0);
        });
    }

    renderBigEyeRoadData(): void {
        const cmdWidth = this.bigEyeRoadBox.width / 40;
        const cmdHeight = this.bigEyeRoadBox.height / 6;
        const boxWidth = Math.min(cmdWidth, cmdHeight)

        const matrix = this.roadmap.bigeyeboy.matrix;
        let rowIndex = this.roadmap.bigeyeboy.previousCoordinates[0]
        let colIndex = this.roadmap.bigeyeboy.previousCoordinates[1]
        const cell = matrix[rowIndex][colIndex]
        if (cell && cell.value) {
            const centerX = colIndex * cmdWidth + cmdWidth / 2 - boxWidth * 0.4;
            const centerY = rowIndex * boxWidth + boxWidth / 2 - boxWidth * 0.4;

            let imgUrl: string;
            switch (cell.value) {
                case "blue":
                    imgUrl = "resources/dt/blue_circle_small.png";
                    break;
                case "red":
                    imgUrl = "resources/dt/red_circle_small.png";
                    break;
                default:
                    break
            }

            if (imgUrl) {

                Laya.loader.load(imgUrl).then(res => {
                    this.bigEyeRoadSprite.graphics.drawImage(res, centerX, centerY, boxWidth * 0.7, boxWidth * 0.7);
                });
            }
        }

        this.bigEyeRoadSprite.autoSize = true
        Laya.timer.frameOnce(1, this, () => {
            this.bigEyeRoadPanel.refresh();
            this.bigEyeRoadPanel.scrollTo(boxWidth * colIndex, 0);
        });
    }

    renderSmallRoadmData(): void {
        const cmdWidth = this.smallRoadBox.width / 20;
        const cmdHeight = this.smallRoadBox.height / 6;
        const boxWidth = Math.min(cmdWidth, cmdHeight)

        const matrix = this.roadmap.smallroad.matrix;
        let rowIndex = this.roadmap.smallroad.previousCoordinates[0]
        let colIndex = this.roadmap.smallroad.previousCoordinates[1]
        const cell = matrix[rowIndex][colIndex]
        if (cell && cell.value) {
            const centerX = colIndex * boxWidth + boxWidth / 2 - boxWidth * 0.4;
            const centerY = rowIndex * cmdHeight + cmdHeight / 2 - boxWidth * 0.4;

            let imgUrl: string;
            switch (cell.value) {
                case "blue":
                    imgUrl = "resources/dt/blue-full.png";
                    break;
                case "red":
                    imgUrl = "resources/dt/red-full.png";
                    break;
                default:
                    break
            }

            if (imgUrl) {
                Laya.loader.load(imgUrl).then(res => {
                    this.smallRoadSprite.graphics.drawImage(res, centerX, centerY, boxWidth * 0.7, boxWidth * 0.7);
                });
            }
        }

        this.smallRoadSprite.autoSize = true
        Laya.timer.frameOnce(1, this, () => {
            this.smallRoadPanel.refresh();
            this.smallRoadPanel.scrollTo(cmdWidth * colIndex, 0);
        });
    }

    renderCockroachRoadmData(): void {
        const cmdWidth = this.cockroachRoadBox.width / 20;
        const cmdHeight = this.cockroachRoadBox.height / 6;
        const boxWidth = Math.min(cmdWidth, cmdHeight)

        const matrix = this.roadmap.cockroachPig.matrix;
        let rowIndex = this.roadmap.cockroachPig.previousCoordinates[0]
        let colIndex = this.roadmap.cockroachPig.previousCoordinates[1]
        const cell = matrix[rowIndex][colIndex]
        if (cell && cell.value) {
            const centerX = colIndex * cmdWidth + cmdWidth / 2 - boxWidth * 0.4;
            const centerY = rowIndex * cmdHeight + cmdHeight / 2 - boxWidth * 0.4;

            let imgUrl: string;
            switch (cell.value) {
                case "blue":
                    imgUrl = "resources/dt/blue-stick.png";
                    break;
                case "red":
                    imgUrl = "resources/dt/red-stick.png";
                    break;
                default:
                    break
            }

            if (imgUrl) {
                Laya.loader.load(imgUrl).then(res => {
                    this.cockroachRoadSprite.graphics.drawImage(res, centerX, centerY, boxWidth * 0.7, boxWidth * 0.7);
                });
            }
        }

        this.cockroachRoadSprite.autoSize = true
        Laya.timer.frameOnce(1, this, () => {
            this.cockroachRoadPanel.refresh();
            this.cockroachRoadPanel.scrollTo(boxWidth * colIndex, 0);
        });
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