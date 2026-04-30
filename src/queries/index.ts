import * as devices from './deviceQueries'
import * as sensorReadings from './sensorReadingsQueries'
import * as users from './userQueries'
import * as session from './sessionQueries'

export const queries = {
    devices,
    sensorReadings,
    users,
    session
} as const