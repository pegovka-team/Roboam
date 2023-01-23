import { variablesLight } from "../styles/light/variables-light";
import { makeAutoObservable } from "mobx";

export default class AppStore {
    public screenHeight: number = window.innerHeight;

    constructor() {
        makeAutoObservable(this);
        this.setLightTheme();

        /* eslint-disable-next-line no-restricted-globals */
        self.addEventListener("resize", () => {
            this.screenHeight = window.innerHeight;
        });
    }

    private setLightTheme() {
        const root = document.documentElement;

        Object.keys(variablesLight).forEach(key => root.style.setProperty(key, variablesLight[key]));
    }
}