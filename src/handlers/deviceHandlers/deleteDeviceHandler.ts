import { Context } from 'hono'
import { queries } from '../../queries'
import { UserHomeRole } from '../../models/userHomeModel'

export const deleteDeviceHandler = async (c: Context) => {
  try {
    const userId = c.get("userId")
    const db = c.env.DB
    const deviceId = c.req.param("deviceId")

    if(!userId || !deviceId) 
      return c.json({message: "invalid parameters"}, 400)

    const role = await queries.home.getRoleFromDeviceId(db, deviceId, userId)

    if(role != UserHomeRole.ADMIN) 
      return c.json({message: "forbidden action"}, 403);

    await queries.devices.unassignDevice(db, deviceId);

    return c.json({message: "successfully deleted device"}, 200)
  }
  catch (e){
    console.error("unable to delete device", e)
    return c.json({ error: "Internal server error" }, 500);
  }
}