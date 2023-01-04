import AppStore from "./app-store";
import TagStore from "./tag-store";
import DetailsLevelStore from "./details-level-store";
import AlgorithmNameStore from "./algorithm-name-store";
import AlgorithmDataStore from "./algorithm-data-store";
import FavoriteTasksStore from "./favorite-tasks-store";

export default class RootStore {
    public readonly appStore = new AppStore();
    public readonly tagStore = TagStore.create();
    public readonly detailsLevelStore = DetailsLevelStore.create();
    public readonly algorithmNameStore = AlgorithmNameStore.create();
    public readonly algorithmDataStore = AlgorithmDataStore.create();
    public readonly favoriteTasksStore = FavoriteTasksStore.create();
}