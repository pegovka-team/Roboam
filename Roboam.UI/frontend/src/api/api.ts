import { del, get, post } from "../utils/requests";
import { IAlgorithmData } from "../models/algorithm-data";
import * as queryString from "query-string";

export default class Api {
    public getAlgorithmData = (algorithmNames: string[], tags: string[]) => {
        const url = queryString.stringifyUrl({
            url: "api/algorithmData",
            query: {
                algorithmNames: algorithmNames,
                tags: tags,
            }
        });
        return get<IAlgorithmData[]>(url);
    }
    
    public getAlgorithmsNames = () => {
        return get<string[]>("api/algorithmsNames");
    }
    
    public getTagsNames = () => {
        return get<string[]>("api/tagsNames");
    }

    public getDetailsLevelsNames = () => {
        return get<string[]>("api/detailsLevelsNames")
    }
    
    public getFavoriteTasks = () => {
        return get<number[]>("api/favoriteTask")
    }
    
    public addFavoriteTask = (task: number) => {
        return post(`api/favoriteTask/${task}`);
    }

    public deleteFavoriteTask = (task: number) => {
        return del(`api/favoriteTask/${task}`);
    }
    
    public getMaxTaskNumber = () => {
        return get<number>("api/maxTaskNumber");
    }
}