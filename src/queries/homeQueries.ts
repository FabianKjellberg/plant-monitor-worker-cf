import { D1Database } from "@cloudflare/workers-types"
import { HomeEntity, HomeMapper, HomeRow } from "../models/homeModel"
import { parseRole, UserHomeRole } from "../models/userHomeModel"
import { DetailedHome, DetailedHomeMapper, DetailedHomeRow } from "../models/detailedHomeModel";
import { RoomEntity, RoomMapper, RoomRow } from "../models/roomModel";
import { PlaceEntity, PlaceMapper, PlaceRow } from "../models/placeModel";

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

type RoleResult = { role: string };

export const getRoleFromDeviceId = async (db: D1Database, deviceId: string, userId: string): Promise<UserHomeRole> => {
  const res = await db
  .prepare(/* sql */`
    SELECT uh.role 
    FROM devices AS d 
    JOIN home AS h 
      ON d.home_id = h.id
    JOIN user_home AS uh
      ON uh.home_id = h.id
    WHERE uh.user_id = ?
    AND d.id = ?
  `)
  .bind(userId, deviceId)
  .first<RoleResult>()

  if(!res) return UserHomeRole.NONE;

  return parseRole(res.role);
}

export const getRoleFromHomeId = async (db: D1Database, homeId: string, userId: string): Promise<UserHomeRole> => {
  const res = await db
  .prepare(/* sql */`
    SELECT role 
    FROM user_home
    WHERE user_id = ?
    AND home_id = ?
  `)
  .bind(userId, homeId)
  .first<RoleResult>()

  if(!res) return UserHomeRole.NONE;

  return parseRole(res.role);
}

export const getRoleFromRoomId = async (db: D1Database, roomId: string, userId: string): Promise<UserHomeRole> => {
  const res = await db
  .prepare(/* sql */`
    SELECT uh.role 
    FROM room as r
    JOIN user_home as uh
      ON uh.home_id = r.home_id
    WHERE uh.user_id = ?
    AND r.id = ?
  `)
  .bind(userId, roomId)
  .first<RoleResult>()

  if(!res) return UserHomeRole.NONE;

  return parseRole(res.role);
}

export const getRoleFromPlaceId = async (db: D1Database, placeId: string, userId: string): Promise<UserHomeRole> => {
  const res = await db
  .prepare(/* sql */`
    SELECT uh.role 
    FROM place as p
    JOIN room as r
      ON r.id = p.room_id
    JOIN user_home as uh
      ON uh.home_id = r.home_id
    WHERE uh.user_id = ?
    AND p.id = ?
  `)
  .bind(userId, placeId)
  .first<RoleResult>()

  if(!res) return UserHomeRole.NONE;

  return parseRole(res.role);
}

export const getAllHomesFromUserId = async (db: D1Database, userId: string): Promise<DetailedHome[]> => {
  const res = await db
    .prepare(/* sql */`
      SELECT
        h.id AS home_id,
        h.name AS home_name,
        r.id AS room_id,
        r.name AS room_name,
        r.icon AS room_icon,
        p.id AS place_id,
        p.name AS place_name,
        p.icon AS place_icon,
        d.id AS device_id,
        d.name AS device_name,
        d.device_type AS device_type,
        d.last_battery_mv AS device_battery_mv
      FROM user_home AS uh                  
      JOIN home AS h 
        ON uh.home_id = h.id 
      LEFT JOIN room AS r 
        ON h.id = r.home_id
      LEFT JOIN place AS p 
        ON r.id = p.room_id 
      LEFT JOIN devices AS d 
        ON p.id = d.place_id
      WHERE uh.user_id = ?
    `)
    .bind(userId)
    .all<DetailedHomeRow>()

  if(!res.success) throw new Error("unable to fetch homes")

  return DetailedHomeMapper.fromRows(res.results);
}

export const createRoom = async (
  db: D1Database, 
  homeId: string, 
  name: string, 
  icon?: string
): Promise<RoomEntity> => {
  const id = crypto.randomUUID();
  
  const createStatement = db
    .prepare(/* sql */`
      INSERT INTO room (id, home_id, name, icon)
        VALUES(?, ?, ?, ?)
    `)
    .bind(id, homeId, name, icon);

  const selectStatement = db
    .prepare(/* sql */`
      SELECT * FROM room WHERE id = ?
    `)
    .bind(id)

  const res = await db.batch([createStatement, selectStatement])

  const roomRow = res[1].results?.[0] as RoomRow | undefined

  if(!roomRow) throw new Error("unable to create room")

  return RoomMapper.fromRow(roomRow);
} 

export const createPlace = async (
  db: D1Database, 
  roomId: string, 
  name: string, 
  icon?: string
): Promise<PlaceEntity> => {
  const id = crypto.randomUUID();
  
  const createStatement = db
    .prepare(/* sql */`
      INSERT INTO place (id, room_id, name, icon)
        VALUES(?, ?, ?, ?)
    `)
    .bind(id, roomId, name, icon);

  const selectStatement = db
    .prepare(/* sql */`
      SELECT * FROM place WHERE id = ?
    `)
    .bind(id)

  const res = await db.batch([createStatement, selectStatement])

  const roomRow = res[1].results?.[0] as PlaceRow | undefined

  if(!roomRow) throw new Error("unable to create room")

  return PlaceMapper.fromRow(roomRow);
}

export async function deleteRoom(db: D1Database, roomId: string): Promise<void> {
  await db
  .prepare(/* sql */`
    DELETE FROM room 
    WHERE id = ?
  `)
  .bind(roomId)
  .run()
}

export async function deletePlace(db: D1Database, placeId: string): Promise<void> {
  await db
  .prepare(/* sql */`
    DELETE FROM place 
    WHERE id = ?
  `)
  .bind(placeId)
  .run()
}

export async function renameRoom(
  db: D1Database, 
  roomId: string, 
  name: string
): Promise<void> {
  await db
  .prepare(/* sql */`
    UPDATE room 
    SET name = ?
    WHERE id = ?
  `)
  .bind(name, roomId)
  .run()
}

export async function renamePlace(
  db: D1Database, 
  placeId: string, 
  name: string
): Promise<void> {
  await db
  .prepare(/* sql */`
    UPDATE place 
    SET name = ?
    WHERE id = ?
  `)
  .bind(name, placeId)
  .run()
}