import { CustomVideoNode } from "./CustomSDKPlayer";

const { regClass, property } = Laya;

@regClass()
export class SDKPlayer extends Laya.Script {
    declare owner: Laya.Box

    onEnable(): void {
        const player = new CustomVideoNode()
        player.width = this.owner.width
        player.height = this.owner.height
        player.source = "http://192.168.88.51/api/?app=live&stream=marco"
        player.play()
        this.owner.addChild(player)
    }
}