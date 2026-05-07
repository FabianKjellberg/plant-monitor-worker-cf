export type DetailedDeviceHome = {
  name: string,
  id: string,
  devices: DetailedDevice[]
}

export type DetailedDevice = {
  id: string,
  name?: string,
  batteryMv?: number,
  batteryReadAt?: string,
  placeId?: string,
}

export type DetailedDeviceRow = {
  battery_mv?: number,
  battery_read_at?: string,
  home_name: string, 
  home_id: string,
  device_id?: string,
  device_name?: string,
  place_id?: string,
}

export const DetailedDeviceMapper = {
  fromRows: (rows :DetailedDeviceRow[]): DetailedDeviceHome[] => {
    const homeMap: Record<string, DetailedDeviceHome> = {};

    rows.forEach((row) => {
      if(!homeMap[row.home_id]) {
        homeMap[row.home_id] = {
          id: row.home_id,
          name: row.home_name,
          devices: []
        }
      }
      
      if(row.device_id) {
        homeMap[row.home_id].devices.push({
          id: row.device_id,
          name: row.device_name,
          batteryMv: row.battery_mv,
          batteryReadAt: row.battery_read_at,
          placeId: row.place_id,
        })
      }
    })
    
    return Object.values(homeMap);
  }
}
