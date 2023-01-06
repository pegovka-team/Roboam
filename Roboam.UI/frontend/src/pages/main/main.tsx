import TasksDashboard from "../../components/task-item/tasks-dashboard";
import { observer } from "mobx-react";

const MainPage = observer(() => {
    return (
        <TasksDashboard />
    );
});

export default MainPage;