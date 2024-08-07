const { regClass, property } = Laya;

const coinArray = [
    {
        skin: "resources/coins/B_01.png"
    },
    {
        skin: "resources/coins/B_05.png"
    },
    {
        skin: "resources/coins/B_10.png"
    },
    {
        skin: "resources/coins/B_20.png"
    },
    {
        skin: "resources/coins/B_50.png"
    },
    {
        skin: "resources/coins/B_100.png"
    },
    {
        skin: "resources/coins/B_500.png"
    },
    {
        skin: "resources/coins/B_1K.png"
    },
    {
        skin: "resources/coins/B_5K.png"
    }, {
        skin: "resources/coins/B_10K.png"
    },
    {
        skin: "resources/coins/B_20K.png"
    },
    {
        skin: "resources/coins/B_50K.png"
    },
    {
        skin: "resources/coins/B_1M.png"
    },
    {
        skin: "resources/coins/B_5M.png"
    }, {
        skin: "resources/coins/B_10M.png"
    },
    {
        skin: "resources/coins/B_20M.png"
    },
    {
        skin: "resources/coins/B_50M.png"
    }
]

@regClass()
export class List extends Laya.Script {
    coinList: Laya.List
    leftBtn: Laya.Button
    rightBtn: Laya.Button

    onEnable(): void {
        this.coinList = this.owner.getChildByName("List") as Laya.List
        this.coinList.array = coinArray
        this.coinList.selectedIndex = 0
        this.coinList.renderHandler = new Laya.Handler(this, (item: Laya.Box, idx: number) => {
            item.bgColor = null
            if (this.coinList.selectedIndex === idx) {
                item.bgColor = "#ffffff"
            }
            const Img = item.getChildByName("Image") as Laya.Image
            Img.skin = this.coinList.getItem(idx).skin
        })

        this.coinList.selectHandler = new Laya.Handler(this, (index: number) => {
            this.selectCoin(index)
        })

        this.leftBtn = this.owner.getChildByName("leftBtn") as Laya.Button
        this.rightBtn = this.owner.getChildByName("rightBtn") as Laya.Button

        this.leftBtn.on(Laya.Event.CLICK, () => {
            this.coinList.selectedIndex -= 1
            if (this.coinList.selectedIndex <= -1) {
                this.coinList.selectedIndex = 0
            }
            this.selectCoin(this.coinList.selectedIndex)
        })

        this.rightBtn.on(Laya.Event.CLICK, () => {
            this.coinList.selectedIndex += 1
            if (this.coinList.selectedIndex >= coinArray.length - 1) {
                this.coinList.selectedIndex = coinArray.length - 1
            }
            this.selectCoin(this.coinList.selectedIndex)
        })
    }

    selectCoin(index: number) {
        const cell = this.coinList.cells[0]
        this.coinList.scrollBar.value = (cell.width + this.coinList.spaceX) * (index - 3)
    }
}