
const { regClass, property } = Laya;

@regClass()
export class Main extends Laya.Script {
    declare owner: Laya.Scene;
    carouselContainer: Laya.Box;
    items: any[];
    numRows: number;
    numCols: number;
    panel: Laya.Panel;
    videoNode: Laya.VideoNode;

    // onEnable(): void {
    //     const HSlider = this.owner.getChildByName("HSlider") as Laya.HSlider
    //     const SOUND_URL = "resources/Take_a_Break.wav"
    //     Laya.SoundManager.useAudioMusic = true
    //     Laya.SoundManager.autoReleaseSound = true
    //     Laya.SoundManager.playMusic(SOUND_URL, 0)
        
    //     HSlider.on(Laya.Event.CHANGE, () => {
    //         const volume = HSlider.value / 100;
    //         Laya.SoundManager.setMusicVolume(volume)
    //     })
    // }
}