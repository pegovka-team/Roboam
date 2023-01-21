import { flow, types } from "mobx-state-tree";
import { apiInstance } from "../api";
import { AlgorithmData, IAlgorithmData } from "../models/algorithm-data";

const AlgorithmDataStore = types.model({
    items: types.optional(types.array(AlgorithmData), []),
}).actions(self => {
    function updateData(data: IAlgorithmData[]) {
        self.items.clear();
        data.forEach(item => {
            self.items.push(item);
        });
    }
    const load = flow(function* load() {
        const response: IAlgorithmData[] = yield apiInstance.getAlgorithmData();
        updateData(response);
    });
    function afterCreate() {
        load();
    }

    return {
        afterCreate
    };
});

export default AlgorithmDataStore;