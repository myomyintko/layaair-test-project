const { regClass } = Laya;
import { BacOpenCardBase } from "./BacOpenCard.generated";

@regClass()
export class BacOpenCard extends BacOpenCardBase {
    lastMiCardTime: number = Date.now();
    image_list: any[] = [];
    drawCardCount: number = 0;
    playerScoreCount: number = 0;
    bankerScoreCount: number = 0;
    disableOpenCardArr: number[] = [6, 30, 31, 32, 40, 44, 45, 49, 53];
    bOpenCardAvailable: boolean = false;
    bShowOpenCard: boolean = false;

    Init() {
        this.image_list = [
            {
                dom: null,
                src: "/resources/poker/poker_bg_b.png",
                width: 299,
                height: 424,
                canvas: null,
            },
        ];

        for (let i = 0; i < this.image_list.length; i++) {
            let img = this.image_list[i];
            if (i != 1) {

            }
        }
    }

    Reset() {
        this.bShowOpenCard = false
        this.Close()
    }

    bankerShowCardArea: number = -1;
    playerShowCardArea: number = 1;
    Close() {
        this.bankerShowCardArea = -1;
        this.playerShowCardArea = -1;
        this.card5.graphics.clear();
        this.card6.graphics.clear();

        this.drawCardCount = 0;
        this.playerScoreCount = 0;
        this.bankerScoreCount = 0;
        this.bOpenCardAvailable = false
    }

    printCardArr: any[] = [];

    hideTableArr: number[] = [2, 4, 8, 13, 19]

    SetCard(card: number) {

    }

    SetScore() { }

    SetShowCard() {

    }

    SetMiCard() { }

    StartMiCard() { }

    PlayResultSpeech() { }

    DrawCardSpeech() { }

    ShowStatusBar() { }

    HideStatusBar() { }

}