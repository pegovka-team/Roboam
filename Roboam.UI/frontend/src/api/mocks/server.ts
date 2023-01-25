import jsonServer from "json-server";
import { fakeRouter } from "./router";
import { routing } from "./routing";
import { algorithmNames, algorithmsDataList, detailsLevels, favoriteTasks, maxTaskNumber, tagsNames } from "./db";
import { IAlgorithmData } from "../../models/algorithm-data";

const server = jsonServer.create();
const router = jsonServer.router(fakeRouter);
const middlewares = jsonServer.defaults();

server.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

server.use(jsonServer.rewriter(routing));

server.get("/algorithmData", function (req, res) {
    let notFilteredData = algorithmsDataList;

    const tags = req.query.tags;
    if (typeof tags === 'string') {
        notFilteredData = notFilteredData.filter(x => x.tags.includes(tags));
    } else if (Array.isArray(tags) && tags.length) {
        notFilteredData = notFilteredData.filter(x => tags.some(tag => x.tags.includes(tag.toString())));
    }

    const algorithmNames = req.query.algorithmNames;
    if (algorithmNames === undefined) {
        // get best result from all possible results
        const groupedByTaskNumberData: {[taskId: number]: IAlgorithmData[]} = {}
        for (const data of notFilteredData) {
            if (groupedByTaskNumberData[data.taskNumber]) {
                groupedByTaskNumberData[data.taskNumber].push(data);
            } else {
                groupedByTaskNumberData[data.taskNumber] = [data];
            }
        }

        const result = [];
        for (const [_, data] of Object.entries(groupedByTaskNumberData)) {
            const dataWithBestAlgorithmMax = data.reduce((prev, current) => (prev.algorithmMax > current.algorithmMax) ? prev : current);
            result.push(dataWithBestAlgorithmMax);
        }
        notFilteredData = result;
    } else if (Array.isArray(algorithmNames) && algorithmNames?.length) {
        const names = algorithmNames.map(a => a.toString());
        notFilteredData = notFilteredData.filter(a => names.includes(a.algorithmName));
    } else if (typeof req.query.algorithmNames === 'string') {
        notFilteredData = notFilteredData.filter(a => req.query.algorithmNames === a.algorithmName);
    }

    return res.jsonp({
        isSuccessful: true,
        result: notFilteredData
    });
});

server.get("/favoriteTask", function (_req, res) {
    return res.jsonp({
        isSuccessful: true,
        result: favoriteTasks
    });
});

server.post("/favoriteTask/:taskId", function (req, res) {
    if (!req.params.taskId) {
        return res.jsonp({
            isSuccessful: false
        });
    }
    favoriteTasks.push(Number.parseInt(req.params.taskId));
    return res.jsonp({
        isSuccessful: true,
    });
});

server.delete("/favoriteTask/:taskId", function (req, res) {
    const taskIndex = favoriteTasks.findIndex(taskId => taskId.toString() === req.params.taskId);
    if (taskIndex !== -1) {
        favoriteTasks.splice(taskIndex, 1);
    }
    return res.jsonp({
        isSuccessful: true,
    });
});

server.get("/maxTaskNumber", function (_req, res) {
    return res.jsonp({
        isSuccessful: true,
        result: maxTaskNumber
    });
});

server.get("/algorithmsNames", function (_req, res) {
    return res.jsonp({
        isSuccessful: true,
        result: algorithmNames
    });
});

server.get("/tagsNames", function (_req, res) {
    return res.jsonp({
        isSuccessful: true,
        result: tagsNames
    });
});

server.get("/detailsLevelsNames", function (_req, res) {
    return res.jsonp({
        isSuccessful: true,
        result: detailsLevels
    });
});

server.use(middlewares);
server.use(router);

server.listen(3001, () => {
    console.log("JSON Server is running. http://localhost:3001/api");
});