import * as devices from './deviceQueries'
import * as sensorReadings from './sensorReadingsQueries'

export const queries = {
    devices,
    sensorReadings
} as const