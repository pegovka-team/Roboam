import { NavigationItemStore } from "./navigation-item-store";
import { flow } from "mobx-state-tree";
import { apiInstance } from "../api";

export const AlgorithmNameStore = NavigationItemStore
    .named("AlgorithmNameStore")
    .actions((self) => ({
        load: flow(function* () {
            const algorithmNames = yield apiInstance.getAlgorithmsNames();
            self.setItems(algorithmNames);
        }),
        afterCreate: function() {
            this.load();
        },
    }));