import { CountDown } from "./CountDown";

const { regClass, property } = Laya;

@regClass()
export class Main extends Laya.Script {
    declare owner: Laya.Scene;
    carouselContainer: Laya.Box;
    items: any[];
    numRows: number;
    numCols: number;
    panel: Laya.Panel;
    videoNode: Laya.VideoNode;

    // async onEnable(): Promise<void> {
    //     const countDown = this.owner.getChildByName("CountDown") as Laya.Box
    //     const countDownScript = countDown.getComponent(CountDown)
    //     countDownScript.initUI()
    //     while (true) {
    //         countDownScript.initOnline()
    //         await this.sleep(1000)
    //         countDownScript.initWaiting()
    //         await this.sleep(1000)
    //         countDownScript.initOpenCard()
    //         await this.sleep(1000)
    //         countDownScript.initCountDown(5)
    //         await this.sleep(5000)
    //         countDownScript.initNewShoe()
    //         await this.sleep(1000)
    //         countDownScript.initOffline()
    //         await this.sleep(1000)
    //     }
    // }

    // sleep(ms: number) {
    //     return new Promise((resolve) => setTimeout(resolve, ms));
    // }

    onEnable(): void {
        // this.owner.viewport = new Laya.Rectangle(0, 0, this.owner.width, this.owner.height)
        // this.owner.scrollRect = new Laya.Rectangle(0, 0, this.owner.width, this.owner.height)
        // this.owner.graphics.drawRect(0, 0, this.owner.width, this.owner.height, "#000000")
        // this.playVideo()
        // this.loadSVG()
    }

    loadSVG(): void {
        const sprite = new Laya.Sprite()
        sprite.width = 200
        sprite.height = 200
        Laya.loader.load("resources/n_loading.svg",Laya.Loader.IMAGE).then((res) => {
            sprite.graphics.drawImage(res, 0, 0, sprite.width, sprite.height)
        })
        this.owner.addChild(sprite)
    }

    onMouseClick(evt: Laya.Event): void {
        // if (evt.type === Laya.Event.CLICK) {
        //     this.openDialog()
        // }
        // this.videoNode.play()
        // console.log(this.videoNode.readyState);
    }

    openDialog(): void {
        const mainPage = Laya.stage.getChildByName("root").getChildByName("Scene2D").getChildByName("Box") as Laya.Box

        Laya.loader.load("Dialog.lh").then((res) => {
            const dialog = <Laya.Dialog>res.create()
            dialog.isModal = false
            dialog.popupEffect = new Laya.Handler(dialog, () => {
                Laya.Tween.from(dialog, { x: (this.owner.width - dialog.width) / 2, y: this.owner.height, alpha: 0 }, 50, Laya.Ease.linearNone)
                    .to(dialog, { y: (this.owner.height - mainPage.height) }, 1000, Laya.Ease.linearNone, Laya.Handler.create(dialog, () => {
                        Laya.Tween.from(dialog, { scaleX: 0.5, scaleY: 0.5, alpha: 0 }, 1000, Laya.Ease.linearNone)
                            .to(dialog, { x: (this.owner.width - dialog.width) / 2, y: (this.owner.height - dialog.height) / 2, scaleX: 1, scaleY: 1, alpha: 1 }, 1000, Laya.Ease.linearIn);
                    }));

            })

            // dialog.x = (this.owner.width - dialog.width) / 2
            // dialog.y = (this.owner.height - mainPage.height)

            // dialog.closeEffect = new Laya.Handler(dialog, () => {
            //     Laya.Tween.to(dialog, { x: (this.owner.width - dialog.width) / 2, y: this.owner.height, scaleX: 0.5, scaleY: 0.5, alpha: 0 }, 50, Laya.Ease.linearOut, Laya.Handler.create(dialog, () => {
            //         dialog.removeSelf()
            //     }))
            // })

            dialog.open()
            dialog.closeHandler = Laya.Handler.create(dialog, () => {
                dialog.removeSelf()
            })

            const closeBtn = dialog.getChildByName("closeBtn") as Laya.Button
            closeBtn.clickHandler = new Laya.Handler(dialog, () => {
                // dialog.removeSelf()
                dialog.close()
            })

            // console.log(mainPage);



            // console.log(Laya.stage.displayWidth, Laya.stage.designWidth, Laya.stage.width);

        })
    }

    playVideo(): void {
        this.videoNode = new Laya.VideoNode()
        this.videoNode.width = this.owner.width
        this.videoNode.height = this.owner.height
        this.videoNode.source = "resources/ElephantsDream.mp4"
        this.videoNode.load("resources/ElephantsDream.mp4")
        this.owner.addChild(this.videoNode)
        this.videoNode.play()

    }
}