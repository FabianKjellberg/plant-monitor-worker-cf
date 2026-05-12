export type ReadingResponse = {
  lux?: number,
  pressure?: number,
  humidity?: number,
  temperature?: number,
  batteryMv?: number,
  readAt: string,
}

export type SensorReadingsEntity = {
  id: string,
  deviceId: string,
  placeId?: string,
  lux?: number,
  pressure?: number,
  humidity?: number,
  temperature?: number,
  batteryMv?: number,
  readAt: string,
  createdAt?: string
}

export type SensorReadingsRow = {
  id: string,
  device_id: string,
  place_id?: string,
  lux?: number,
  pressure?: number,
  humidity?: number,
  temperature?: number,
  battery_mv?: number,
  read_at: string,
  created_at?: string
}

export const SensorReadingsMapper = {
  fromRow: (readings: SensorReadingsRow): SensorReadingsEntity => {
    return {
      id: readings.id,
      deviceId: readings.device_id,
      placeId: readings.place_id,
      lux: readings.lux,
      pressure: readings.pressure,
      humidity: readings.humidity,
      temperature: readings.temperature,
      batteryMv: readings.battery_mv,
      readAt: readings.read_at,
      createdAt: readings.created_at,
    }
  },
  toRow: (readings: SensorReadingsEntity): SensorReadingsRow => {
    return {
      id: readings.id,
      device_id: readings.deviceId,
      place_id: readings.placeId,
      lux: readings.lux,
      pressure: readings.pressure,
      humidity: readings.humidity,
      temperature: readings.temperature,
      battery_mv: readings.batteryMv,
      read_at: readings.readAt,
      created_at: readings.createdAt
    }
  }
}