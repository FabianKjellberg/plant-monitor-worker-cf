import { Context } from 'hono'
import { queries } from '../../queries'
import { UserHomeRole } from '../../models/userHomeModel'

type DeleteRoomRequestBody = {
  roomId: string
}

export const deleteRoomHandler = async (c: Context) => {
  try {
    const userId = c.get("userId")
    const db = c.env.DB
    const body = await c.req.json<DeleteRoomRequestBody>()

    if(!body.roomId || !userId) return c.json({message: "invalid parameters"}, 400)

    const role = await queries.home.getRoleFromRoomId(db, body.roomId, userId);

    if(role != UserHomeRole.ADMIN)
      return c.json({message: "forbidden action"}, 403)

    await queries.home.deleteRoom(db, body.roomId)

    return c.json({message: "sucessfully deleted room"},200)  
  }
  catch(e) {
    console.error("unable to delete room", e)
    return c.json({error: "internal server error"}, 500)
  }
}