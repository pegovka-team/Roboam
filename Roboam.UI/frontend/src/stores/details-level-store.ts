import { NavigationItemStore } from "./navigation-item-store";
import { flow } from "mobx-state-tree";
import { apiInstance } from "../api";

export const DetailsLevelStore = NavigationItemStore
    .named("DetailsLevelStore")
    .actions((self) => ({
        load: flow(function* () {
            const detailsLevelsNames = yield apiInstance.getDetailsLevelsNames();
            self.setItems(detailsLevelsNames);
        }),
        afterCreate: function() {
            this.load();
        },
    }));