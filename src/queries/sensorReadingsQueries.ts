import { D1Database } from "@cloudflare/workers-types";
import { SensorReadingsEntity } from "../models/sensorReadingsModel";

export async function UploadReadingData(db: D1Database, readings: SensorReadingsEntity): Promise<void> {
  await db.prepare(`
    INSERT INTO sensor_readings(id, device_id, lux, pressure, humidity, temperature, battery_mv, read_at)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?)
  `)
  .bind(
    readings.id,
    readings.deviceId,
    readings.lux,
    readings.pressure,
    readings.humidity,
    readings.temperature,
    readings.batteryMv,
    readings.readAt,
  )
  .run();
}