import { flow, types } from "mobx-state-tree";
import { apiInstance } from "../api";

const FavoriteTasksStore = types.model({
    tasks: types.optional(types.array(types.integer), []),
    maxTaskNumber: 0,
}).actions(self => {
    function updateData(data: number[], maxTaskNumber: number) {
        self.tasks.replace(data);
        self.maxTaskNumber = maxTaskNumber;
    }
    const load = flow(function* load() {
        const response: number[] = yield apiInstance.getFavoriteTasks();
        const maxTaskNumber = yield apiInstance.getMaxTaskNumber();
        updateData(response, maxTaskNumber);
    })
    function afterCreate() {
        load();
    }

    return {
        afterCreate
    };
}).actions(self => ({
    setFavorite: flow(function* (task: number) {
        self.tasks.push(task);
        yield apiInstance.addFavoriteTask(task);
    }),
    deleteFavorite: flow(function* (task: number) {
        self.tasks.replace(self.tasks.filter(t => t !== task));
        yield apiInstance.deleteFavoriteTask(task);
    }),
})).views(self => ({
    get favoriteTasksMap(): Record<number, boolean> {
        let tasksMap: Record<number, boolean> = {};

        for (const favoriteTask of self.tasks) {
            tasksMap[favoriteTask] = true;
        }
        
        for (let task = 1; task <= self.maxTaskNumber; task++) {
            if (tasksMap[task]) {
                continue;
            }
            tasksMap[task] = false;
        }
        
        return tasksMap;
    }
}));

export default FavoriteTasksStore;