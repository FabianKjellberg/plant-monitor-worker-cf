import { D1Database } from "@cloudflare/workers-types"
import { HomeEntity, HomeMapper, HomeRow } from "../models/homeModel"
import { UserHomeRole } from "../models/userHomeModel"

export const createUserHome = async (
  db: D1Database, 
  userId: string, 
  homeId: string, 
  role: UserHomeRole
): Promise<void> => {
  const userHomeId = crypto.randomUUID();
  
  await db
    .prepare(`
      INSERT INTO user_home (id, home_id, user_id, role)
        VALUES (?, ?, ?, ?)
    `)
    .bind(
      userHomeId,
      homeId,
      userId,
      role
    )
    .run()
}

export const createHome = async (db: D1Database, name: string): Promise<HomeEntity> => {
  const homeId = crypto.randomUUID();
  
  await db
    .prepare(`
      INSERT INTO home (id, name) 
        VALUES (?, ?)
    `)
    .bind(homeId, name)
    .run();

  const home = await db
    .prepare(`SELECT * FROM home WHERE id = ?`)
    .bind(homeId)
    .first<HomeRow>();

  if(!home) throw new Error("failed creating home")

  return HomeMapper.fromRow(home);
}