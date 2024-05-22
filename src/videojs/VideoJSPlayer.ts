import { CustomVideoJSPlayer } from "./CustomPlayer";

const { regClass, property } = Laya;

@regClass()
export class VideoJSPlayer extends Laya.Script {
    declare owner: Laya.Box
    
    onEnable(): void {
        const flvPlayer = new CustomVideoJSPlayer()
        flvPlayer.width = this.owner.width
        flvPlayer.height = this.owner.height
        flvPlayer.source = "http://192.168.88.51:8080/live/marco.flv"
        flvPlayer.play()
    }
}