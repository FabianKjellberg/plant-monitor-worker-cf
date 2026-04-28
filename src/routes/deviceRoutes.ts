import { Hono } from "hono";
import { getAllDevicesHandler } from "../handlers/deviceHandlers/getAllDevicesHandler";

const deviceRoutes = new Hono();

deviceRoutes.get("/all", getAllDevicesHandler);


export default deviceRoutes;