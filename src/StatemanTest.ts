import { createState } from "@persevie/statemanjs";

const { regClass, property } = Laya;

type testPlanet = {
    name: string
}


@regClass()
export class StatemanTest extends Laya.Script {
    onEnable(): void {
        const name = this.owner.getChildByName("name") as Laya.Label
        const btn = this.owner.getChildByName("btn") as Laya.Button

        const planetState = createState<testPlanet>({
            name: "test"
        })
        // const unwrapPlanetState = planetState.unwrap()
        // name.text = unwrapPlanetState.name

        const planetNameSelector = planetState.createSelector((state) => state.name)
        name.text = planetNameSelector.unwrap()
        const planetStateSub = planetState.subscribe((state) => {
            console.log('planet state update ', state);
            name.text = state.name
        })
        // planetStateSub()

        btn.clickHandler = new Laya.Handler(this, () => {
            console.log('click');
            planetState.update((state) => {
                state.name = "test update"
            })
        })

    }
}