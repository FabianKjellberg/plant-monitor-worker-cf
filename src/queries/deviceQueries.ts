import { D1Database } from "@cloudflare/workers-types";
import { DeviceEntity, DeviceMapper, DeviceRow } from "../models/deviceModel";
import { DetailedDeviceEntity, DetailedDeviceMapper, DetailedDeviceRow } from "../models/detailedDeviceModel";

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

export async function getAllDetailedDevices(db: D1Database, userId: string): Promise<DetailedDeviceEntity[]> {
  fix
  const res = await db.prepare(`
    SELECT d.*, r.read_at, r.battery_mv, ud.device_name FROM devices ud 
    JOIN devices d
      ON d.id = ud.device_id
    LEFT JOIN sensor_readings r
      ON r.id = (
        SELECT id
        FROM sensor_readings
        WHERE device_id = d.id
        ORDER BY read_at DESC
        LIMIT 1
      )
    WHERE ud.user_id = ?
    `).bind(userId).all<DetailedDeviceRow>()

  if(!res.success) {
    throw new Error("unable to get devices");
  }

  return res.results.map((row) => DetailedDeviceMapper.fromRow(row));
}

export async function updateUserDeviceName(db: D1Database, deviceId: string, userId: String, name: String): Promise<void> {
  fix
  await db
  .prepare(`
    UPDATE user_devices
    SET device_name = ?
    WHERE user_id = ?
    AND device_id = ?
  `)
  .bind(name, userId, deviceId)
  .run();
}

export async function addDeviceToHome(db: D1Database, deviceId: string, name: string, homeId: string, placeId: string): Promise<void> {
  await db
    .prepare(`
      UPDATE devices
      SET name = ?, place_id = ?, home_id = ?
      WHERE deviceId = ?
    `)
    .bind(name, placeId, homeId, deviceId)
    .run();
}