import { Context } from "hono"
import { queries } from "../../queries"
import { UserHomeRole } from "../../models/userHomeModel"
import { ReadingResponse } from "../../models/sensorReadingsModel"

type getReadingsForPlaceResponseBody = {
  placeId: string,
  readings: ReadingResponse[]
}

export const getReadingsForPlaceHandler = async (c: Context) => {
  try {
    const placeId = c.req.param("placeId")
    const userId: string = c.get("userId")
    const db = c.env.DB

    if(!placeId || !userId) return c.json({message: "missing parameters"}, 400);

    const role = await queries.home.getRoleFromPlaceId(db, placeId, userId)

    if (role == UserHomeRole.NONE) {
      return c.json({message: "forbidden action"}, 403);
    }

    const sensorReadings = await queries.sensorReadings.getDataForPlaceId(db, placeId)

    return c.json({
      placeId: placeId,
      readings: sensorReadings.map((reading) => {
        return {
          lux: reading.lux,
          pressure: reading.pressure,
          humidity: reading.humidity,
          temperature: reading.temperature,
          batteryMv: reading.batteryMv,
          readAt: reading.readAt,
        }
      })
    } as getReadingsForPlaceResponseBody, 200)
  }
  catch(error) {
    console.error("unable to fetch readings for place", error)
    return c.json({ error: "Internal server error" }, 500);
  }
}