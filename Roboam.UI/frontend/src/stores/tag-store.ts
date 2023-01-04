import { NavigationItemStore } from "./navigation-item-store";
import { flow } from "mobx-state-tree";
import { apiInstance } from "../api";

export const TagStore = NavigationItemStore
    .named("TagStore")
    .actions((self) => ({
        load: flow(function* () {
            const tagsNames = yield apiInstance.getTagsNames();
            self.setItems(tagsNames);
        }),
        afterCreate: function() {
            this.load();
        },
    }));