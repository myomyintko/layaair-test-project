import { CustomTexture } from "./CustomTexture";

const { regClass, property } = Laya;

@regClass()
export class CustomPlayer extends Laya.Sprite {
    private _videoTexture: CustomTexture;
    private loadingBox: Laya.Box;
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

    private get videoTexture(): CustomTexture {
        return this._videoTexture;
    }

    private set videoTexture(value: CustomTexture) {
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
                this.videoTexture = new CustomTexture(this.videoID);
            }
            this._videoTexture.source = value;
        }
    }

    public async load(): Promise<void> {
        if (!this._videoTexture) return;
        await this._videoTexture.load()
    }

    public play(): void {
        if (!this._videoTexture) return;
        this._videoTexture.play();
        // this._videoTexture.onBufferStatus((stats) => {
        //     if (stats) {
        //         this.loadingBox.set_visible(false);
        //         this.showLoading = false
        //     } else {
        //         if (this.showLoading)
        //             this.loadingBox.set_visible(true);
        //     }
        // });
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
