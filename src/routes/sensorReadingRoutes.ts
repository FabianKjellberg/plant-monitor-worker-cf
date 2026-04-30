import { Hono } from "hono";
import { getReadingsFromRangeHandler } from "../handlers/sensorReadingHandlers.ts/getReadingsFromRangeHandler";
import { authMiddleware } from "../middleware/authMiddleware";

const sensorReadingRoutes = new Hono();

//sensorReadingRoutes.get("/all/:deviceId", getReadingsFromIdHandler);

sensorReadingRoutes.get("/:from/:to/:deviceId", authMiddleware ,getReadingsFromRangeHandler);

export default sensorReadingRoutes;
