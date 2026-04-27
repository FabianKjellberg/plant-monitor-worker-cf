import { Context } from 'hono'
import { queries } from '../../queries'
import { SensorReadingsEntity } from '../../models/sensorReadingsModel'
import { D1Database } from '@cloudflare/workers-types'
import { toSqliteTimestamp } from '../../helpers/timeHelper'

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
  readings: ReadingResponse[]
}

export const getReadingsFromRangeHandler = async (c: Context) => {
  try{
    const from = c.req.param("from");
    const to = c.req.param("to");
    const deviceId = c.req.param("deviceId");
    const db: D1Database = c.env.DB;

    console.log(`DEBUG: [${from}]`);
    console.log(`DEBUG: [${to}]`);
    console.log(`DEBUG: [${deviceId}]`);

    if(!from || !to || !deviceId) return c.json({message: "missing parameters"},400)

    const convertedFrom = toSqliteTimestamp(from);
    const convertedTo = toSqliteTimestamp(to);

    console.log(`DEBUG: [${convertedFrom}]`);
    console.log(`DEBUG: [${convertedTo}]`);

    const readings: SensorReadingsEntity[] = 
      await queries.sensorReadings.getRangeFromDeviceId(db, convertedFrom, convertedTo, deviceId);

    console.log(readings.length)

    const readingsTest = await queries.sensorReadings.getRangeFromDeviceId(
      db, 
      "2026-04-26T16:43:53.819333Z", 
      "2026-04-27T16:43:53.819333Z", 
      "ce193945-cdb6-4c55-a851-d65ce13a9a08"
    );

    console.log(readingsTest.length)

    const response: GetDeviceReadingsResponse = {
      deviceId: deviceId,
      readings: readings.map((reading) => 
        { return {
          lux: reading.lux, 
          pressure: reading.pressure,
          humidity: reading.humidity,
          temperature: reading.temperature,
          batteryMv: reading.batteryMv,
          readAt: reading.readAt,
        }
      })
    } 

    return c.json(response, 200);

  }
  catch(error) {
    console.error("unable to fetch data", error)
    return c.json({ error: "Internal server error" }, 500);
  }
}