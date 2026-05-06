import * as devices from './deviceQueries'
import * as sensorReadings from './sensorReadingsQueries'
import * as users from './userQueries'
import * as session from './sessionQueries'
import * as home from './homeQueries'

export const queries = {
    devices,
    sensorReadings,
    users,
    session,
    home
} as const