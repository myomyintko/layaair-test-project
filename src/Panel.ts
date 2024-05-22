const { regClass, property } = Laya;

@regClass()
export class Panel extends Laya.Script {
    declare owner: Laya.Box;
    panel: Laya.Panel;
    addFirstBtn: Laya.Button;
    addLastBtn: Laya.Button;
    private itemWidth: number = 490;
    private itemHeight: number = 240;
    private space: number = 10;
    private items: Laya.Box[] = [];
    private itemCount: number = 0
    scale: number = 1

    onEnable(): void {
        this.addFirstBtn = this.owner.getChildByName("addFirst") as Laya.Button;
        this.addFirstBtn.clickHandler = new Laya.Handler(this, this.addFirstFunc);
        this.addLastBtn = this.owner.getChildByName("addLast") as Laya.Button;
        this.addLastBtn.clickHandler = new Laya.Handler(this, this.addLastFunc);
        this.panel = this.owner.getChildByName("Panel") as Laya.Panel;
        this.panel.scrollType = Laya.ScrollType.Vertical;
        this.scale = ((this.panel.width / 2) - this.space) / this.itemWidth

        this.addFirstFunc = this.addFirstFunc.bind(this);
        this.addLastFunc = this.addLastFunc.bind(this);
        this.resetPanle = this.resetPanle.bind(this);
    }

    addLastFunc(): void {
        const newItem = new Laya.Box();
        this.itemCount += 1
        newItem.name = `Box${this.itemCount}`
        newItem.size(this.itemWidth, this.itemHeight);
        newItem.scale(this.scale, this.scale)
        newItem.graphics.drawRect(0, 0, this.itemWidth, this.itemHeight, "#ffffff");
        const centerX = this.itemWidth / 2
        const centerY = this.itemHeight / 2
        newItem.graphics.fillText(newItem.name, centerX, centerY, "20px Arial", "#000000", "center 1")
        newItem.on(Laya.Event.CLICK, this, this.checkIdx, [newItem])
        this.items.push(newItem);
        this.panel.addChild(newItem);
        newItem.alpha = 0;
        Laya.Tween.to(newItem, { alpha: 1 }, 300, Laya.Ease.linearNone);
        this.layoutItems()
    }

    addFirstFunc(): void {
        const newItem = new Laya.Box();
        this.itemCount += 1
        newItem.name = `Box${this.itemCount}`
        newItem.size(this.itemWidth, this.itemHeight);
        newItem.scale(this.scale, this.scale)
        newItem.graphics.drawRect(0, 0, this.itemWidth, this.itemHeight, "#ffffff");
        const centerX = this.itemWidth / 2
        const centerY = this.itemHeight / 2
        newItem.graphics.fillText(newItem.name, centerX, centerY, "20px Arial", "#000000", "center 1")
        newItem.on(Laya.Event.CLICK, this, this.checkIdx, [newItem])
        this.items.unshift(newItem);
        this.panel.addChildAt(newItem, 0);
        newItem.alpha = 0;
        Laya.Tween.to(newItem, { alpha: 1 }, 300, Laya.Ease.linearNone);
        this.layoutItems()
    }

    resetPanle(): void {
        const numRows = Math.ceil(this.items.length / 2);
        this.panel.height = this.itemHeight * numRows

        this.panel.refresh();
        this.panel.vScrollBar.value = this.panel.vScrollBar.min
    }

    checkIdx(item: Laya.Box) {
        this.removeItem(this.panel.getChildIndex(item))
    }

    removeItem(index: number): void {
        const item = this.items[index];
        if (item) {
            this.panel.removeChild(item);
            this.items.splice(index, 1);
            const newPositions = this.calculateItemPositions();
            for (let i = 0; i < this.items.length; i++) {
                const newItem = this.items[i];
                const newPos = newPositions[i];
                Laya.Tween.to(newItem, { x: newPos.x, y: newPos.y }, 100, Laya.Ease.linearNone, null, i * 50, false, false);
            }

            const numRows = Math.ceil(this.items.length / 2);
            this.panel.height = this.itemHeight * numRows
            this.resetPanle();
        }
    }

    calculateItemPositions(): { x: number, y: number }[] {
        const positions: { x: number, y: number }[] = [];
        for (let i = 0; i < this.items.length; i++) {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const x = col * (this.itemWidth * this.scale + this.space * this.scale)
            const y =  row * (this.itemHeight * this.scale + this.space * this.scale);
            positions.push({ x, y });
        }
        return positions;
    }

    private layoutItems(): void {
        this.items.forEach((item, i) => {
            const row = Math.floor(i / 2);
            const col = i % 2;
            item.x = col * (this.itemWidth * this.scale + this.space * this.scale)
            item.y =  row * (this.itemHeight * this.scale + this.space * this.scale);
        })
        this.resetPanle();
    }
}
