import { Hono } from "hono";
import { getReadingsFromIdHandler } from "../handlers/sensorReadingHandlers.ts/getReadingsFromIdHandler";

const sensorReadingRoutes = new Hono();

sensorReadingRoutes.get("/all/:deviceId", getReadingsFromIdHandler);

export default sensorReadingRoutes;
