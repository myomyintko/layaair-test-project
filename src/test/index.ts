import { Test } from "./test";
import { TestInterface } from "./test.interface";
import { Test2 } from "./test2";

const { regClass, property } = Laya;

function getInstance(name: string): TestInterface {
    switch (name) {
        case "test1":
            return new Test()
        case "test2":
            return new Test2()
        default:
            break;
    }
}

@regClass()
export abstract class index extends Laya.Script {
    onEnable(): void {
        console.log('onenable');
        const baseTest = getInstance('test1')
        baseTest.basePlay()
        baseTest.play()
    }
}