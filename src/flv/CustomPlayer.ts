import { CustomFLVTexture } from "./CustomTexture";

const { regClass, property } = Laya;

@regClass()
export class CustomFLVPlayer extends Laya.Sprite {
    private _videoTexture: CustomFLVTexture;
    private _internalTex: Laya.Texture;
    private videoID: string;

    constructor(videoID: string = null) {
        super();
        this.videoID = videoID;
        this.texture = this._internalTex = new Laya.Texture();

        if (Laya.LayaEnv.isPlaying && Laya.Browser.onMobile) {
            let func = async () => {
                Laya.Browser.document.removeEventListener("touchend", func);
            }

            Laya.Browser.document.addEventListener("touchend", func);
        }
    }

    private get videoTexture(): CustomFLVTexture {
        return this._videoTexture;
    }

    private set videoTexture(value: CustomFLVTexture) {
        if (this._videoTexture) {
            this._videoTexture._removeReference();
            this._videoTexture.off(Laya.Event.READY, this, this.onVideoMetaLoaded);
        }

        this._videoTexture = value;
        if (value) {
            this._videoTexture._addReference();
            this._videoTexture.on(Laya.Event.READY, this, this.onVideoMetaLoaded);
            this._internalTex.setTo(this._videoTexture);
        } else {
            this._internalTex.setTo(null);
        }
    }

    private onVideoMetaLoaded(): void {
        this._internalTex.setTo(this._videoTexture);
    }

    public set source(value: string) {
        if (value) {
            if (!this._videoTexture) {
                this.videoTexture = new CustomFLVTexture(this.videoID);
            }
            this._videoTexture.source = value;
        }
    }

    public play(): void {
        if (!this._videoTexture) return;
        this._videoTexture.play();
    }

    public stop(): void {
        if (!this._videoTexture) {
            return this.stop()
        };
        this._videoTexture.stop();
        this._videoTexture.destroy()
    }

    public set_width(value: number): void {
        super.set_width(value);
    }

    public set_height(value: number): void {
        super.set_height(value);
    }

    public destroy(detroyChildren: boolean = true): void {
        if (this._videoTexture) {
            this._videoTexture.stop();
            this._videoTexture.destroy()
        }
        super.destroy(detroyChildren);
    }
}
