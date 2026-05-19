import { Context } from 'hono'
import { queries } from '../../queries'
import { UserHomeRole } from '../../models/userHomeModel'

export const deletePlaceHandler = async (c: Context) => {
  try {
    const userId = c.get("userId")
    const db = c.env.DB
    const placeId = c.req.param("placeId")

    if(!userId || !placeId) 
      return c.json({message: "invalid parameters"}, 400)

    const role = await queries.home.getRoleFromPlaceId(db, placeId, userId)

    if(role != UserHomeRole.ADMIN) 
      return c.json({message: "forbidden action"}, 403);

    await queries.home.deletePlace(db, placeId);

    return c.json({message: "successfully deleted place"}, 200)
  }
  catch (e){
    console.error("unable to delete place", e)
    return c.json({ error: "Internal server error" }, 500);
  }
}