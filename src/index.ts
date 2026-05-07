import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { uploadDataHandler } from './handlers/uploadDataHandler'
import deviceRoutes from './routes/deviceRoutes'
import sensorReadingRoutes from './routes/sensorReadingRoutes'
import authRoutes from './routes/authRoutes'
import homeRoutes from './routes/homeRoutes'

const app = new Hono()

app.use('*', logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/upload', uploadDataHandler);

app.route('/auth', authRoutes);

app.route('/device', deviceRoutes);

app.route('/readings', sensorReadingRoutes);

app.route('/home', homeRoutes);

export default app
