import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import express from "express";
import config from "./config";
import routers from "./routes";
import logger from "./logger";

const app = express();
app.use(routers);

const port = config.get("port");
app.listen(port, () => logger.info(`Listening on port ${port}.`));
