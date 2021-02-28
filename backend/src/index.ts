import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import "module-alias/register";

import config from "@root/config";
import logger from "@root/logger";
import app from "@root/app";

const port = config.get("port");
app.listen(port, () => logger.info(`Listening on port ${port}.`));
