import TasksDashboard from "../../components/tasks-dashboard/tasks-dashboard";
import { observer } from "mobx-react";
import { useContext } from "react";
import { ROOT_STORE_CONTEXT } from "../../index";
import TasksDashboardCompare from "../../components/tasks-dashboard-compare/tasks-dashboard-compare";

const MainPage = observer(() => {
    const { rootStore } = useContext(ROOT_STORE_CONTEXT);
    const { algorithmDataStore, algorithmNameStore } = rootStore;

    if (algorithmNameStore.selectedItems.length > 1) {
        return (
            <TasksDashboardCompare tasks={algorithmDataStore.items} />
        );
    }
    return (
        <TasksDashboard tasks={algorithmDataStore.items} />
    );
});

export default MainPage;