import { CustomVideoNode } from "./CustomSDKPlayer";

const { regClass, property } = Laya;

@regClass()
export class SDKPlayer extends Laya.Script {
    declare owner: Laya.Box
    zoom = 1;
    offsetX = 0;
    offsetY = 0;
    zoomFactor = 0.1; // Zoom increment
    isDragging = false;
    startX = 0
    startY = 0
    player: CustomVideoNode
    isZoomed = false

    onEnable(): void {
        this.player = new CustomVideoNode()
        this.player.width = this.owner.width
        this.player.height = this.owner.height
        this.player.source = "http://192.168.88.51/api/?app=live&stream=marco"
        this.player.play()
        this.owner.addChild(this.player)

        // Laya.stage.on(Laya.Event.MOUSE_WHEEL, this, (e:any) => {
        //     const mouseX = Laya.stage.mouseX;
        //     const mouseY = Laya.stage.mouseY;

        //     const zoomDirection = e.delta > 0 ? 1 : -1;
        //     const newZoom = Math.max(1, this.zoom + zoomDirection * this.zoomFactor);

        //     const scale = newZoom / this.zoom;

        //     this.offsetX = mouseX - (mouseX - this.offsetX) * scale;
        //     this.offsetY = mouseY - (mouseY - this.offsetY) * scale;

        //     this.zoom = newZoom;

        //     this.player.scale(this.zoom, this.zoom);
        //     this.player.pos(this.offsetX, this.offsetY);
        // });

        Laya.stage.on(Laya.Event.CLICK, this, () => {
            const mouseX = Laya.stage.mouseX;
            const mouseY = Laya.stage.mouseY;

            if (this.isZoomed) {
                // Reset zoom to original state
                this.zoom = 1;
                this.offsetX = 0;
                this.offsetY = 0;
                this.player.scale(this.zoom, this.zoom);
                this.player.pos(this.offsetX, this.offsetY);
                this.isZoomed = false;
            } else {
                // Zoom in and center around the click position
                this.zoom = 2; // Adjust zoom level as needed
                this.offsetX = mouseX - (mouseX - this.offsetX) * this.zoom;
                this.offsetY = mouseY - (mouseY - this.offsetY) * this.zoom;
                this.player.scale(this.zoom, this.zoom);
                this.player.pos(this.offsetX, this.offsetY);
                this.isZoomed = true;
            }
        });

        // Handle panning with drag
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.isDragging = true;
            this.startX = Laya.stage.mouseX;
            this.startY = Laya.stage.mouseY;
        });

        // Laya.stage.on(Laya.Event.MOUSE_MOVE, this, () => {
        //     if (this.isDragging) {
        //         const dx = Laya.stage.mouseX - this.startX;
        //         const dy = Laya.stage.mouseY - this.startY;

        //         this.offsetX += dx;
        //         this.offsetY += dy;

        //         this.player.pos(this.offsetX, this.offsetY);

        //         this.startX = Laya.stage.mouseX;
        //         this.startY = Laya.stage.mouseY;
        //     }
        // });

        Laya.stage.on(Laya.Event.MOUSE_UP, this, () => {
            this.isDragging = false;
        });

        Laya.stage.on(Laya.Event.MOUSE_OUT, this, () => {
            this.isDragging = false;
        });
    }
}