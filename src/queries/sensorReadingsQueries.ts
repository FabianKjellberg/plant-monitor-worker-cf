import { D1Database } from "@cloudflare/workers-types";
import { SensorReadingsEntity, SensorReadingsMapper, SensorReadingsRow } from "../models/sensorReadingsModel";

export async function uploadReadingData(db: D1Database, readings: SensorReadingsEntity): Promise<void> {
  const insertReading = db.prepare(`
    INSERT INTO sensor_readings(id, device_id, place_id, lux, pressure, humidity, temperature, battery_mv, read_at)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    readings.id,
    readings.deviceId,
    readings.placeId,
    readings.lux,
    readings.pressure,
    readings.humidity,
    readings.temperature,
    readings.batteryMv,
    readings.readAt,
  );

  const updateDevice = db.prepare(`
    UPDATE devices
    SET last_battery_mv = ?, last_battery_read_at = ?
    WHERE id = ?
  `).bind(
    readings.batteryMv, 
    readings.readAt, 
    readings.deviceId
  );

  await db.batch([insertReading, updateDevice]);
}

export async function getDataFromDeviceId(db: D1Database, id: string): Promise<SensorReadingsEntity[]> {
  const res = await db.prepare(`
    SELECT * FROM sensor_readings 
    WHERE device_id = ?
  `)
  .bind(id)
  .all<SensorReadingsRow>();

  if(!res.success) {
    throw new Error("failed fetching sensor data");
  }

  return res.results.map((row) => SensorReadingsMapper.fromRow(row));
}

export async function getRangeFromDeviceId(db: D1Database, from: string, to: string, deviceId: string): Promise<SensorReadingsEntity[]> {
  const res = await db.prepare(`
    SELECT * FROM sensor_readings
    WHERE device_id = ?
    AND read_at BETWEEN ? AND ?
  `)
  .bind(deviceId, from, to)
  .all<SensorReadingsRow>();
  
  if(!res.success) {
    throw new Error("failed fetching sensor data");
  }

  return res.results.map((row) => SensorReadingsMapper.fromRow(row));
}