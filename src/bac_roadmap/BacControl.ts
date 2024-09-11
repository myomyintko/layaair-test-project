const { regClass } = Laya;
import { BacControlBase } from "./BacControl.generated";
import { BacRoadmapRender } from "./BacRoadmapRender";

@regClass()
export class BacControl extends BacControlBase {
    bacRoadmapRender: BacRoadmapRender
    onEnable(): void {
        this.bacRoadmapRender = this.parent.getChildByName("bacRoadmap") as BacRoadmapRender

        this.playerPairBtn.clickHandler = new Laya.Handler(this, () => {
            this.bacRoadmapRender.AddResult('');
        });
        
        this.playerBtn.clickHandler = new Laya.Handler(this, () => {
            this.bacRoadmapRender.AddResult('b:42,52,3;p:10,26,');
        });
        
        this.tieBtn.clickHandler = new Laya.Handler(this, () => {
            this.bacRoadmapRender.AddResult('b:48,33,;p:51,28,');
        });
        
        this.bankerBtn.clickHandler = new Laya.Handler(this, () => {
            this.bacRoadmapRender.AddResult('b:6,43,;p:41,25,');
        });
        
        this.bankerPairBtn.clickHandler = new Laya.Handler(this, () => {
            this.bacRoadmapRender.AddResult('');
        });
        
        this.playerBonusBtn.clickHandler = new Laya.Handler(this, () => {
            this.bacRoadmapRender.AddResult('');
        });
        
        this.playerNaturalBtn.clickHandler = new Laya.Handler(this, () => {
            this.bacRoadmapRender.AddResult('');
        });
        
        this.bankerBonusBtn.clickHandler = new Laya.Handler(this, () => {
            this.bacRoadmapRender.AddResult('');
        });
        
        this.super6Btn.clickHandler = new Laya.Handler(this, () => {
            this.bacRoadmapRender.AddResult('');
        });
        
        this.bankerNaturalBtn.clickHandler = new Laya.Handler(this, () => {
            this.bacRoadmapRender.AddResult('');
        });
        
        
    }
}