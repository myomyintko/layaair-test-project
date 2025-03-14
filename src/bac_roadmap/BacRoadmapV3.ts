const { regClass } = Laya;
import { BacRoadmapV3Base } from "./BacRoadmapV3.generated";

enum BaccaratResult {
    Banker = "B",
    Player = "P",
    Tie = "T",

    BankerPair = "K",
    PlayerPair = "L",

    Big = "G",
    Small = "S",

    BankerNatural = "N",
    PlayerNatural = "R",

    SuperSix = "X",

    AnyPair = "Y",

    PerfectPair = "Z",

    BankerDragonBonus = "D",
    PlayerDragonBonus = "F"
}

interface bacResultImgs {
    [key: string]: string
}

const bacResultBreadPlateImgData: bacResultImgs = {
    // banker
    [BaccaratResult.Banker]: "resources/game_icons/type61.png",
    [BaccaratResult.Banker + BaccaratResult.BankerPair]: "resources/game_icons/type62.png",
    [BaccaratResult.Banker + BaccaratResult.PlayerPair]: "resources/game_icons/type63.png",
    [BaccaratResult.Banker + BaccaratResult.BankerPair + BaccaratResult.PlayerPair]: "resources/game_icons/type64.png",
    // player
    [BaccaratResult.Player]: "resources/game_icons/type65.png",
    [BaccaratResult.Player + BaccaratResult.BankerPair]: "resources/game_icons/type66.png",
    [BaccaratResult.Player + BaccaratResult.PlayerPair]: "resources/game_icons/type67.png",
    [BaccaratResult.Player + BaccaratResult.BankerPair + BaccaratResult.PlayerPair]: "resources/game_icons/type68.png",
    // tie
    [BaccaratResult.Tie]: "resources/game_icons/type69.png",
    [BaccaratResult.Tie + BaccaratResult.BankerPair]: "resources/game_icons/type70.png",
    [BaccaratResult.Tie + BaccaratResult.PlayerPair]: "resources/game_icons/type71.png",
    [BaccaratResult.Tie + BaccaratResult.BankerPair + BaccaratResult.PlayerPair]: "resources/game_icons/type72.png",
}

const bacResultBigRoadmImgData: bacResultImgs = {
    // banker
    [BaccaratResult.Banker]: "resources/game_icons/type01.png",
    [BaccaratResult.Banker + BaccaratResult.BankerPair]: "resources/game_icons/type02.png",
    [BaccaratResult.Banker + BaccaratResult.PlayerPair]: "resources/game_icons/type03.png",
    [BaccaratResult.Banker + BaccaratResult.BankerPair + BaccaratResult.PlayerPair]: "resources/game_icons/type04.png",
    [BaccaratResult.Banker + BaccaratResult.Tie]: "resources/game_icons/type05.png",
    [BaccaratResult.Banker + BaccaratResult.Tie + BaccaratResult.BankerPair]: "resources/game_icons/type06.png",
    [BaccaratResult.Banker + BaccaratResult.Tie + BaccaratResult.PlayerPair]: "resources/game_icons/type07.png",
    [BaccaratResult.Banker + BaccaratResult.Tie + BaccaratResult.BankerPair + BaccaratResult.PlayerPair]: "resources/game_icons/type08.png",

    // player
    [BaccaratResult.Player]: "resources/game_icons/type09.png",
    [BaccaratResult.Player + BaccaratResult.BankerPair]: "resources/game_icons/type10.png",
    [BaccaratResult.Player + BaccaratResult.PlayerPair]: "resources/game_icons/type11.png",
    [BaccaratResult.Player + BaccaratResult.BankerPair + BaccaratResult.PlayerPair]: "resources/game_icons/type12.png",
    [BaccaratResult.Player + BaccaratResult.Tie]: "resources/game_icons/type13.png",
    [BaccaratResult.Player + BaccaratResult.Tie + BaccaratResult.BankerPair]: "resources/game_icons/type14.png",
    [BaccaratResult.Player + BaccaratResult.Tie + BaccaratResult.PlayerPair]: "resources/game_icons/type15.png",
    [BaccaratResult.Player + BaccaratResult.Tie + BaccaratResult.BankerPair + BaccaratResult.PlayerPair]: "resources/game_icons/type16.png",
}

