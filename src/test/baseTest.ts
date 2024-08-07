import { TestInterface } from "./test.interface";

export abstract class BaseTest implements TestInterface {
    basePlay(): void {
        console.log('base play');
    }
}