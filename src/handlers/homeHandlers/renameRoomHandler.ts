import { Context } from 'hono'
import { queries } from '../../queries'
import { UserHomeRole } from '../../models/userHomeModel'

type RenameRoomRequestBody = {
  roomId: string,
  name: string,
}

export const renameRoomHandler = async (c: Context) => {
  try {
    const userId = c.get("userId")
    const db = c.env.DB
    const body = await c.req.json<RenameRoomRequestBody>()

    if(!body || !userId) return c.json({message: "invalid parameters"}, 400);

    const role = await queries.home.getRoleFromRoomId(db, body.roomId, userId)

    if(role != UserHomeRole.ADMIN && role != UserHomeRole.MEMBER)
      return c.json({message: "forbidden action"}, 403)

    await queries.home.renameRoom(db, body.roomId, body.name)

    return c.json({message: "succesfully renamed room"}, 200)
  }
  catch(e) {
    console.error("unable to rename room", e)
    return c.json({error: "internal server error"}, 500)
  }
}