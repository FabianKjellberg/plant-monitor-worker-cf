import { Hono } from "hono";
import { getReadingsFromIdHandler } from "../handlers/sensorReadingHandlers.ts/getReadingsFromIdHandler";
import { getReadingsFromRangeHandler } from "../handlers/sensorReadingHandlers.ts/getReadingsFromRangeHandler";

const sensorReadingRoutes = new Hono();

sensorReadingRoutes.get("/all/:deviceId", getReadingsFromIdHandler);

sensorReadingRoutes.get("/:from/:to/:deviceId", getReadingsFromRangeHandler);

export default sensorReadingRoutes;
