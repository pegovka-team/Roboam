import TasksDashboard from "../../components/task-item/tasks-dashboard";
import { observer } from "mobx-react";
import { useContext } from "react";
import { ROOT_STORE_CONTEXT } from "../../index";

const MainPage = observer(() => {
    const { rootStore } = useContext(ROOT_STORE_CONTEXT);
    const { algorithmDataStore, favoriteTasksStore } = rootStore;
    const { favoriteTasksMap } = favoriteTasksStore;
    const filteredByFavoriteTasks = algorithmDataStore.items.slice().sort(function(x, y) {
        if (favoriteTasksMap[x.taskNumber] === favoriteTasksMap[y.taskNumber])
            return 0;

        return favoriteTasksMap[x.taskNumber] ? -1 : 1;
    });

    return (
        <TasksDashboard tasks={filteredByFavoriteTasks} />
    );
});

export default MainPage;