const bacResultBigEyeBoyImgData: bacResultImgs = {
    "R": "resources/game_icons/type85.png",
    "B": "resources/game_icons/type86.png",
}

const bacResultSmallRoadImgData: bacResultImgs = {
    "R": "resources/game_icons/type81.png",
    "B": "resources/game_icons/type82.png",
}

const bacResultCockroachPigImgData: bacResultImgs = {
    "R": "resources/game_icons/type83.png",
    "B": "resources/game_icons/type84.png",
}

@regClass()
export class BacRoadmapV3 extends BacRoadmapV3Base {
    private roadmap: Roadmap
    private roadmapRows: number = 6
    private breadPlateCols: number = 8
    private bigRoadCols: number = 20
    private bigEyeRoadCols: number = 20
    private threestarRoadCols: number = 10
    private smallRoadCols: number = 20
    private cockroachRoadCols: number = 20
    private isResetting: boolean = false


    onEnable(): void {
        Laya.loader.load("resources/game_icons.atlas").then((res) => {
            this.roadmap = new Roadmap([
                "B",
                "B",
            ])
            this.setupControls()
            this.setupRoadmapUI()
            this.SetHistoryData()
            console.log(this.roadmap)
        })
    }

    private setupControls(): void {
        this.resultLbl.text = ""
        let resultNumber: string = "";
        let tempArray: string[] = [];

        const buttons = {
            player: this.playerBtn,
            banker: this.bankerBtn,
            tie: this.tieBtn,
            playerPair: this.playerPairBtn,
            bankerPair: this.bankerPairBtn,
            playerBonus: this.playerBonusBtn,
            super6: this.super6Btn,
            bankerBonus: this.bankerBonusBtn,
            playerNatural: this.playerNaturalBtn,
            big: this.bigBtn,
            small: this.smallBtn,
            bankerNatural: this.bankerNaturalBtn
        };

        type ButtonRef = Laya.Button;
        interface BetTypeGroups {
            [key: string]: ButtonRef[];
        }

        const betTypeGroups: BetTypeGroups = {
            [BaccaratResult.Player]: [buttons.player, buttons.banker, buttons.tie, buttons.super6, buttons.bankerBonus, buttons.bankerNatural],
            [BaccaratResult.Banker]: [buttons.banker, buttons.player, buttons.tie, buttons.playerBonus, buttons.playerNatural],
            [BaccaratResult.Tie]: [buttons.tie, buttons.player, buttons.banker, buttons.super6, buttons.playerBonus, buttons.bankerBonus],
            [BaccaratResult.PlayerPair]: [buttons.playerPair],
            [BaccaratResult.BankerPair]: [buttons.bankerPair],
            [BaccaratResult.PlayerDragonBonus]: [buttons.playerBonus, buttons.bankerBonus],
            [BaccaratResult.BankerDragonBonus]: [buttons.bankerBonus, buttons.playerBonus],
            [BaccaratResult.Big]: [buttons.big, buttons.small],
            [BaccaratResult.Small]: [buttons.small, buttons.big],
            [BaccaratResult.PlayerNatural]: [buttons.playerNatural],
            [BaccaratResult.BankerNatural]: [buttons.bankerNatural],
            [BaccaratResult.SuperSix]: [buttons.super6, buttons.player, buttons.playerBonus, buttons.playerNatural]
        };

        const disableButtons = (selectedBetType: BaccaratResult) => {
            const buttonsToDisable = betTypeGroups[selectedBetType] || [];
            buttonsToDisable.forEach(button => {
                button.disabled = true;
            });
        }

        const betBtnHandler = (betType: BaccaratResult) => {
            return new Laya.Handler(this, () => {
                disableButtons(betType);
                const betTypeName = betType;
                this.resultLbl.text += " " + betTypeName;
                resultNumber += betType;
            })
        }

        this.playerPairBtn.clickHandler = betBtnHandler(BaccaratResult.PlayerPair)

        this.playerBtn.clickHandler = betBtnHandler(BaccaratResult.Player)

        this.tieBtn.clickHandler = betBtnHandler(BaccaratResult.Tie)

        this.bankerBtn.clickHandler = betBtnHandler(BaccaratResult.Banker)

        this.bankerPairBtn.clickHandler = betBtnHandler(BaccaratResult.BankerPair)

        this.playerBonusBtn.clickHandler = betBtnHandler(BaccaratResult.PlayerDragonBonus)

        this.super6Btn.clickHandler = betBtnHandler(BaccaratResult.SuperSix)

        this.bankerBonusBtn.clickHandler = betBtnHandler(BaccaratResult.BankerDragonBonus)

        this.playerNaturalBtn.clickHandler = betBtnHandler(BaccaratResult.PlayerNatural)

        this.bigBtn.clickHandler = betBtnHandler(BaccaratResult.Big)

        this.smallBtn.clickHandler = betBtnHandler(BaccaratResult.Small)

        this.bankerNaturalBtn.clickHandler = betBtnHandler(BaccaratResult.BankerNatural)

        const reset = () => {
            resultNumber = ""
            this.resultLbl.text = ""
            Object.values(buttons).forEach(button => {
                button.disabled = false;
            })
        }

        this.cancelBtn.clickHandler = new Laya.Handler(this, () => {
            reset()
            this.roadmap = new Roadmap()
        })

        this.confirmBtn.clickHandler = new Laya.Handler(this, () => {
            tempArray.push(resultNumber)
            this.roadmap.AddResult(resultNumber)
            console.log(this.roadmap)
            this.SetHistoryData()
            reset()
        })

        this.clearBtn.clickHandler = new Laya.Handler(this, () => {
            reset()
            this.Reset()
            this.roadmap.Reset()
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
        this.three_star_road_panel.scrollType = Laya.ScrollType.Horizontal
        this.three_star_road_panel.elasticEnabled = true
        this.three_star_road_panel.mouseEnabled = true
        const { width: threestarRoadWidth, height: threestarRoadHeight } = this.three_star_road_panel
        this.bead_plate_road_sprite.size(threestarRoadWidth, threestarRoadHeight)
        this.setupControl(this.three_star_road_panel, this.roadmapRows, this.cockroachRoadCols)

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

    SetHistoryData() {
        console.time("init")

        for (let i = 0; i <= 10; i++) {
            this.GetHistoryFragment1(this.roadmap.breadplateMatrix, this.breadPlateCols, this.roadmapRows, this.bead_plate_road_panel, this.SetHistoryItem1)
            this.GetHistoryFragment2(this.roadmap.bigRoadMatrix, this.bigRoadCols, this.roadmapRows, this.big_road_panel, this.SetHistoryItem2)
            this.GetHistoryFragment2(this.roadmap.bigEyeBoyMatrix, this.bigEyeRoadCols, this.roadmapRows, this.big_eye_road_panel, this.SetHistoryItem3)
            this.GetHistoryFragment2(this.roadmap.smallRoadMatrix, this.smallRoadCols, this.roadmapRows, this.small_road_panel, this.SetHistoryItem4)
            this.GetHistoryFragment2(this.roadmap.cockroachPigMatrix, this.cockroachRoadCols, this.roadmapRows, this.cockroach_road_panel, this.SetHistoryItem5)
            this.GetHistoryFragment1(this.roadmap.threestarMatrix, this.threestarRoadCols, 3, this.three_star_road_panel, this.SetHistoryItem2)
            // this.setWenluData()
        }
        console.timeEnd("init")
    }

    Reset() {
        // this.SetHistoryData()
        this.bead_plate_road_sprite.graphics.clear()
        this.big_road_sprite.graphics.clear()
        this.big_eye_road_sprite.graphics.clear()
        this.small_road_sprite.graphics.clear()
        this.cockroach_road_sprite.graphics.clear()
        this.three_star_road_sprite.graphics.clear()
    }

    private static getBaccaratResults(key: number): BaccaratResult[] {
        const results: BaccaratResult[] = [];

        for (const result in BaccaratResult) {
            if (isNaN(Number(result))) {
                continue;
            }

            if ((key && result) !== null) {
                results.push(result as BaccaratResult);
            }
        }

        return results;
    }

    SetHistoryItem1(cmd: Laya.DrawImageCmd, result: string) {
        if (cmd) {
            const validResults = [BaccaratResult.Banker, BaccaratResult.Player, BaccaratResult.Tie, BaccaratResult.BankerPair, BaccaratResult.PlayerPair];
            let resultKey = "";

            validResults.forEach((validResult) => {
                if (result.includes(validResult)) {
                    resultKey += validResult;
                }
            });

            const imgUrl = bacResultBreadPlateImgData[resultKey];
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl);
            }
        }
    }

    SetHistoryItem2(cmd: Laya.DrawImageCmd, result: string): void {
        if (cmd) {
            const validResults = [BaccaratResult.Banker, BaccaratResult.Player, BaccaratResult.Tie, BaccaratResult.BankerPair, BaccaratResult.PlayerPair];
            let resultKey = "";

            validResults.forEach((validResult) => {
                if (result.includes(validResult)) {
                    resultKey += validResult;
                }
            });
            const imgUrl = bacResultBigRoadmImgData[resultKey]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    GetHistoryFragment1(arr: string[], col: number, row: number, panel: Laya.Panel, callback: (cmd: Laya.DrawImageCmd, result: string) => void, isAsk: boolean = false): void {
        const matrix = [];
        for (let i = 0; i < arr.length; i += row) {
            matrix.push(arr.slice(i, i + row));
        }
        const lastX = matrix.length - 1;
        const lastY = matrix[lastX].length - 1
        this.fillTexture(matrix, row, col, panel, callback, isAsk, lastX, lastY)
    }

    GetHistoryFragment2(arr: string[][], col: number, row: number, panel: Laya.Panel, callback: (cmd: Laya.DrawImageCmd, result: string) => void, isAsk: boolean = false): void {
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
        // console.log(matrix)
        this.fillTexture(matrix, row, col, panel, callback, isAsk, x, y)
    }

    SetHistoryItem3(cmd: Laya.DrawImageCmd, result: string): void {
        if (cmd) {
            const imgUrl = bacResultBigEyeBoyImgData[result]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    SetHistoryItem4(cmd: Laya.DrawImageCmd, result: string): void {
        if (cmd) {
            const imgUrl = bacResultSmallRoadImgData[result]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    SetHistoryItem5(cmd: Laya.DrawImageCmd, result: string): void {
        if (cmd) {
            const imgUrl = bacResultCockroachPigImgData[result]
            if (imgUrl) {
                cmd.texture = Laya.loader.getRes(imgUrl)
            }
        }
    }

    private fillTexture(matrix: string[][], row: number, col: number, panel: Laya.Panel, callback: (cmd: Laya.DrawImageCmd, result: string) => void, isAsk: boolean, lastX: number = -1, lastY: number = -1): void {
        try {
            const sprite = panel.getChildAt(0) as Laya.Sprite;
            sprite.graphics.clear();

            const panelParent = panel.parent as Laya.Box
            const cmdWidth = panelParent.width / col;
            const cmdHeight = panelParent.height / row;
            const drawWidth = Math.min(cmdHeight, cmdWidth);
            let lastCmd: Laya.DrawImageCmd | null = null;
            panel.set_width(cmdWidth * (col - 1))

            matrix.forEach((col: string[], colIndex: number) => {
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
                        // this.Reset()
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

class Roadmap {
    result: string[] = []
    breadplateMatrix: string[] = []
    bigRoadMatrix: string[][] = []
    bigEyeBoyMatrix: string[][] = []
    threestarMatrix: string[] = []
    smallRoadMatrix: string[][] = []
    cockroachPigMatrix: string[][] = []

    playerAsk3: string = ""
    playerAsk4: string = ""
    playerAsk5: string = ""

    bankerAsk3: string = ""
    bankerAsk4: string = ""
    bankerAsk5: string = ""

    private bigRoadPreviousIdentity: BaccaratResult = null
    private startWithTie: boolean = false
    private hasTieBeenAdded: boolean = false
    private bigEyeRoadPreviousIdentity: string = ""
    private smallRoadPreviousIdentity: string = ""
    private cockraochRoadPreviousIdentity: string = ""

    constructor(_results: string[] = []) {
        this.result = _results
        this.result.forEach(this.AddResult.bind(this))
    }

    private key2Result(key: string): BaccaratResult {
        if (!key) return
        const validResults = [BaccaratResult.Banker, BaccaratResult.Player, BaccaratResult.Tie, BaccaratResult.BankerPair, BaccaratResult.PlayerPair];
        let resultKey = "";

        validResults.forEach((validResult) => {
            if (key.includes(validResult)) {
                resultKey += validResult;
            }
        });

        return resultKey as BaccaratResult
        // if ((key && BaccaratResult.Banker) === resultKey) {
        //     return BaccaratResult.Banker;
        // }
        // if ((key && BaccaratResult.Player) === resultKey) {
        //     return BaccaratResult.Player;
        // }
        // if ((key && BaccaratResult.Tie) === resultKey) {
        //     return BaccaratResult.Tie;
        // }
    }

    AddResult(key: string): void {
        // console.clear()
        this.result.push(key)
        this.addBreadPlateRoad(key)
        this.addBigRoad(key)

        const formattedBigRoadMatrix = this.formatBigRoad()

        this.bigEyeBoyMatrix = []
        this.bigEyeRoadPreviousIdentity = null
        this.traverseBigRoadScheme(formattedBigRoadMatrix, 0, 2, this.addBigEyeRoad.bind(this))


        this.threestarMatrix = []
        this.threestarMatrix = formattedBigRoadMatrix.flat().filter(num => num)

        this.smallRoadMatrix = []
        this.smallRoadPreviousIdentity = null
        this.traverseBigRoadScheme(formattedBigRoadMatrix, 1, 3, this.addSmallRoad.bind(this))

        this.cockroachPigMatrix = []
        this.cockraochRoadPreviousIdentity = null
        this.traverseBigRoadScheme(formattedBigRoadMatrix, 2, 4, this.addCockroachRoad.bind(this))

        // this.setPrediction(BaccaratResult.Player, 'player');
        // this.setPrediction(BaccaratResult.Banker, 'banker');
    }

    Reset(): void {
        this.result = []
        this.breadplateMatrix = []
        this.bigRoadMatrix = []
        this.bigEyeBoyMatrix = []
        this.smallRoadMatrix = []
        this.cockroachPigMatrix = []
        this.threestarMatrix = []

        this.bigRoadPreviousIdentity = null
        this.hasTieBeenAdded = false
    }

    private addBreadPlateRoad(key: string): void {
        this.breadplateMatrix.push(key)
    }

    private popBreadPlateRoad(): void {
        this.breadplateMatrix.pop()
    }

    private addBigRoad(key: string): void {
        const identity = this.key2Result(key);
        if (!identity) {
            console.warn(`${key} is not a valid key`);
            return;
        }

        const lastRowIndex = this.bigRoadMatrix.length - 1;
        let lastRow = this.bigRoadMatrix[lastRowIndex];

        // If current is not a tie but the previous was a tie, add the tie modifier to the key
        if (identity !== BaccaratResult.Tie && this.startWithTie && !this.hasTieBeenAdded) {
            key += BaccaratResult.Tie;
            this.hasTieBeenAdded = true;
        }

        // If the current identity is Tie
        if (identity === BaccaratResult.Tie) {
            if (!this.bigRoadPreviousIdentity) {
                // First entry is a Tie
                this.startWithTie = true;
                this.hasTieBeenAdded = false;
            }
            if (this.bigRoadPreviousIdentity !== BaccaratResult.Tie && !this.hasTieBeenAdded) {
                // If the previous identity was not Tie and a Tie hasn't been added yet, add it to the last item
                if (lastRow && lastRow.length > 0 && !this.startWithTie) {
                    lastRow[lastRow.length - 1] += BaccaratResult.Tie;
                    this.hasTieBeenAdded = true;
                }
            }
        } else if (identity === this.bigRoadPreviousIdentity) {
            // If current identity is the same as the previous (not Tie)
            this.hasTieBeenAdded = false;
            lastRow.push(key);
        } else {
            // If the identity is different from the previous one
            if (this.startWithTie) {
                // If the round started with a Tie, reset flags
                this.hasTieBeenAdded = true;
                this.startWithTie = false;
            } else {
                this.hasTieBeenAdded = false;
            }
            // Start a new row with the current key
            lastRow = [key];
            this.bigRoadMatrix.push(lastRow);
        }

        // Update the previous identity if the current row has items
        if (lastRow && lastRow.length > 0) {
            if (identity !== BaccaratResult.Tie) {
                this.bigRoadPreviousIdentity = identity;
            }
        } else {
            this.bigRoadPreviousIdentity = null;
        }
    }

    private popBigRoad(): void {
        if (this.bigRoadMatrix.length === 0) return;

        const lastRow = this.bigRoadMatrix[this.bigRoadMatrix.length - 1];
        lastRow.pop();

        if (lastRow.length === 0) {
            this.bigRoadMatrix.pop();
        }

        // Update previousIdentity
        if (this.bigRoadMatrix.length > 0 && this.bigRoadMatrix[this.bigRoadMatrix.length - 1].length > 0) {
            const lastRow = this.bigRoadMatrix[this.bigRoadMatrix.length - 1];
            this.bigRoadPreviousIdentity = this.key2Result(lastRow[lastRow.length - 1]);
        } else {
            this.bigRoadPreviousIdentity = null;
        }
    }

    private formatBigRoad(): string[][] {
        const col = 6
        let lastX = -1, lastY = -1, avaliableLength = col
        const matrix: string[][] = Array.from({ length: this.bigRoadMatrix.length }, () => Array(col).fill(0))

        this.bigRoadMatrix.forEach((row, rowIndex) => {
            avaliableLength = matrix[rowIndex].filter(item => !item).length - 1
            row.forEach((col, colIndex) => {
                lastX = rowIndex
                lastY = colIndex
                if (colIndex > avaliableLength) {
                    lastX = rowIndex + (colIndex - avaliableLength)
                    lastY = avaliableLength
                    if (!(matrix[lastX])) {
                        matrix[lastX] = Array(col).fill(null)
                    }
                }
                matrix[lastX][lastY] = col
            })
        })
        return matrix
    }

    private isValidIndex<T>(array: T[], index: number): boolean {
        return index >= 0 && index < array.length;
    }

    private getColumnLength(array: string[]): number {
        return array.reduce((total, element) => total + (element === null ? 1 : 0), 0)
    }

    private traverseBigRoadScheme(bigRoadMatrix: string[][], startIndex: number, margin: number, callback: (result: string) => void): void {
        bigRoadMatrix.forEach((col, colIndex) => {
            if (colIndex > startIndex) {
                col.forEach((cell, cellIndex) => {
                    if (!(colIndex === margin - 1 && cellIndex === 0) && cell) {
                        /**
                         * If first row, check the lengths of previous ${margin} columns
                         */
                        if (cellIndex === 0) {
                            /**
                             * Get the column exactly to the right
                             */
                            const prevColALength = this.getColumnLength(bigRoadMatrix[colIndex - 1])

                            /**
                             * Get the ${margin} column to the right
                             */
                            const prevColBLength = this.getColumnLength(bigRoadMatrix[colIndex - margin])
                            callback(prevColALength === prevColBLength ? "R" : "B")
                        } else {
                            /**
                             * If non first row, check the left col and the upper left column
                             */
                            const tempIdx = margin - 1
                            const leftColLowerIndex = this.isValidIndex(bigRoadMatrix[colIndex - tempIdx], cellIndex)
                            const leftColLowerIdentity = this.key2Result(bigRoadMatrix[colIndex - tempIdx][cellIndex])

                            const leftColUpperIndex = this.isValidIndex(bigRoadMatrix[colIndex - tempIdx], cellIndex - 1)
                            const leftColUpperIdentity = this.key2Result(bigRoadMatrix[colIndex - tempIdx][cellIndex - 1])

                            const isMatch = [
                                leftColLowerIndex === leftColUpperIndex,
                                leftColLowerIdentity === leftColUpperIdentity
                            ].every(Boolean);
                            callback(isMatch ? "R" : "B")
                        }
                    }
                })
            }
        })
    }

    private addBigEyeRoad(key: string): void {
        if (!["R", "B"].includes(key)) {
            console.warn(`${key} is not a valid color.`);
            return;
        }
        if (this.bigEyeBoyMatrix.length <= 0) {
            this.bigEyeBoyMatrix.push([key])
        } else {
            const lastRowIndex = this.bigEyeBoyMatrix.length - 1;
            if (this.bigEyeRoadPreviousIdentity === key) {
                this.bigEyeBoyMatrix[lastRowIndex].push(key)
            } else {
                this.bigEyeBoyMatrix.push([key])
            }
        }
        this.bigEyeRoadPreviousIdentity = key
    }

    private addSmallRoad(key: string): void {
        if (!["R", "B"].includes(key)) {
            console.warn(`${key} is not a valid color.`);
            return;
        }
        if (this.smallRoadMatrix.length <= 0) {
            this.smallRoadMatrix.push([key])
        } else {
            const lastRowIndex = this.smallRoadMatrix.length - 1;
            if (this.smallRoadPreviousIdentity === key) {
                this.smallRoadMatrix[lastRowIndex].push(key)
            } else {
                this.smallRoadMatrix.push([key])
            }
        }
        this.smallRoadPreviousIdentity = key
    }

    private addCockroachRoad(key: string): void {
        if (!["R", "B"].includes(key)) {
            console.warn(`${key} is not a valid color.`);
            return;
        }
        if (this.cockroachPigMatrix.length <= 0) {
            this.cockroachPigMatrix.push([key])
        } else {
            const lastRowIndex = this.cockroachPigMatrix.length - 1;
            if (this.cockraochRoadPreviousIdentity === key) {
                this.cockroachPigMatrix[lastRowIndex].push(key)
            } else {
                this.cockroachPigMatrix.push([key])
            }
        }
        this.cockraochRoadPreviousIdentity = key
    }

    // private setPrediction(result: BaccaratResult, prefix: 'player' | 'banker'): void {
    //     const { ask3, ask4, ask5 } = this.getPrediction(result);

    //     if (prefix === 'player') {
    //         this.playerAsk3 = ask3;
    //         this.playerAsk4 = ask4;
    //         this.playerAsk5 = ask5;
    //     } else if (prefix === 'banker') {
    //         this.bankerAsk3 = ask3;
    //         this.bankerAsk4 = ask4;
    //         this.bankerAsk5 = ask5;
    //     }
    // }

    // private getPrediction(winner: BaccaratResult) {
    //     this.addBreadPlateRoad(winner);
    //     this.addBigRoad(winner);

    //     const ask3 = this.predictRoad(this.bigRoadMatrix, 0, 1);
    //     const ask4 = this.predictRoad(this.bigRoadMatrix, 1, 2);
    //     const ask5 = this.predictRoad(this.bigRoadMatrix, 2, 3);

    //     console.log(this.breadplateMatrix);
    //     console.log(ask3, ask4, ask5);

    //     this.popBreadPlateRoad();
    //     this.popBigRoad();

    //     return { ask3, ask4, ask5 }; // Return the predictions directly
    // }

    // private predictRoad(matrix: number[][], startIndex: number, margin: number) {
    //     let x = matrix.length - 1;
    //     let y = matrix[x].length - 1;
    //     if (x > startIndex) {
    //         if (!(x === margin && y === 0) && matrix[x][y] !== 0) {
    //             if (y === 0) {
    //                 if (this.isValidIndex(matrix[x - (margin + 1)], 0) && matrix[x - 1].length === matrix[x - (margin + 1)].length) {
    //                     return 1;
    //                 } else {
    //                     return 2;
    //                 }
    //             } else {
    //                 const valid1 = this.isValidIndex(matrix[x - margin], y);
    //                 const valid2 = this.isValidIndex(matrix[x - margin], y - 1);
    //                 if (!valid1 && !valid2) {
    //                     return 1;
    //                 } else if (
    //                     valid1 &&
    //                     valid2 &&
    //                     this.key2Result(matrix[x - margin][y]) ===
    //                     this.key2Result(matrix[x - margin][y - 1])
    //                 ) {
    //                     return 1;
    //                 } else {
    //                     return 2;
    //                 }
    //             }
    //         }
    //     }
    //     return 0;
    // }

}