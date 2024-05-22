import { VideoPlayer } from "./VideoPlayer";

/**
 * <code>VideoTexture</code> 多媒体纹理
 */
export class CustomVideoTexture extends Laya.BaseTexture {
    public readonly element: HTMLVideoElement;
    private _texture: Laya.InternalTexture;

    private _listeningEvents: Record<string, (evt: Event) => void>;
    private immediatelyPlay: boolean;
    /**
     * 是否开发者自己调用Render
     */
    private _frameRender: boolean;
    /** @inernal 避免重复的加载 */
    _isLoaded: boolean;
    _needUpdate: boolean;

    private _player: VideoPlayer

    /**
     * 创建VideoTexture对象，
     */
    constructor() {
        let ele: HTMLVideoElement = Laya.Browser.createElement("video");
        super(ele.videoWidth, ele.videoHeight, Laya.RenderTargetFormat.R8G8B8);
        this._frameRender = true;
        this._isLoaded = false;
        this._needUpdate = false;
        this.immediatelyPlay = false;
        this.element = ele;

        this._listeningEvents = {};

        this._dimension = Laya.TextureDimension.Tex2D;

        this._player = new VideoPlayer()
        this._player.videoElement = this.element
        // ele.setAttribute('crossorigin', 'Anonymous');

        var style: any = this.element.style;
        style.position = 'absolute';
        style.top = '0px';
        style.left = '0px';
        // Laya.Browser.document.body.appendChild(this.element);
        ele.autoplay = true
        ele.muted = true
        // 默认放开webGL对纹理数据的跨域限制
        ele.setAttribute('crossorigin', 'anonymous');
        if (Laya.Browser.onMobile) {
            //@ts-ignore
            ele["x5-playsInline"] = true;
            //@ts-ignore
            ele["x5-playsinline"] = true;
            //@ts-ignore
            ele.x5PlaysInline = true;
            //@ts-ignore
            ele.playsInline = true;
            //@ts-ignore
            ele["webkit-playsInline"] = true;
            //@ts-ignore
            ele["webkit-playsinline"] = true;
            //@ts-ignore
            ele.webkitPlaysInline = true;
            //@ts-ignore
            ele.playsinline = true;
            //@ts-ignore
            ele.style.playsInline = true;
            ele.crossOrigin = "anonymous";
            ele.setAttribute('playsinline', 'true');
            ele.setAttribute('x5-playsinline', 'true');
            ele.setAttribute('webkit-playsinline', 'true');
            ele.autoplay = true;
        }

        ele.addEventListener("loadedmetadata", () => {
            this.loadedmetadata();
        });

        ele.addEventListener("loadeddata",()=>{
            console.log("your video is ready!");
        })
        
        ele.addEventListener("play", () => {
            console.log('your video is playing....');
        })

        const scope = this;
        function updateVideo() {
            scope._needUpdate = true;
            ele.requestVideoFrameCallback(updateVideo);

        }
        if ('requestVideoFrameCallback' in ele) {
            ele.requestVideoFrameCallback(updateVideo);
        }
        //ios微信浏览器环境下默认不触发loadedmetadata，在主动调用play方法的时候才会触发loadedmetadata事件
        if (Laya.Browser.onWeiXin) {
            this.loadedmetadata();
        }
    }

    private isNeedUpdate() {
        return this._needUpdate;
    }

    loadedmetadata() {
        if (this._isLoaded)
            return;
        //flag only TODO
        this._width = this.element.videoWidth;
        this._height = this.element.videoHeight;
        if (Laya.Browser.onLayaRuntime) {
            this._texture = Laya.LayaGL.textureContext.createTextureInternal(this._dimension, this.element.videoWidth, this.element.videoHeight, Laya.TextureFormat.R8G8B8A8, false, false);
        }
        else {
            this._texture = Laya.LayaGL.textureContext.createTextureInternal(this._dimension, this.element.videoWidth, this.element.videoHeight, Laya.TextureFormat.R8G8B8, false, false);
        }
        this.wrapModeU = Laya.WrapMode.Clamp;
        this.wrapModeV = Laya.WrapMode.Clamp;
        this.filterMode = Laya.FilterMode.Bilinear;
        Laya.LayaGL.textureContext.initVideoTextureData(this._texture);
        this._texture.gammaCorrection = 2.2;//这里使用srgb会变得特别的卡，所以srgb的转换放入Shader中进行
        if (this.immediatelyPlay) {
            this.play();
        }
        this._isLoaded = true;
        this.event(Laya.Event.READY, this);
    }

    get gammaCorrection() {
        return 2.2;
    }

    /**
    * 设置播放源路径
    * @param url 播放源路径
    */
    set source(url: string) {
        if (!url) return;
        this._player.source = url
    }

    /**
     * @internal
     */
    render() {
        if (this.element.readyState == 0)
            return;
        if (this.isNeedUpdate() || Laya.Browser.onLayaRuntime) {
            Laya.LayaGL.textureContext.updateVideoTexture(this._texture, this.element, false, false);
            this._needUpdate = false;
        }
    }

    /**
     * 是否每一帧都渲染
     */
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

    /**
     * 开始播放视频
     */
    play() {
        if (!this._texture) {
            this.immediatelyPlay = true;
            this._player.play()
        } else {
            this.element.play().catch(() => {
                this.event("NotAllowedError");
            });
            if (this._frameRender) {
                Laya.timer.frameLoop(1, this, this.render);
            }
        }

    }

