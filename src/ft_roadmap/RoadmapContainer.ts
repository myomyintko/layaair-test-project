import FantanRoadmap from "./FantanRoadmap";
import Roadmap from "./Roadmap";

const { regClass, property } = Laya;

@regClass()
export class RoadmapContainer extends Laya.Script {
    declare owner: Laya.Box;

    private btn1: Laya.Button
    private btn2: Laya.Button
    private btn3: Laya.Button
    private btn4: Laya.Button
    private btnReset: Laya.Button
    private roadmapBox: Laya.Box

    roadmapData: number[] = []
    roadmapSprite: Laya.Sprite;
    roadmapPanel: Laya.Panel;
    cmdWidth: number
    cmdHeight: number
    drawWidth: number
    roadmapType: string = "icon"
    roadmap: Roadmap
    froadmap: FantanRoadmap

    initRoadmapData(): void {
        this.roadmap = new Roadmap({
            config: {
                bigroad: {
                    show_options: false,
                    rows: 6,
                    cols: 100
                }
            }
        })

        const result: number[] = []
        this.froadmap = new FantanRoadmap(result, 6, 100)

        console.log(this.froadmap);

    }

    async onEnable(): Promise<void> {
        this.initRoadmapData()

        this.btn1 = this.owner.getChildByName("control").getChildByName("btn1") as Laya.Button
        this.btn1.clickHandler = new Laya.Handler(this, () => {
            this.addResult(1)
        })

        this.btn2 = this.owner.getChildByName("control").getChildByName("btn2") as Laya.Button
        this.btn2.clickHandler = new Laya.Handler(this, () => {
            this.addResult(2)
        })

        this.btn3 = this.owner.getChildByName("control").getChildByName("btn3") as Laya.Button
        this.btn3.clickHandler = new Laya.Handler(this, () => {
            this.addResult(3)
        })

        this.btn4 = this.owner.getChildByName("control").getChildByName("btn4") as Laya.Button
        this.btn4.clickHandler = new Laya.Handler(this, () => {
            this.addResult(4)
        })

        this.btnReset = this.owner.getChildByName("control").getChildByName("btn_reset") as Laya.Button
        this.btnReset.clickHandler = new Laya.Handler(this, () => {
            this.roadmapSprite.graphics.clear()
            this.initRoadmapData()
        })

        this.roadmapBox = this.owner.getChildByName("roadmap") as Laya.Box

        await this.initRoadmapUI()
    }

    async initRoadmapUI(): Promise<void> {
        await Laya.loader.load(["atlas/fantan_roadmap_items.atlas", "resources/fantan_even.png", "resources/fantan_odd.png"])

        const background = new Laya.Image('resources/cardroad_bg_10.png')
        background.name = "background"
        background.width = this.roadmapBox.width
        background.height = this.roadmapBox.height
        this.roadmapBox.addChild(background)

        this.roadmapPanel = new Laya.Panel()
        this.roadmapPanel.name = "roadmap-container"
        this.roadmapPanel.width = this.roadmapBox.width
        this.roadmapPanel.height = this.roadmapBox.height
        this.roadmapPanel.scrollType = Laya.ScrollType.Horizontal
        this.roadmapPanel.elasticEnabled = true;
        this.roadmapPanel.hScrollBar.elasticDistance = this.cmdWidth

        this.roadmapSprite = new Laya.Sprite()
        this.roadmapSprite.name = "roadmap"
        this.roadmapSprite.width = this.roadmapBox.width
        this.roadmapSprite.height = this.roadmapBox.height
        this.roadmapSprite.drawCallOptimize = true
        this.roadmapSprite.graphics.clear()

        this.roadmapPanel.addChild(this.roadmapSprite)
        this.roadmapBox.addChild(this.roadmapPanel)

        const controlWrapper = new Laya.Box(true);
        controlWrapper.name = "control-container";

        const createControlButton = (iconPath: string, alignX: number, alignY: number): Laya.Box => {
            const icon = new Laya.Image(iconPath);
            icon.alpha = 0.1;
            icon.centerX = 0;
            icon.centerY = 0;
            icon.color = "#000000"

            const container = new Laya.Box(true);
            container.width = this.roadmapBox.width / 3;
            container.height = this.roadmapBox.height;
            container.x = alignX;
            container.y = alignY;
            container.addChild(icon);
            return container;
        };

        const prevContainer = createControlButton("resources/arrow-leftside.png", 0, 0);
        prevContainer.on(Laya.Event.CLICK, () => {
            this.roadmapPanel.hScrollBar.value -= this.cmdWidth
        })
        const nextContainer = createControlButton("resources/arrow-rightside.png", this.roadmapBox.width - (this.roadmapBox.width / 3), 0);
        nextContainer.on(Laya.Event.CLICK, () => {
            this.roadmapPanel.hScrollBar.value += this.cmdHeight
        })

        controlWrapper.addChild(prevContainer);
        controlWrapper.addChild(nextContainer);

        this.roadmapBox.addChild(controlWrapper);
    }

    private addResult(value: number): void {
        this.roadmap.push(value)
        this.froadmap.push(value)
        this.renderRoadmapUI()
    }

    renderRoadmapUI(): void {
        this.cmdWidth = this.roadmapBox.width / 10;
        this.cmdHeight = this.roadmapBox.height / 6;
        this.drawWidth = Math.min(this.cmdHeight, this.cmdWidth)
        this.roadmapPanel.width = this.cmdWidth * 9

        let maxIndex = 0;
        const matrix = this.froadmap.matrix;
        let rowIndex = this.froadmap.previousCoordinates[0]
        let colIndex = this.froadmap.previousCoordinates[1]
        const cell = matrix[rowIndex][colIndex]

        if (cell && cell.value) {
            maxIndex = Math.max(maxIndex, colIndex)
            const centerX = colIndex * this.cmdWidth + this.cmdWidth / 2 - this.drawWidth * 0.4;
            const centerY = rowIndex * this.cmdHeight + this.cmdHeight / 2 - this.drawWidth * 0.4;
            let texture = null;
            switch (this.roadmapType) {
                case "icon":
                    texture = Laya.loader.getRes(`atlas/fantan_roadmap_items/fantan_${cell.value}.png`);
                    break;
                case "text":
                    let text = cell.value % 2 === 0 ? "even" : "odd";
                    texture = Laya.loader.getRes(`resources/fantan_${text}.png`);
                    break;
                default:
                    break;
            }
            if (texture) {
                this.roadmapSprite.graphics.drawImage(texture, centerX, centerY, this.drawWidth * 0.8, this.drawWidth * 0.8);
            }
        }

        this.roadmapSprite.width = maxIndex * this.cmdWidth
        Laya.timer.frameOnce(1, this, () => {
            this.roadmapPanel.refresh();
            this.roadmapPanel.scrollTo(this.cmdWidth * colIndex, 0);
        });
    }
}