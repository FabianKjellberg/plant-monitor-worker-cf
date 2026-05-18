import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware";
import { getAllHomesHandler } from "../handlers/homeHandlers/getAllHomesHandler";
import { createRoomHandler } from "../handlers/homeHandlers/createRoomHandler";
import { createPlaceHandler } from "../handlers/homeHandlers/createPlaceHandler";
import { deleteRoomHandler } from "../handlers/homeHandlers/deleteRoomHandler";
import { renameRoomHandler } from "../handlers/homeHandlers/renameRoomHandler";

const homeRoutes = new Hono();

homeRoutes.get("/all", authMiddleware, getAllHomesHandler);

homeRoutes.post("/room/create", authMiddleware, createRoomHandler);

homeRoutes.post("/place/create", authMiddleware, createPlaceHandler);

homeRoutes.put("/room/rename", authMiddleware, renameRoomHandler);

homeRoutes.delete("/room/:roomId", authMiddleware, deleteRoomHandler);

export default homeRoutes;