import { types } from "mobx-state-tree";

export const AlgorithmData = types.model({
    taskNumber: types.number,
    algorithmName: types.string,
    tags: types.optional(types.array(types.string), []),
    globalMax: types.number,
    localMax: types.number,
    algorithmMax: types.number,
    algorithmCurrentScore: types.number,
    bestSentTimeMin: types.number,
    currentSentTimeMin: types.number,
});

export interface IAlgorithmData {
    taskNumber: number;
    algorithmName: string;
    tags: string[];
    globalMax: number;
    localMax: number;
    algorithmMax: number;
    algorithmCurrentScore: number;
    bestSentTimeMin: number;
    currentSentTimeMin: number;
}