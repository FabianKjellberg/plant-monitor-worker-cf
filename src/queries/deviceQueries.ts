import { D1Database } from "@cloudflare/workers-types";
import { DeviceEntity, DeviceMapper, DeviceRow } from "../models/deviceModel";
import { DetailedDeviceHome, DetailedDeviceMapper, DetailedDeviceRow } from "../models/detailedDeviceModel";

export async function getDeviceFromMac(db: D1Database, macAdress: string): Promise<DeviceEntity | null> {
  const res = await db
  .prepare(`
    SELECT * FROM devices
    WHERE mac_addr = ?  
  `)
  .bind(
    macAdress
  )
  .first<DeviceRow>();

    return res ? DeviceMapper.fromRow(res) : null
}

export async function createDeviceFromMac(db: D1Database, macAdress: string): Promise<DeviceEntity> {
  const id = crypto.randomUUID();
  
  await db
  .prepare(`
    INSERT INTO devices(id, mac_addr)
      VALUES(?, ?)
  `)
  .bind(id, macAdress)
  .run();

  const device = await db
  .prepare(`
    SELECT * FROM devices
    WHERE mac_addr = ?  
  `)
  .bind(
    macAdress
  )
  .first<DeviceRow>();

  if(!device) throw new Error("unable to get newly created device")

  return DeviceMapper.fromRow(device);
}

export async function getAllDetailedDevices(db: D1Database, userId: string): Promise<DetailedDeviceHome[]> {
  const res = await db
  .prepare(`
    SELECT 
      d.last_battery_read_at AS battery_read_at,
      d.last_battery_mv AS battery_mv,
      d.id AS device_id,
      d.name AS device_name,
      d.place_id AS place_id,
      d.device_type AS device_type,
      h.id AS home_id,
      h.name AS home_name
    FROM user_home AS uh
    JOIN home AS h 
      ON uh.home_id = h.id
    LEFT JOIN devices AS d
      ON d.home_id = h.id
    WHERE uh.user_id = ?
  `)
  .bind(userId)
  .all<DetailedDeviceRow>()

  if(!res.success) {
    throw new Error("unable to get devices");
  }

  return DetailedDeviceMapper.fromRows(res.results);
}

export async function updateDeviceName(db: D1Database, deviceId: string, name: String): Promise<void> {
  await db
  .prepare(`
    UPDATE devices
    SET name = ?
    WHERE id = ?
  `)
  .bind(name, deviceId)
  .run();
}

export async function addDeviceToHome(
  db: D1Database, 
  deviceId: string, 
  name: string, 
  homeId: string, 
  placeId?: string
): Promise<void> {
  await db
    .prepare(/* sql */`
      UPDATE devices
      SET name = ?, place_id = ?, home_id = ?
      WHERE id = ?
    `)
    .bind(name, placeId, homeId, deviceId)
    .run();
}

export async function asignDeviceToPlace(
  db: D1Database,
  deviceId: string,
  placeId: string,
): Promise<void> {
  await db
    .prepare( /* sql */`
      UPDATE devices
      SET place_id = ?
      WHERE id = ?
    `)
    .bind(placeId, deviceId)
    .run();
}

export async function unassignDevice(db: D1Database, deviceId: String): Promise<void> {
  await db
  .prepare(/* sql */`
    UPDATE devices
    SET place_id = null, home_id = null
    WHERE id = ?
  `)
  .bind(deviceId)
  .run()
}