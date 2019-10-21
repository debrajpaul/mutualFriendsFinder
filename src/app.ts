import fs from "fs";
import path from "path";
import cors from "cors";
import http from "http";
import https from "https";
import helmet from "helmet";
import * as dotenv from "dotenv";
import log from "./utils/logger";
import express, { Application } from "express";
import interestGraphRouter from "./routes/interest-tree-routes";
dotenv.config();

const app: Application = express();
let { PORT, PROTOCOL } = process.env;
if (!PORT) {
    log(
        "app:user:app.js",
        "FATAL ERROR : Port is not defind! Please check .env setting"
    );
    process.exit(1);
}
if (!PROTOCOL) {
    log(
        "app:user:app.js",
        "FATAL ERROR : PROTOCOL is not defind! Please check .env setting"
    );
    process.exit(1);
}

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/interest-graph-service", interestGraphRouter);

process.on("uncaughtException", ex => {
    log("Error uncaughtException! Please check the fields attributes", ex);
    // process.exit(1);
});
process.on("unhandledRejection", ex => {
    log("Error unhandledRejection! Please check the fields attributes", ex);
    //process.exit(1);
});

switch (PROTOCOL) {
    case "http": {
        const httpServer = http.createServer(app);
        httpServer.listen(
            parseInt(`${PORT}`),
            undefined,
            undefined,
            (): void => {
                log("app:user:API_server", `HTTP listening on port ${PORT}`);
            }
        );
        break;
    }
    default: {
        log(
            "app:user(switch-case):app.js",
            "FATAL ERROR : PROTOCOL is not defind! Please check .env setting"
        );
        process.exit(1);
    }
}
