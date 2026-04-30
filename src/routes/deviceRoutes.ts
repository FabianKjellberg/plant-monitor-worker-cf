import { Hono } from "hono";
import { getAllDevicesHandler } from "../handlers/deviceHandlers/getAllDevicesHandler";
import { authMiddleware } from "../middleware/authMiddleware";

const deviceRoutes = new Hono();

// outdated
deviceRoutes.get("/all",authMiddleware, getAllDevicesHandler);


export default deviceRoutes;