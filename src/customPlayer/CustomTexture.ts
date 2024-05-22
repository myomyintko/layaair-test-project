const { regClass, property } = Laya;

@regClass()
export class CustomTexture extends Laya.BaseTexture {
    public readonly canvasElement: HTMLCanvasElement;
    private nodePlayer: NodePlayer = null;
    private _source: string;
    private _texture: Laya.InternalTexture;
    private videoID: string;
    _needUpdate: boolean;
    _isLoaded: boolean;
    private _frameRender: boolean;

    constructor(videoID: string) {
        const ele = Laya.Browser.createElement("canvas") as HTMLCanvasElement;
        // const ele = Laya.Browser.getElementById("video_5")
        super(ele.width, ele.height, Laya.RenderTargetFormat.R8G8B8);
        this.videoID = videoID;
        this.canvasElement = ele;
        this.canvasElement.id = "video_" + this.videoID;
        this.canvasElement.width = 1280;
        this.canvasElement.height = 720;
        this.canvasElement.style.display = "none";
        Laya.Browser.document.body.appendChild(this.canvasElement);

        this._needUpdate = false;
        this._frameRender = true;
        this._isLoaded = false;

        this._width = this.canvasElement.width;
        this._height = this.canvasElement.height;
        this._dimension = Laya.TextureDimension.Tex2D;
        this.setupTexture();

        if (Laya.Browser.onWeiXin) {
            this.setupTexture();
        }
    }

    public setupTexture() {
        if (this._isLoaded)
            return;
        const textureFormat = Laya.Browser.onLayaRuntime ? Laya.TextureFormat.R8G8B8A8 : Laya.TextureFormat.R8G8B8;
        this._texture = Laya.LayaGL.textureContext.createTextureInternal(this._dimension, this.canvasElement.width, this.canvasElement.height, textureFormat, false, false);
        this._texture.wrapU = Laya.WrapMode.Clamp;
        this._texture.wrapV = Laya.WrapMode.Clamp;
        this._texture.wrapW = Laya.WrapMode.Clamp
        this._texture.filterMode = Laya.FilterMode.Bilinear;
        Laya.LayaGL.textureContext.initVideoTextureData(this._texture)
        this._texture.gammaCorrection = 2.2;

        this._isLoaded = true;
        this.event(Laya.Event.READY, this);
    }

    get gammaCorrection() {
        return 2.2;
    }

    get source(): string {
        return this._source;
    }

    set source(url: string) {
        this._source = url;
    }

    load(): Promise<void> {
        if (!this.videoID) return;
        return new Promise((reslove, reject) => {
            NodePlayer.debug(true)
            NodePlayer.asyncLoad()
            this.nodePlayer = new NodePlayer();
            this.nodePlayer.setKeepScreenOn();
            this.nodePlayer.setBufferTime(1000);
            this.nodePlayer.setTimeout(3);
            this.nodePlayer.setView("video_" + this.videoID);
            this.nodePlayer.on("videoFrame", () => {
                this._needUpdate = true
            });
            this.nodePlayer.on("error", (err) => {
                console.log(err);
            })
            reslove()
        })
    }

    play() {
        if (!this.nodePlayer) return;
        this.nodePlayer.start(Laya.URL.postFormatURL(Laya.URL.formatURL(this._source)));

        if (this._frameRender) {
            Laya.timer.frameLoop(1, this, this.render);
        }
    }

    pause() {
        this.nodePlayer.stop()
        if (this._frameRender) {
            Laya.timer.clear(this, this.render);
        }
    }

    private isNeedUpdate() {
        return this._needUpdate;
    }

    render() {
        if (this.isNeedUpdate() || Laya.Browser.onLayaRuntime) {
            Laya.LayaGL.textureContext.updateVideoTexture(this._texture, this.canvasElement as unknown as HTMLVideoElement, true, false);
            this._needUpdate = false;
        }
    }

    set frameRender(value: boolean) {
        if (this._frameRender && !value) {
            Laya.timer.clear(this, this.render);
        }
        if (!this._frameRender && value) {
            Laya.timer.frameLoop(1, this, this.render);
        }
        this._frameRender = value;
    }

    get frameRender() {
        return this._frameRender;
    }

    get defaultTexture() {
        return Laya.Texture2D.whiteTexture;
    }

    onBufferStatus(callback: (isBufferFull: boolean) => void) {
        if (!this.nodePlayer) return;
        this.nodePlayer.on("buffer", (stats) => {
            const isBufferFull = stats === "full";
            callback(isBufferFull);
        });
    }

    stop(): void {
        if (!this.nodePlayer && !this._texture) return;
        this.nodePlayer.stop()
        this.nodePlayer.release(true)
        this._texture.dispose();
        document.getElementById("video_" + this.videoID)?.remove()
    }

    destroy() {
        var isConchApp: boolean = Laya.LayaEnv.isConch;
        if (isConchApp) {
            (<any>this.canvasElement)._destroy();
        }

        Laya.timer.clear(this, this.render);
        super.destroy();
    }
}
