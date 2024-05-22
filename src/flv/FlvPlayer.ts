import { CustomFLVPlayer } from "./CustomPlayer";

const { regClass, property } = Laya;

@regClass()
export class CustomFlvPlayer extends Laya.Script {
    declare owner: Laya.Box
    onEnable(): void {
        const flvPlayer = new CustomFLVPlayer()
        flvPlayer.width = this.owner.width
        flvPlayer.height = this.owner.height
        flvPlayer.source = "http://192.168.88.51:8080/live/marco.flv"
        flvPlayer.play()

        Laya.VideoNode
    }
}