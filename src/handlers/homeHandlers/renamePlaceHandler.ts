import { Context } from 'hono'
import { queries } from '../../queries'
import { UserHomeRole } from '../../models/userHomeModel'

type RenamePlaceRequestBody = {
  placeId: string,
  name: string,
}

export const renamePlaceHandler = async (c: Context) => {
  try {
    const userId = c.get("userId")
    const db = c.env.DB
    const { placeId, name } = await c.req.json<RenamePlaceRequestBody>()

    if(!userId || !name || !placeId || name.trim() === "") 
      return c.json({message: "invalid parameters"}, 400)

    const role = await queries.home.getRoleFromPlaceId(db, placeId, userId)

    if(role != UserHomeRole.ADMIN && role != UserHomeRole.MEMBER) 
      return c.json({message: "forbidden action"}, 403);

    await queries.home.renamePlace(db, placeId, name.trim());

    return c.json({message: "successfully changed place name"}, 200)
  }
  catch (e){
    console.error("unable to rename place", e)
    return c.json({ error: "Internal server error" }, 500);
  }
}