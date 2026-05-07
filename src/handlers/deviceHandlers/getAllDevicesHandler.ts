import { Context } from "hono";
import { queries } from "../../queries";
import { DetailedDeviceHome } from "../../models/detailedDeviceModel";

type allDevicesResponseBody = {
  homes: DetailedDeviceHome[]
}

export const getAllDevicesHandler = async (c: Context) => {
  try {
    const db = c.env.DB
    const userId = c.get("userId")

    if(!userId) return c.json({message: "unable to find username"}, 400)

    const homes = await queries.devices.getAllDetailedDevices(db, userId);


    return c.json({homes} as allDevicesResponseBody, 200);
  }
  catch(error) {
    console.error("unable to upload data", error)
    return c.json({ error: "Internal server error" }, 500);
  }
}