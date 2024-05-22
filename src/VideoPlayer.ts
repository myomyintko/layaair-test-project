import { CustomPlayer } from "./customPlayer/CustomPlayer";

const { regClass, property } = Laya;

@regClass()
export class VideoPlayer extends Laya.Script {
    declare owner: Laya.Box
    onEnable(): void {
        const player = new CustomPlayer("5")
        player.name = "player"
        player.width = 1280
        player.height = 720
        player.source = "http://192.168.88.51:8080/live/marco.flv"

        player.load().then(() => {
            player.play()
        })


        this.owner.addChild(player)
    }
}