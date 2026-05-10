import { Context } from "hono";
import { queries } from "../../queries";
import { UserHomeRole } from "../../models/userHomeModel";
import { DetailedHomeRoom } from "../../models/detailedHomeModel";

type CreateRoomRequestBody = {
  homeId: string
  name: string,
  icon?: string,
}

type CreateRoomResponseBody = {
  room: DetailedHomeRoom
  homeId: string
}

export const createRoomHandler = async (c: Context) => {
  try {
    const body = await c.req.json<CreateRoomRequestBody>();
    const userId: string = c.get("userId");
    const db = c.env.DB;

    const role = await queries.home.getRoleFromHomeId(db, body.homeId, userId);

    console.log("role: ",role)
    console.log("homeId: ", body.homeId)
    console.log("userId: ", userId)

    if(role != UserHomeRole.ADMIN && role != UserHomeRole.MEMBER) 
      return c.json({message: "forbidden action"}, 403);

    const roomEntity = await queries.home.createRoom(db, body.homeId, body.name, body.icon)

    const room: DetailedHomeRoom = {
      id: roomEntity.id,
      name: roomEntity.name,
      icon: roomEntity.icon,
      places: []
    } 

    return c.json({room, homeId: body.homeId} as CreateRoomResponseBody, 200);
  }
  catch(error) {
    console.error("unable to upload data", error)
    return c.json({ error: "Internal server error" }, 500);
  }
}