export type DeviceEntity = {
  id: string,
  macAdress: string,
  name: string,
  homeId?: string,
  placeId?: string,
  createdAt?: string,
}

export type DeviceRow = {
  id: string,
  mac_addr: string,
  name: string,
  home_id?: string,
  place_id?: string,
  created_at?: string,
}

export const DeviceMapper = {
  fromRow: (device: DeviceRow): DeviceEntity => {
    return {
      id: device.id,
      macAdress: device.mac_addr,
      name: device.name,
      homeId: device.home_id,
      placeId: device.place_id,
      createdAt: device.created_at,
    }
  },
  toRow: (device: DeviceEntity): DeviceRow => {
    return {
      id: device.id,
      mac_addr: device.macAdress,
      name: device.name,
      home_id: device.homeId,
      place_id: device.placeId,
      created_at: device.createdAt,
    }
  }
}