    _getSource() {
        return this._texture ? this._texture.resource : null;
    }

    get defaultTexture() {
        return Laya.Texture2D.whiteTexture;
    }

    /**
     * 重新加载视频。
     */
    load(): void {
        this.element.load();
    }

    /**
     * buffered 属性返回 TimeRanges(JS)对象。TimeRanges 对象表示用户的音视频缓冲范围。缓冲范围指的是已缓冲音视频的时间范围。如果用户在音视频中跳跃播放，会得到多个缓冲范围。
     * <p>buffered.length返回缓冲范围个数。如获取第一个缓冲范围则是buffered.start(0)和buffered.end(0)。以秒计。</p>
     * @return TimeRanges(JS)对象
     */
    get buffered(): any {
        return this.element.buffered;
    }

    /**
     * 获取当前播放源路径。
     */
    get currentSrc(): string {
        return this.element.currentSrc;
    }

    /**
     * 设置和获取当前播放头位置。
     */
    get currentTime(): number {
        return this.element.currentTime;
    }

    set currentTime(value: number) {
        if (!this.element)
            return;

        this.element.currentTime = value;
        this.render();
    }

    /**
     * 设置和获取当前音量。
     */
    set volume(value: number) {
        if (!this.element)
            return;
        this.element.volume = value;
    }

    get volume(): number {
        return this.element.volume;
    }

    /**
     * 表示视频元素的就绪状态：
     * <ul>
     * <li>0 = HAVE_NOTHING - 没有关于音频/视频是否就绪的信息</li>
     * <li>1 = HAVE_METADATA - 关于音频/视频就绪的元数据</li>
     * <li>2 = HAVE_CURRENT_DATA - 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒</li>
     * <li>3 = HAVE_FUTURE_DATA - 当前及至少下一帧的数据是可用的</li>
     * <li>4 = HAVE_ENOUGH_DATA - 可用数据足以开始播放</li>
     * </ul>
     */
    get readyState(): any {
        return this.element.readyState;
    }

    /**
     * 获取视频源尺寸。ready事件触发后可用。
     */
    get videoWidth(): number {
        return this.element.videoWidth;
    }

    get videoHeight(): number {
        return this.element.videoHeight;
    }

    /**
     * 获取视频长度（秒）。ready事件触发后可用。
     */
    get duration(): number {
        return this.element.duration;
    }

    /**
     * 返回音频/视频的播放是否已结束
     */
    get ended(): boolean {
        return this.element.ended;
    }

    /**
     * 返回表示音频/视频错误状态的 MediaError（JS）对象。
     */
    get error(): MediaError {
        return this.element.error;
    }

    /**
     * 设置或返回音频/视频是否应在结束时重新播放。
     */
    get loop(): boolean {
        return this.element.loop;
    }

    set loop(value: boolean) {
        if (!this.element)
            return;
        this.element.loop = value;
    }

    /**
     * playbackRate 属性设置或返回音频/视频的当前播放速度。如：
     * <ul>
     * <li>1.0 正常速度</li>
     * <li>0.5 半速（更慢）</li>
     * <li>2.0 倍速（更快）</li>
     * <li>-1.0 向后，正常速度</li>
     * <li>-0.5 向后，半速</li>
     * </ul>
     * <p>只有 Google Chrome 和 Safari 支持 playbackRate 属性。</p>
     */
    get playbackRate(): number {
        return this.element.playbackRate;
    }

    set playbackRate(value: number) {
        if (!this.element)
            return;
        this.element.playbackRate = value;
    }

    /**
     * 获取和设置静音状态。
     */
    get muted(): boolean {
        return this.element.muted;
    }

    set muted(value: boolean) {
        if (!this.element)
            return;
        this.element.muted = value;
    }

    /**
     * 返回视频是否暂停
     */
    get paused(): boolean {
        return this.element.paused;
    }

    /**
     * preload 属性设置或返回是否在页面加载后立即加载视频。可赋值如下：
     * <ul>
     * <li>auto	指示一旦页面加载，则开始加载视频。</li>
     * <li>metadata	指示当页面加载后仅加载音频/视频的元数据。</li>
     * <li>none	指示页面加载后不应加载音频/视频。</li>
     * </ul>
     */
    get preload(): string {
        return this.element.preload;
    }

    set preload(value: string) {
        if (!this.element)
            return;
        //@ts-ignore
        this.element.preload = value;
    }

    protected onStartListeningToType(type: string): void {
        if (videoEvents.has(type)) {
            let func = this._listeningEvents[type];
            if (!func)
                func = this._listeningEvents[type] = () => {
                    this.event(type);
                };

            this.element.addEventListener(type, func);
        }
    }

    destroy() {
        var isConchApp: boolean = Laya.LayaEnv.isConch;
        if (isConchApp) {
            (<any>this.element)._destroy();
        }
        this._player.close()
        Laya.timer.clear(this, this.render);
        super.destroy();
    }
}

const videoEvents = new Set([
    "abort", "canplay", "canplaythrough", "durationchange", "emptied", "error", "loadeddata",
    "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "seeked", "seeking",
    "stalled", "suspend", "timeupdate", "volumechange", "waiting", "ended"
]);