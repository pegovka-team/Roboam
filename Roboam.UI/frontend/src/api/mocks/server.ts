import jsonServer from "json-server";
import { fakeRouter } from "./router";
import { routing } from "./routing";

const server = jsonServer.create();
const router = jsonServer.router(fakeRouter);
const middlewares = jsonServer.defaults();

server.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

server.use(jsonServer.rewriter(routing));

server.get("/test", function (_req, res) {
    return res.jsonp({
        isSuccessful: true,
        result: "Test data123"
    });
});

server.use(middlewares);
server.use(router);

server.listen(3001, () => {
    console.log("JSON Server is running. http://localhost:3001/api");
});