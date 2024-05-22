const { regClass, property } = Laya;

@regClass()
export class Notification extends Laya.Script {
    declare owner: Laya.Box
    private notificationContainer: Laya.Box
    private addBtn: Laya.Button
    private _notificationPosition: "topright" | "bottomright" | "bottomleft" | "topleft" = "topright"
    private _notificationList: Laya.Box[] = []
    private _itemPosition: number
    private _canInitItem: boolean = true

    onEnable(): void {
        this.ininNotificationContainer()
        this.addBtn = this.owner.getChildByName("addBtn") as Laya.Button
        this.addBtn.clickHandler = new Laya.Handler(this, this.initNotificationItem)
    }

    ininNotificationContainer(): void {
        this.notificationContainer = new Laya.Box()
        this.notificationContainer.width = this.owner.width * 0.15
        this.notificationContainer.height = this.owner.height
        switch (this._notificationPosition) {
            case "topright":
                this.notificationContainer.top = 0
                this.notificationContainer.right = 0
                this._itemPosition = this.notificationContainer.width
                break;
            case "bottomright":
                this.notificationContainer.bottom = 0
                this.notificationContainer.right = 0
                break;
            case "bottomleft":
                this.notificationContainer.bottom = 0
                this.notificationContainer.left = 0
                break;
            case "topleft":
                this.notificationContainer.top = 0
                this.notificationContainer.left = 0
                break;
            default:
                break;
        }
        this.owner.addChild(this.notificationContainer)
    }

    initNotificationItem(ms: number = 5000): void {
        if (!this._canInitItem) return
        this._canInitItem = false
        let notification: Laya.Box
        Laya.loader.load("notification/NotificationItem.lh").then((res) => {
            notification = <Laya.Box>res.create()
            notification.name = `NotiBox${this._notificationList.length}`
            this.notificationContainer.addChild(notification)
            this._notificationList.push(notification)
            this.addNotiAni(notification).then(() => {
                this.closeNotification(notification, ms)
                this._canInitItem = true
            })
        })
    }

    addNotiAni(notification: Laya.Box): Promise<void> {
        return new Promise((resolve) => {
            const y = notification.height * (this._notificationList.length - 1)
            Laya.Tween.from(notification, { x: this.owner.width - this._itemPosition, y: y }, 100, Laya.Ease.linearNone).to(notification, { x: 0, y: y }, 300, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                resolve()
            }), 100);
        })
    }

    closeNotification(noti: Laya.Box, ms: number = 1000): void {
        Laya.timer.once(ms, this, () => {
            Laya.Tween.to(noti, { y: this.notificationContainer.height - this.owner.height, alpha: 0 }, 200, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                noti.removeSelf()
                const idx = this._notificationList.findIndex((item) => item.name === noti.name)
                this._notificationList.splice(idx, 1)
                this.RefreshTweenAni()
            }));
        })
    }

    RefreshTweenAni(): void {
        const newPositions = this.calculateItemPositions();
        this._notificationList.forEach((item, i) => {
            const newPos = newPositions[i];
            Laya.Tween.to(item, { x: newPos.x, y: newPos.y }, 200, Laya.Ease.linearIn);
        });
    }

    calculateItemPositions(): { x: number, y: number }[] {
        const positions: { x: number, y: number }[] = [];
        this._notificationList.forEach((item, i) => {
            let x = 0
            let y = i * (item.height) + 4;
            positions.push({ x, y });
        })
        return positions;
    }
}