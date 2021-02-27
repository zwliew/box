import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import config from "./config";
import logger from "./logger";
import app from "./app";

const port = config.get("port");
app.listen(port, () => logger.info(`Listening on port ${port}.`));
