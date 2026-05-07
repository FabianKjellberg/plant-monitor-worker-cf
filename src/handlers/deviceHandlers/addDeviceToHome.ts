import { Context } from 'hono'
import { queries } from '../../queries';

type AddDeviceToHomeRequestBody = {
  mac: string,
  name: string,
  homeId: string,
  placeId?: string
}

export const addDeviceToHomeHandler = async (c: Context) => {
  try{
    const db = c.env.DB;
    const userId = c.get("userId");
    const body = await c.req.json<AddDeviceToHomeRequestBody>()

    if(!body.mac || !body.name) return c.json({message: "body incomplete"}, 400);

    if(!userId) return c.json({message: "unable to find username"}, 400);

    let device = await queries.devices.getDeviceFromMac(db, body.mac);

    if(!device) {
        device = await queries.devices.createDeviceFromMac(db, body.mac)
    }

    if(device.homeId != undefined) {
      return c.json({message: "device already assigned to a home"}, 400);
    }

    if(!device) return c.json({message: "unable to create device"}, 400);

    await queries.devices.addDeviceToHome(db, device.id, body.name, body.homeId, body.placeId);

    return c.json({message: "user home added to device successfully"},200);
  }
  catch(e) {
    console.error("unable to upload data", e)
    return c.json({ error: "Internal server error" }, 500);
  }
}