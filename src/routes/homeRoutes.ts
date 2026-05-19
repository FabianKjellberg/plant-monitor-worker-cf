import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware";
import { getAllHomesHandler } from "../handlers/homeHandlers/getAllHomesHandler";
import { createRoomHandler } from "../handlers/homeHandlers/createRoomHandler";
import { createPlaceHandler } from "../handlers/homeHandlers/createPlaceHandler";
import { deleteRoomHandler } from "../handlers/homeHandlers/deleteRoomHandler";
import { renameRoomHandler } from "../handlers/homeHandlers/renameRoomHandler";
import { renamePlaceHandler } from "../handlers/homeHandlers/renamePlaceHandler";
import { deletePlaceHandler } from "../handlers/homeHandlers/deletePlaceHandler";

const homeRoutes = new Hono();

homeRoutes.get("/all", authMiddleware, getAllHomesHandler);

//ROOM
homeRoutes.post("/room/create", authMiddleware, createRoomHandler);

homeRoutes.put("/room/rename", authMiddleware, renameRoomHandler);

homeRoutes.delete("/room/:roomId", authMiddleware, deleteRoomHandler);

//PLACE
homeRoutes.post("/place/create", authMiddleware, createPlaceHandler);

homeRoutes.put("/place/rename", authMiddleware, renamePlaceHandler);

homeRoutes.delete("/place/:placeId", authMiddleware, deletePlaceHandler);

export default homeRoutes;

