import { Context } from "hono";
import { queries } from "../../queries";
import { UserHomeRole } from "../../models/userHomeModel";
import { DetailedHomePlace } from "../../models/detailedHomeModel";

type CreatePlaceRequestBody = {
  roomId: string
  name: string,
  icon: string,
}

type CreatePlaceResponseBody = {
  place: DetailedHomePlace
  roomId: string
}

export const createPlaceHandler = async (c: Context) => {
  try {
    const body = await c.req.json<CreatePlaceRequestBody>();
    const userId: string = c.get("userId");
    const db = c.env.DB;

    const role = await queries.home.getRoleFromRoomId(db, body.roomId, userId);

    if(role != UserHomeRole.ADMIN && role != UserHomeRole.MEMBER) 
      return c.json({message: "forbidden action"}, 403);

    const placeEntity = 
      await queries.home.createPlace(
        db, 
        body.roomId, 
        body.name, 
        body.icon
      )

    const place: DetailedHomePlace= {
      id: placeEntity.id,
      name: placeEntity.name,
      icon: placeEntity.icon,
      devices: []
    } 

    return c.json({
      place, 
      roomId: body.roomId
    } as CreatePlaceResponseBody, 200);
  }
  catch(error) {
    console.error("unable to upload data", error)
    return c.json({ error: "Internal server error" }, 500);
  }
}