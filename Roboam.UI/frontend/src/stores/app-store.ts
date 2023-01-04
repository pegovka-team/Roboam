import { variablesLight } from "../styles/light/variables-light";

export default class AppStore {
    constructor() {
        this.setLightTheme();
    }

    private setLightTheme() {
        const root = document.documentElement;

        Object.keys(variablesLight).forEach(key => root.style.setProperty(key, variablesLight[key]));
    }
}