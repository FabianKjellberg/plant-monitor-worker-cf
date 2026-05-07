import { DeviceType, parseDeviceType } from "./deviceModel"

export type DetailedHome = {
  id: string,
  name: string,
  rooms: DetailedHomeRoom[]
}

export type DetailedHomeRoom = {
  id: string,
  name: string,
  icon?: string,
  places: DetailedHomePlace[]
}

export type DetailedHomePlace = {
  id: string,
  name: string,
  icon?: string,
  devices: DetailedHomeDevice[], 
}

export type DetailedHomeDevice = {
  id: string,
  name?: string,
  type: DeviceType,
  batteryMv?: number,
}

export type DetailedHomeRow = {
  home_id: string,
  home_name: string,
  room_id?: string,
  room_name?: string,
  room_icon?: string,
  place_id?: string,
  place_name?: string,
  place_icon?: string,
  device_id?: string,
  device_name?: string,
  device_type?: string,
  device_battery_mv?: number,
}

export const DetailedHomeMapper = {
  fromRows: (rows: DetailedHomeRow[]): DetailedHome[] => {
    const homeMap: Record<string, DetailedHome> = {}
    const roomMap: Record<string, DetailedHomeRoom> = {}
    const placeMap: Record<string, DetailedHomePlace> = {}

    for(const row of rows) {
      if (!homeMap[row.home_id]) {
        homeMap[row.home_id] = {
          id: row.home_id,
          name: row.home_name,
          rooms: []
        }
      }

      if(row.room_id && !roomMap[row.room_id]) {
        roomMap[row.room_id] = {
          id: row.room_id,
          name: row.room_name ?? "unknown",
          icon: row.room_icon,
          places: []
        }
        homeMap[row.home_id].rooms.push(roomMap[row.room_id])
      }    

      if(row.place_id && !placeMap[row.place_id] && row.room_id) {
        placeMap[row.place_id] = {
          id: row.place_id,
          name: row.place_name ?? "unknown",
          icon: row.place_icon,
          devices: []
        }
        roomMap[row.room_id].places.push(placeMap[row.place_id])
      }

      if(row.device_id && row.place_id && placeMap[row.place_id]) {
        placeMap[row.place_id].devices.push({
          id: row.device_id,
          name: row.device_name,
          batteryMv: row.device_battery_mv,
          type: parseDeviceType(row.device_type)
        })
      }
    }

    return Object.values(homeMap)
  }
}