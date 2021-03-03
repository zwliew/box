import express from "express";
import helmet from "helmet";
import cors from "cors";
import routers from "@root/routes";
import { rateLimit } from "@root/middlewares";

const app = express();
app.use(helmet());
app.use(cors()); // TODO
app.use(rateLimit);
app.use(routers);

export default app;
