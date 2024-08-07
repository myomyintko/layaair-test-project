const { regClass, property } = Laya;

@regClass()
export class WorkerPrefab extends Laya.Script {

    onEnable(): void {
        const label = this.owner.getChildByName("Label") as Laya.Label

        const worker = new Worker("http://192.168.88.141:18090/js/Worker.js")

        worker.onmessage = (e) => {
            label.text = `Current Time: ${e.data}`
        }

        worker.postMessage("start")
    }
}