import { CustomVideoTexture } from "./CustomSDKTexture";

/**
 * <code>VideoNode</code>将视频显示到Canvas上。<code>Video</code>可能不会在所有浏览器有效。
 * <p>关于Video支持的所有事件参见：<i>http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp</i>。</p>
 * <p>
 * <b>注意：</b><br/>
 * 在PC端可以在任何时机调用<code>play()</code>因此，可以在程序开始运行时就使Video开始播放。但是在移动端，只有在用户第一次触碰屏幕后才可以调用play()，所以移动端不可能在程序开始运行时就自动开始播放Video。
 * </p>
 *
 * <p>MDN Video链接： <i>https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video</i></p>
 */
export class CustomVideoNode extends Laya.Sprite {
    private _videoTexture: CustomVideoTexture;
    private _internalTex: Laya.Texture;

    constructor() {
        super();

        this.texture = this._internalTex = new Laya.Texture();

        if (Laya.LayaEnv.isPlaying && Laya.Browser.onMobile) {
            let func = () => {
                Laya.Browser.document.removeEventListener("touchend", func);

                if (!this._videoTexture)
                    return;

                if (Laya.Browser.onIOS) {
                    this._videoTexture.load();
                } else {
                    this._videoTexture.play();
                }
            }

            Laya.Browser.document.addEventListener("touchend", func);
        }
    }

    get videoTexture(): CustomVideoTexture {
        return this._videoTexture;
    }

    set videoTexture(value: CustomVideoTexture) {
        if (this._videoTexture) {
            this._videoTexture._removeReference();
            this._videoTexture.off(Laya.Event.READY, this, this.onVideoMetaLoaded);
        }

        this._videoTexture = value;
        if (value) {
            this._videoTexture._addReference();
            this._videoTexture.on(Laya.Event.READY, this, this.onVideoMetaLoaded);
            if (this._videoTexture._isLoaded)
                this._internalTex.setTo(this._videoTexture);
        }
        else {
            this._internalTex.setTo(null);
        }
    }

    set source(value: string) {
        if (value) {
            if (!this.videoTexture) this.videoTexture = new CustomVideoTexture();
            this.videoTexture.source = value;
        }
        else if (this.videoTexture)
            this.videoTexture.source = value;
    }

    /**
     * 设置播放源。
     * @param url	播放源路径。
     */
    load(url: string): void {
        this.source = url;
    }

    /**
     * 开始播放视频。
     */
    play(): void {
        if (!this._videoTexture)
            return;

        this._videoTexture.play();
    }

    /**
     * 重新加载视频。
     */
    reload(): void {
        if (!this._videoTexture)
            return;

        this._videoTexture.load();
    }

    private onVideoMetaLoaded(): void {
        this._internalTex.setTo(this._videoTexture);
    }

    /**
     * buffered 属性返回 TimeRanges(JS)对象。TimeRanges 对象表示用户的音视频缓冲范围。缓冲范围指的是已缓冲音视频的时间范围。如果用户在音视频中跳跃播放，会得到多个缓冲范围。
     * <p>buffered.length返回缓冲范围个数。如获取第一个缓冲范围则是buffered.start(0)和buffered.end(0)。以秒计。</p>
     * @return TimeRanges(JS)对象
     */
    get buffered(): any {
        return this._videoTexture?.buffered;
    }

    /**
     * 获取当前播放源路径。
     */
    get currentSrc(): string {
        return this._videoTexture?.currentSrc;
    }

    /**
     * 设置和获取当前播放头位置。
     */
    get currentTime(): number {
        return this._videoTexture?.currentTime;
    }

    set currentTime(value: number) {
        if (!this._videoTexture)
            return;

        this._videoTexture.currentTime = value;
    }

    /**
     * 设置和获取当前音量。
     */
    set volume(value: number) {
        if (!this._videoTexture)
            return;
        this._videoTexture.volume = value;
    }

    get volume(): number {
        return this._videoTexture?.volume;
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
        return this._videoTexture?.readyState;
    }

    /**
     * 获取视频源尺寸。ready事件触发后可用。
     */
    get videoWidth(): number {
        return this._videoTexture?.videoWidth;
    }

    get videoHeight(): number {
        return this._videoTexture?.videoHeight;
    }

    /**
     * 获取视频长度（秒）。ready事件触发后可用。
     */
    get duration(): number {
        return this._videoTexture?.duration;
    }

    /**
     * 返回音频/视频的播放是否已结束
     */
    get ended(): boolean {
        return this._videoTexture?.ended;
    }

    /**
     * 返回表示音频/视频错误状态的 MediaError（JS）对象。
     */
    get error(): MediaError {
        return this._videoTexture?.error;
    }

    /**
     * 设置或返回音频/视频是否应在结束时重新播放。
     */
    get loop(): boolean {
        return this._videoTexture?.loop;
    }

    set loop(value: boolean) {
        if (!this._videoTexture)
            return;
        this._videoTexture.loop = value;
    }

    /**
     * 获取和设置静音状态。
     */
    get muted(): boolean {
        return this._videoTexture?.muted;
    }

    set muted(value: boolean) {
        if (!this._videoTexture)
            return;
        this._videoTexture.muted = value;
    }

    /**
     * 返回视频是否暂停
     */
    get paused(): boolean {
        return this._videoTexture?.paused;
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
        return this._videoTexture?.preload;
    }

    set preload(value: string) {
        if (!this._videoTexture)
            return;
        //@ts-ignore
        this._videoTexture.preload = value;
    }

    /**
     * @override
     */
    set_width(value: number): void {
        super.set_width(value);

        if (!this._videoTexture)
            return;
        if (Laya.LayaEnv.isConch) {
            var transform: any = Laya.SpriteUtils.getTransformRelativeToWindow(this, 0, 0);
            this._videoTexture.element.width = value * transform.scaleX;
        }
        else {
            this._videoTexture.element.width = this.width / Laya.Browser.pixelRatio;
        }
    }

    /**
     * @override
     */
    set_height(value: number) {
        super.set_height(value);

        if (!this._videoTexture)
            return;
        if (Laya.LayaEnv.isConch) {
            var transform: any = Laya.SpriteUtils.getTransformRelativeToWindow(this, 0, 0);
            this._videoTexture.element.height = value * transform.scaleY;

        }
        else {
            this._videoTexture.element.height = this.height / Laya.Browser.pixelRatio;
        }
    }

    /**
     * 销毁内部事件绑定。
     * @override
     */
    destroy(detroyChildren: boolean = true): void {
        this.videoTexture = null;
        super.destroy(detroyChildren);
    }
}