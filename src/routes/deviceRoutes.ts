import { Hono } from "hono";
import { getAllDevicesHandler } from "../handlers/deviceHandlers/getAllDevicesHandler";
import { authMiddleware } from "../middleware/authMiddleware";
import { addDeviceToHomeHandler } from "../handlers/deviceHandlers/addDeviceToHome"
import { updateDeviceNameHandler } from "../handlers/deviceHandlers/updateDeviceNameHandler";
import { asignDeviceHandler } from "../handlers/deviceHandlers/asignDeviceHandler";

const deviceRoutes = new Hono();

//get all users devices
deviceRoutes.get("/all",authMiddleware, getAllDevicesHandler);

//create a connection between a device and a home
deviceRoutes.put("/home", authMiddleware, addDeviceToHomeHandler);

//update name of a device.
deviceRoutes.put("/name", authMiddleware, updateDeviceNameHandler)

//asign device to a place.
deviceRoutes.put("/place", authMiddleware, asignDeviceHandler)

export default deviceRoutes;