import { Context } from "hono";
import { queries } from "../../queries";
import { DetailedDeviceResponseItem } from "../../models/detailedDeviceModel";

type allDevicesResponseBody = {
  devices: DetailedDeviceResponseItem[]
}

export const getAllDevicesHandler = async (c: Context) => {
  try {
    const db = c.env.DB
    const userId = c.get("userId")

    if(!userId) return c.json({message: "unable to find username"}, 400)

    const deviceEntities = await queries.devices.getAllDetailedDevices(db, userId);

    const responseDevices: DetailedDeviceResponseItem[] = deviceEntities.map(
      (deviceEntity) => {
        return {
          deviceName: deviceEntity.deviceName,
          deviceId: deviceEntity.deviceId,
          batteryMv: deviceEntity.batteryMv,
          batteryReadAt: deviceEntity.batteryReadAt
        }
    })

    return c.json({devices: responseDevices} as allDevicesResponseBody, 200);
  }
  catch(error) {
    console.error("unable to upload data", error)
    return c.json({ error: "Internal server error" }, 500);
  }
}