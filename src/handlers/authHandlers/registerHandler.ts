import { Context } from "hono"
import { queries } from "../../queries"
import type { D1Database } from "@cloudflare/workers-types"
import { hash } from "bcryptjs"
import { HomeEntity } from "../../models/homeModel"
import { UserHomeRole } from "../../models/userHomeModel"

type RegisterBody = {
  username: string;
  password: string;
  homeId?: string;
  homeName?: string;
}

/**
 * registers a new user
 * @param c - request context object
 * @returns a JSON response with a message and a status code
 */
export const registerHandler = async (c: Context) => {
  try {
    const body = await c.req.json<RegisterBody>();

    if(body.homeId == undefined && body.homeName == undefined) {
      return c.json("need to either register with a homeId or a homeName")
    }

    const db = c.env.DB as D1Database;

    const userNameExists = await queries.users.usernameExists(db, body.username);

    // return early if the username already exists
    if (userNameExists) {
      return c.json({ error: 'username already exists' }, 409);
    }

    const userId = crypto.randomUUID();

    const passwordHash = await hash(body.password, 10);

    await queries.users.createUser(db, 
      { 
        id: userId, 
        username: body.username, 
        passwordHash 
      }
    )

    if(body.homeName != undefined) {
      const home: HomeEntity = await queries.home.createHome(db, body.homeName)

      await queries.home.createUserHome(db, userId, home.id, UserHomeRole.ADMIN)
    }
    else if (body.homeId != undefined) {
      await queries.home.createUserHome(db, userId, body.homeId, UserHomeRole.VIEWER)
    }

    return c.json({ message: 'user created successfully' }, 200);
  }
  catch (error) {
    console.error('Error registering user:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }

}