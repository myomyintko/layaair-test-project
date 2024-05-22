const { regClass, property } = Laya;

@regClass()
export class CountDown extends Laya.Script {
    declare owner: Laya.Box;
    private aniCtrl: Laya.Animation;

    public initUI() {
        this.aniCtrl = this.owner.getChildByName("base").getChildByName("aniCtrl") as Laya.Animation;
    }

    public initOnline(): void {
        const colorFilter = new Laya.ColorFilter()
        colorFilter.setColor("#1aff2e")
        colorFilter.adjustColor(50, 0, -50, 0)
        this.aniCtrl.filters = [colorFilter]
        this.aniCtrl.scale(0.12, 0.12)
        this.loadAnimation("atlas/waiting.atlas", "waiting")
    }

    public initWaiting(): void {
        this.aniCtrl.filters = null
        this.aniCtrl.scale(0.12, 0.12)
        this.loadAnimation("atlas/waiting.atlas", "waiting")
    }

    public initOpenCard(): void {
        this.aniCtrl.filters = null
        this.aniCtrl.scale(0.18, 0.18)
        this.loadAnimation("atlas/opencard.atlas", "opencard")
    }

    public initOffline(): void {
        const colorFilter = new Laya.ColorFilter()
        colorFilter.setColor("#ff0000")
        colorFilter.adjustColor(100, 0, -50, 0)
        this.aniCtrl.filters = [colorFilter]
        this.aniCtrl.scale(0.12, 0.12)
        this.loadAnimation("atlas/waiting.atlas", "waiting")
    }

    public initCountDown(fireCD: number): void {
        this.aniCtrl.filters = []
        this.aniCtrl.scale(0.2, 0.2)
        this.loadAnimation("atlas/countdown_time.atlas", "countdown", false, (fireCD * 1000) / 360)
    }

    public initNewShoe(): void {
        this.aniCtrl.scale(0.9, 0.9)
        this.aniCtrl.interval = 200
        this.aniCtrl.set_width(50)
        this.aniCtrl.set_height(50)
        this.aniCtrl.anchorX = 0.5
        this.aniCtrl.anchorY = 0.5
        const frames: string[] = ["resources/newShoe.png"]
        this.aniCtrl.loadImages(frames, "newshoe").play(0, false)
    }

    private loadAnimation(url: string, name: string, loop: boolean = true, interval: number = 100): void {
        Laya.loader.load(url).then(res => {
            if (res.frames.length <= 0) return
            this.aniCtrl.set_width(res.frames[0].sourceWidth)
            this.aniCtrl.set_height(res.frames[0].sourceHeight)
            this.aniCtrl.anchorX = 0.5
            this.aniCtrl.anchorY = 0.5
            this.aniCtrl.interval = interval
            const frames: string[] = []
            res.frames.forEach((element: any) => {
                frames.push(element.url)
            });
            this.aniCtrl.loadImages(frames, name).play(0, loop)
        })
    }
}