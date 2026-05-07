import { Context } from "hono";
import { queries } from "../../queries";
import { DetailedHome } from "../../models/detailedHomeModel";

type GetAllHomesResponseBody = {
  homes: DetailedHome[]
}

export const getAllHomesHandler = async (c: Context) => {
  try {
    const userId = await c.get("userId");
    const db = c.env.DB;

    const homes = await queries.home.getAllHomesFromUserId(db, userId)

    return c.json({homes} as GetAllHomesResponseBody, 200);
  }
  catch(error) {
    console.error("unable to fetch userHomes", error)
    return c.json({ error: "Internal server error" }, 500);
  }
}