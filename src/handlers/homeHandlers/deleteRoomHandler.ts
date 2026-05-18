import { Context } from 'hono'
import { queries } from '../../queries'
import { UserHomeRole } from '../../models/userHomeModel'

export const deleteRoomHandler = async (c: Context) => {
  try {
    const userId = c.get("userId")
    const db = c.env.DB
    const roomId = c.req.param("roomId")

    if(!roomId || !userId) return c.json({message: "invalid parameters"}, 400)

    const role = await queries.home.getRoleFromRoomId(db, roomId, userId);

    if(role != UserHomeRole.ADMIN)
      return c.json({message: "forbidden action"}, 403)

    await queries.home.deleteRoom(db, roomId)

    return c.json({message: "sucessfully deleted room"},200)  
  }
  catch(e) {
    console.error("unable to delete room", e)
    return c.json({error: "internal server error"}, 500)
  }
}