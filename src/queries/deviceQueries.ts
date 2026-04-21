import { D1Database } from "@cloudflare/workers-types";
import { DeviceEntity, DeviceMapper, DeviceRow } from "../models/deviceModel";

export async function GetDeviceFromMac(db: D1Database, macAdress: string): Promise<DeviceEntity | null> {
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

export async function CreateDeviceFromMac(db: D1Database, macAdress: string): Promise<DeviceEntity> {
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