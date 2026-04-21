export type DeviceEntity = {
  id: string,
  macAdress: string,
  createdAt?: string,
}

export type DeviceRow = {
  id: string,
  mac_addr: string,
  created_at?: string,
}

export const DeviceMapper = {
  fromRow: (device: DeviceRow): DeviceEntity => {
    return {
      id: device.id,
      macAdress: device.mac_addr,
      createdAt: device.created_at,
    }
  },
  toRow: (device: DeviceEntity): DeviceRow => {
    return {
      id: device.id,
      mac_addr: device.macAdress,
      created_at: device.createdAt,
    }
  }
}