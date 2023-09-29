import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { connectDb } from "./db";

import api from './api/index';

import * as middlewares from './middlewares';

const app = express();

connectDb()

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/v1", api)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app;
