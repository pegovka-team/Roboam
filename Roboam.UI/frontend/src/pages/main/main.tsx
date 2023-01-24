import TasksDashboard from "../../components/tasks-dashboard/tasks-dashboard";
import { observer } from "mobx-react";
import { useContext } from "react";
import { ROOT_STORE_CONTEXT } from "../../index";
import TasksDashboardCompare from "../../components/tasks-dashboard-compare/tasks-dashboard-compare";

const MainPage = observer(() => {
    const { rootStore } = useContext(ROOT_STORE_CONTEXT);
    const { algorithmDataStore, favoriteTasksStore, algorithmNameStore } = rootStore;
    const { favoriteTasksMap } = favoriteTasksStore;
    const filteredByFavoriteTasks = algorithmDataStore.items.slice().sort(function(x, y) {
        if (favoriteTasksMap[x.taskNumber] === favoriteTasksMap[y.taskNumber])
            return 0;

        return favoriteTasksMap[x.taskNumber] ? -1 : 1;
    });

    if (algorithmNameStore.selectedItems.length > 1) {
        return (
            <TasksDashboardCompare tasks={filteredByFavoriteTasks} />
        );
    }
    return (
        <TasksDashboard tasks={filteredByFavoriteTasks} />
    );
});

export default MainPage;