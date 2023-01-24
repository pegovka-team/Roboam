import { variablesLight } from "../styles/light/variables-light";
import { makeAutoObservable } from "mobx";

export default class AppStore {
    public screenHeight: number = window.innerHeight;
    public taskNumberToScroll?: number;

    constructor() {
        makeAutoObservable(this);
        this.setLightTheme();

        /* eslint-disable-next-line no-restricted-globals */
        self.addEventListener("resize", () => {
            this.screenHeight = window.innerHeight;
        });
    }

    setTaskToScroll(taskNumber: number | undefined) {
        this.taskNumberToScroll = taskNumber;
    }

    private setLightTheme() {
        const root = document.documentElement;

        Object.keys(variablesLight).forEach(key => root.style.setProperty(key, variablesLight[key]));
    }
}