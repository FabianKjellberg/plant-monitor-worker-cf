import { Context } from 'hono'
import { queries } from '../../queries';
import { UserDeviceEntity } from '../../models/userDeviceModel';

type CreateUserDeviceRequestBody = {
  mac: string,
  name: string,
}

export const createUserDeviceHandler = async (c: Context) => {
  try{
    const db = c.env.DB;
    const userId = c.get("userId");
    const body = await c.req.json<CreateUserDeviceRequestBody>()

    if(!body.mac || !body.name) return c.json({message: "body incomplete"}, 400);

    if(!userId) return c.json({message: "unable to find username"}, 400);

    let device = await queries.devices.getDeviceFromMac(db, body.mac);

    if(!device) {
        device = await queries.devices.createDeviceFromMac(db, body.mac)
    }

    if(!device) return c.json({message: "unable to create device"}, 400);

    const userDevice: UserDeviceEntity = {
      id: crypto.randomUUID(),
      deviceId: device.id,
      userId,
      deviceName: body.name,
    }

    await queries.devices.createUserDevice(db, userDevice);

    return c.json({message: "user device created successfully"},200);
  }
  catch(e) {
    console.error("unable to upload data", e)
    return c.json({ error: "Internal server error" }, 500);
  }
}