import {Context} from 'hono'
import { queries } from '../../queries'

type UpdateDeviceNameRequestBody = {
  deviceId: string,
  name: string
}

export const updateDeviceNameHandler = async (c: Context) => {
  try{
    const body = await c.req.json<UpdateDeviceNameRequestBody>()
    const userId = c.get("userId");
    const db = c.env.DB;

    if (!body.deviceId || !body.name || !userId) return c.json({message: "incomplete body paramteres"}, 400);

    await queries.devices.updateUserDeviceName(db, body.deviceId, userId, body.name);

    return c.json(200);
  }
  catch(error) {
    console.error("unable to change device name", error)
    return c.json({ error: "Internal server error" }, 500);
  }
}