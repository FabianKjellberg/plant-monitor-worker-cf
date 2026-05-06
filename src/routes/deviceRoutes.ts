import { Hono } from "hono";
import { getAllDevicesHandler } from "../handlers/deviceHandlers/getAllDevicesHandler";
import { authMiddleware } from "../middleware/authMiddleware";
import {createUserDeviceHandler} from "../handlers/deviceHandlers/createUserDeviceHandler"

const deviceRoutes = new Hono();

// outdated
deviceRoutes.get("/all",authMiddleware, getAllDevicesHandler);
deviceRoutes.post("/user-device/create", authMiddleware, createUserDeviceHandler);


export default deviceRoutes;