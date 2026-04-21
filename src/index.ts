import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { uploadDataHandler } from './handlers/uploadDataHandler'

const app = new Hono()

app.use('*', logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/upload', uploadDataHandler)

export default app
