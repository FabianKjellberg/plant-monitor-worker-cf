import { Context } from "hono"
import { queries } from "../queries";
import { SensorReadingsEntity } from "../models/sensorReadingsModel";

type UploadDataBody = {
  macAdress: string,
  humidity: number,
  lux: number,
  pressure: number,
  temperature: number,
  batteryMv: number,
  readTime: string,
}

export const uploadDataHandler = async (c: Context) => {
  try {
    const body = await c.req.json<UploadDataBody>();
    const db = await c.env.DB;

    let device = await queries.devices.GetDeviceFromMac(db, body.macAdress);

    if(!device) {
      device = await queries.devices.CreateDeviceFromMac(db, body.macAdress);
    }

    const readingId = crypto.randomUUID();
    
    const readings: SensorReadingsEntity = {
      id: readingId,
      deviceId: device.id,
      lux: body.lux,
      pressure: body.pressure,
      humidity: body.humidity,
      temperature: body.temperature,
      batteryMv: body.batteryMv,
      readAt: body.readTime,
    }

    await queries.sensorReadings.UploadReadingData(db, readings);

    return c.json({message: "success"}, 200)
  }
  catch(error) {
    console.error("unable to upload data", error)
    return c.json({ error: "Internal server error" }, 500);
  }
}