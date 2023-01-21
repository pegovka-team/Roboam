import { getRandomInt } from "../../utils/common-functions";
import { IAlgorithmData } from "../../models/algorithm-data";
import _ from "lodash";

export const algorithmNames = [
    "algo 1",
    "algo 2",
    "algo 3",
    "algo 4",
    "algo 5",
    "algo 6",
];

export const tagsNames = [
    "tag1",
    "tag2",
    "tag3",
    "tag4",
    "tag5",
];

export const detailsLevels = [
    "detail 1",
    "detail 2",
    "detail 3",
    "detail 4",
    "detail 5",
    "detail 6",
];

export const maxTaskNumber = 1000;

const getAlgorithmDataList = (algorithmName: string): IAlgorithmData[] => {
    const totalTasks = getRandomInt(maxTaskNumber / 2, maxTaskNumber + 1);
    let taskNumbers = _.shuffle(_.range(1, maxTaskNumber + 1)).slice(0, totalTasks + 1);
    
    return taskNumbers.map((_, taskNumber) => {
        const globalMax = getRandomInt(500, 1000);
        const localMax = getRandomInt(0, 4) === 1 ? globalMax : getRandomInt(300, globalMax);
        const algorithmMax = getRandomInt(0, 3) === 1 ? localMax : getRandomInt(200, localMax);
        const algorithmCurrentScore = getRandomInt(0, 2) === 1 ? algorithmMax : getRandomInt(100, algorithmMax);

        const bestSentTimeMin = getRandomInt(2, 150);
        const currentSentTimeMin = algorithmMax === algorithmCurrentScore
            ? bestSentTimeMin
            : getRandomInt(1, bestSentTimeMin);
        
        const tags = tagsNames.map(tag => getRandomInt(0, 2) == 1 ? tag : "").filter(t => t);

        // todo: по каждой задаче несколько интересных решений (метаданные артефакта)
        // на фронт инфу по всем артефактам для агрегации
        // в случае лучшего - по каждой задаче лучший артефакт
        // в другом случае лучший глобальный артефакт, текущий артефакт, ... 
        return {
            taskNumber: taskNumber + 1,
            algorithmName,
            tags,
            // агрегации сделать артефактами
            globalMax,
            localMax,
            algorithmMax,
            algorithmCurrentScore,
            bestSentTimeMin,
            currentSentTimeMin,
        }
    });
}

export const algorithmsDataList = algorithmNames.map(name => getAlgorithmDataList(name)).flat();

export const favoriteTasks = _.shuffle(_.range(1, maxTaskNumber + 1)).slice(0, Math.min(10, getRandomInt(0, maxTaskNumber / 10)));
