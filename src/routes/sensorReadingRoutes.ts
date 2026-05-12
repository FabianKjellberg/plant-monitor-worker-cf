import { Hono } from "hono";
import { getReadingsFromRangeHandler } from "../handlers/sensorReadingHandlers.ts/getReadingsFromRangeHandler";
import { authMiddleware } from "../middleware/authMiddleware";
import { getReadingsForPlaceHandler } from "../handlers/sensorReadingHandlers.ts/getReadingsForPlaceHandler";

const sensorReadingRoutes = new Hono();

//sensorReadingRoutes.get("/all/:deviceId", getReadingsFromIdHandler);

sensorReadingRoutes.get("/:from/:to/:deviceId", authMiddleware ,getReadingsFromRangeHandler);

sensorReadingRoutes.get(":placeId", authMiddleware, getReadingsForPlaceHandler)

export default sensorReadingRoutes;
