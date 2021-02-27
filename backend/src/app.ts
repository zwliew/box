import express from "express";
import helmet from "helmet";
import routers from "./routes";
import { rateLimit } from "./middlewares";

const app = express();
app.use(helmet());
app.use(rateLimit);
app.use(routers);

export default app;
