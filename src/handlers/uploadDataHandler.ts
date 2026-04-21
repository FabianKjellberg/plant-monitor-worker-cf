import { Context } from "hono"

type UploadDataBody = {
  humidity: number,
  lux: number,
  pressure: number,
  temperature: number,
}

export const uploadDataHandler = async (c: Context) => {
  try {
    const body = await c.req.json<UploadDataBody>();

    console.log(body);

    console.log()

    return c.json({message: "success"}, 200)
  }
  catch(error) {
    console.error("unable to upload data", error)
    return c.json({ error: "Internal server error" }, 500);
  }
}