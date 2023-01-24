import { ignoreCaseIncludes } from "../utils/sting-helpers";
import { types } from "mobx-state-tree";

const NavigationItemStore = types.model({
    search: "",
    items: types.optional(types.array(types.string), []),
    selectedItems: types.optional(types.array(types.string), []),
}).actions(self => ({
    setItems: (items: string[]) => {
        self.items.replace(items);
    },
    setSelectedItem: (item: string) => {
      if (self.selectedItems.includes(item)) {
          if (self.selectedItems.length == 1) {
              self.selectedItems.clear();
          } else {
              self.selectedItems.replace([item]);
          }
      } else {
          self.selectedItems.replace([item]);
      }
    },
    changeSelectedItem: (item: string, active: boolean) => {
        if (active) {
            if (self.selectedItems.every(selected => selected !== item)) {
                self.selectedItems.push(item);
            }
        } else {
            self.selectedItems.replace(self.selectedItems.filter(selected => selected !== item));
        }
    },
    handleSearchChange: (value: string) => {
        self.search = value;
    }
})).views(self => ({
    get filteredBySearchItems() {
        if (!self.search) {
            return self.items;
        }
        return self.items.filter(i => ignoreCaseIncludes(i, self.search));
    }
}));

export default NavigationItemStore;