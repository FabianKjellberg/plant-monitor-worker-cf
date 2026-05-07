import { Context } from "hono";
import { queries } from "../../queries";
import { UserHomeRole } from "../../models/userHomeModel";

type asignDeviceRequestBody = {
  placeId: string
  deviceId: string
}

export const asignDeviceHandler = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const db = c.env.DB;
    const body = await c.req.json<asignDeviceRequestBody>();

    const role = await queries.home.getRoleFromPlaceId(db, body.placeId, userId);

    if(role != UserHomeRole.ADMIN && role != UserHomeRole.MEMBER) 
      return c.json({message: "forbidden action"}, 403);

    await queries.devices.asignDeviceToPlace(db, body.deviceId, body.placeId);

    return c.json({message: "successfully asigned device to place"}, 200);
  }
  catch(error) {
    console.error("unable to upload data", error)
    return c.json({ error: "Internal server error" }, 500);
  }
}