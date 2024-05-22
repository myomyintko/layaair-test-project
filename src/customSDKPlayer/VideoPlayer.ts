import { VideoSDK } from "./PlayerSDK";

export class VideoPlayer extends VideoSDK {
    private sdk: {
        play: (url: string, options?: { videoOnly?: boolean; audioOnly?: boolean; }) => Promise<{ sessionId: string; }>;
        ontrack: (event: RTCTrackEvent) => void;
        close: () => void;
    };

    private declare _source: string
    private declare _ele: HTMLVideoElement

    constructor() {
        super()
        this.sdk = super.SDK()
    }

    set source(value: string) {
        this._source = value
    }

    get source() {
        return this._source
    }

    set videoElement(value: HTMLVideoElement) {
        this._ele = value
    }

    get videoElement() {
        return this._ele
    }

    play(): void {
        if (!this.source) return
        this.sdk.play(this.source, { videoOnly: true, audioOnly: false }).catch(err => console.error(err))
        this.sdk.ontrack = (evt) => {
            console.log(evt.track.kind)
            this.videoElement.srcObject = evt.streams[0]
            // if (evt.track.kind === "video") {
            //     console.log(evt.streams[0]);
            //     this.videoElement.srcObject = evt.streams[0]
            // }
        }
    }

    close(): void {
        if (!this.sdk) return
        this.sdk.close()
    }
}