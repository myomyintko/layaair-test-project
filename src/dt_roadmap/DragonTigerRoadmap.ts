const { regClass, property } = Laya;

import Roadmap from "./Roadmap";
import Box = Laya.Box
import Btn = Laya.Button
import Image = Laya.Image

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
            this.resetPredictions()
        })
    }

    initPredictions(): void {
        const predictionsBox = this.owner.getChildByName("predictions") as Box;

        const setSkin = (item: Image, color: string | null, type: string): void => {
            if (color === "red") {
                item.skin = `resources/dt/red${type}.png`;
            } else if (color === "blue") {
                item.skin = `resources/dt/blue${type}.png`;
            } else {
                item.skin = null;
            }
        };

        const initRoadmapValues = (boxName: string, newResult: string): void => {
            const box = predictionsBox.getChildByName(boxName) as Box;
            const valueItems = [0, 1, 2].map(i => box.getChildByName("Box").getChildByName(`item${i}`) as Image);

            this.roadmap.push(newResult)
            setSkin(valueItems[0], this.roadmap.bigeyeboy.previousColor, "");
            setSkin(valueItems[1], this.roadmap.smallroad.previousColor, "_full");
            setSkin(valueItems[2], this.roadmap.cockroachPig.previousColor, "_stick");

            this.roadmap.pop()
        };

        initRoadmapValues("tiger", "b");
        initRoadmapValues("dragon", "p");
    }

    resetPredictions(): void {
        const predictionsBox = this.owner.getChildByName("predictions") as Box;

        const initRoadmapValues = (boxName: string) => {
            const box = predictionsBox.getChildByName(boxName) as Box
            const valueItems = [0, 1, 2].map(i => box.getChildByName("Box").getChildByName(`item${i}`) as Image);
            valueItems[0].skin = null
            valueItems[1].skin = null
            valueItems[2].skin = null
        }
        initRoadmapValues("dragon")
        initRoadmapValues("tiger")
    }

    initRoadmapData(): void {
        this.roadmap = new Roadmap({
            results: [],
            config: {
                breadplate: {
                    rows: 6,
                    cols: 100,
                },
                bigroad: {
                    rows: 6,
                    cols: 100,
                },
                bigeyeboy: {
                    rows: 6,
                    cols: 100,
                },
                smallroad: {
                    rows: 6,
                    cols: 100,
                },
                cockroachPig: {
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
        this.initPredictions()

        console.clear()
        console.log(this.roadmap.bigeyeboy)
    }

    renderBeadPlateData(): void {
        const cmdWidth = this.beadPlateRoadBox.width / 6;
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
        const cmdWidth = this.bigRoadBox.width / 16;
        const cmdHeight = this.bigRoadBox.height / 6;
        const boxWidth = Math.min(cmdWidth, cmdHeight)

        const matrix = this.roadmap.bigroad.matrix;
        let rowIndex = this.roadmap.bigroad.previousCoordinates[0]
        let colIndex = this.roadmap.bigroad.previousCoordinates[1]

        const cell = matrix[rowIndex][colIndex]
        if (cell && cell.value) {

            let centerX, centerY, imgUrl
            centerX = colIndex * cmdWidth + cmdWidth / 2 - boxWidth * 0.5;
            centerY = rowIndex * cmdHeight + cmdHeight / 2 - boxWidth * 0.4;

            const cellName = Array.from(new Set(cell.value)).sort().join('')
            switch (cellName) {
                case "p":
                    imgUrl = "resources/dt/blue.png"
                    break;
                case "b":
                    imgUrl = "resources/dt/red.png"
                    break;
                case "pt":
                    imgUrl = "resources/dt/blue_tie.png"
                    break
                case "bt":
                    imgUrl = "resources/dt/red_tie.png"
                    break
                default:
                    break
            }

            if (imgUrl) {
                Laya.loader.load(imgUrl).then(res => {
                    this.bigRoadSprite.graphics.drawImage(res, centerX, centerY, boxWidth * 0.7, boxWidth * 0.7);
                });
            }
        }

        this.bigRoadSprite.autoSize = true
        Laya.timer.frameOnce(1, this, () => {
            this.bigRoadPanel.refresh();
            this.bigRoadPanel.scrollTo(cmdWidth * colIndex, 0);
        });
    }

    renderBigEyeRoadData(): void {
        const cmdWidth = this.bigEyeRoadBox.width / 20;
        const cmdHeight = this.bigEyeRoadBox.height / 6;
        const boxWidth = Math.min(cmdWidth, cmdHeight)

        const matrix = this.roadmap.bigeyeboy.matrix;
        let rowIndex = this.roadmap.bigeyeboy.previousCoordinates[0]
        let colIndex = this.roadmap.bigeyeboy.previousCoordinates[1]
        const cell = matrix[rowIndex][colIndex]
        if (cell && cell.value) {
            const centerX = colIndex * cmdWidth + cmdWidth / 2 - boxWidth * 0.4;
            const centerY = rowIndex * boxWidth + boxWidth / 2 - boxWidth * 0.2;

            let imgUrl: string;
            switch (cell.value) {
                case "blue":
                    imgUrl = "resources/dt/blue_small.png";
                    break;
                case "red":
                    imgUrl = "resources/dt/red_small.png";
                    break;
                default:
                    break
            }

            if (imgUrl) {

                Laya.loader.load(imgUrl).then(res => {
                    this.bigEyeRoadSprite.graphics.drawImage(res, centerX, centerY, boxWidth * 0.8, boxWidth * 0.8);
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
        const cmdWidth = this.smallRoadBox.width / 10;
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
                    imgUrl = "resources/dt/blue_full.png";
                    break;
                case "red":
                    imgUrl = "resources/dt/red_full.png";
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
        const cmdWidth = this.cockroachRoadBox.width / 10;
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
                    imgUrl = "resources/dt/blue_stick.png";
                    break;
                case "red":
                    imgUrl = "resources/dt/red_stick.png";
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
}