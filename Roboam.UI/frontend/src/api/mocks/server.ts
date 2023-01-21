import jsonServer from "json-server";
import { fakeRouter } from "./router";
import { routing } from "./routing";
import { algorithmNames, algorithmsDataList, detailsLevels, favoriteTasks, maxTaskNumber, tagsNames } from "./db";

const server = jsonServer.create();
const router = jsonServer.router(fakeRouter);
const middlewares = jsonServer.defaults();

server.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

server.use(jsonServer.rewriter(routing));

server.get("/algorithmData", function (_req, res) {
    return res.jsonp({
        isSuccessful: true,
        result: algorithmsDataList
    });
});

server.get("/favoriteTask", function (_req, res) {
    return res.jsonp({
        isSuccessful: true,
        result: favoriteTasks
    });
});

server.post("/favoriteTask", function (req, res) {
    favoriteTasks.push(req.body.taskId);
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