import { Context } from "hono"
import { SensorReadingsEntity } from "../../models/sensorReadingsModel"
import { queries } from "../../queries"

type ReadingResponse = {
  lux?: number,
  pressure?: number,
  humidity?: number,
  temperature?: number,
  batteryMv?: number,
  readAt: string,
}

type GetDeviceReadingsResponse = {
  deviceId: string,
  readings: SensorReadingsEntity[]
}

export const getReadingsFromIdHandler = async (c: Context) => {
  try {
    const deviceId = c.req.param('deviceId')
    const db = c.env.DB;

    if(!deviceId) {
      return c.json({message: "no device id given"}, 400);
    }

    const readings = await queries.sensorReadings.getDataFromDeviceId(db, deviceId);

    const response: GetDeviceReadingsResponse = {
      deviceId,
      readings,
    }  

    return c.json(response, 200);
  }
  catch(error) {
    console.error("unable to fetch data", error)
    return c.json({ error: "Internal server error" }, 500);
  }
}
