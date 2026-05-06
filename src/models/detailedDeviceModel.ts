export type DetailedDeviceResponseItem = {
    deviceName: string | null,
    deviceId: string,
    batteryMv: number | null,
    batteryReadAt: string | null
}

export type DetailedDeviceEntity = {
  deviceId: string;
  macAdress: string;
  createdAt: string;
  batteryMv: number | null;
  batteryReadAt: string | null;
  deviceName: string
}

export type DetailedDeviceRow = {
  id: string;
  mac_addr: string;
  created_at: string;
  battery_mv: number | null; 
  read_at: string | null;
  device_name: string
}

export const DetailedDeviceMapper = {
  fromRow: (device: DetailedDeviceRow): DetailedDeviceEntity => {
    return {
      deviceId: device.id,
      macAdress: device.mac_addr,
      createdAt: device.created_at,
      batteryMv: device.battery_mv,
      batteryReadAt: device.read_at,
      deviceName: device.device_name
    }
  },
  toRow: (device: DetailedDeviceEntity): DetailedDeviceRow => {
    return {
      id: device.deviceId,
      mac_addr: device.macAdress,
      created_at: device.createdAt,
      battery_mv: device.batteryMv,
      read_at: device.batteryReadAt,
      device_name: device.deviceName
    }
  }
}