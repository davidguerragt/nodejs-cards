import cors from "cors";
import express from "express";
import helmet from "helmet";
import { creditCardRoutes } from "./interfaces/http/credit-card-routes";
import { errorHandler } from "./interfaces/http/error-handler";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.get("/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api/cards", creditCardRoutes);
app.use(errorHandler);