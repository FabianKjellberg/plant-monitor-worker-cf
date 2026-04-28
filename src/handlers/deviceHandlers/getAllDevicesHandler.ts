import { Context } from "hono";
import { queries } from "../../queries";
import { DetailedDeviceResponseItem } from "../../models/detailedDeviceModel";

type allDevicesResponseBody = {
  devices: DetailedDeviceResponseItem[]
}

export const getAllDevicesHandler = async (c: Context) => {
  try {
    const db = c.env.DB

    const deviceEntities = await queries.devices.getAllDetailedDevices(db);

    const responseDevices: DetailedDeviceResponseItem[] = deviceEntities.map(
      (deviceEntity) => {
        return {
          name: null,
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