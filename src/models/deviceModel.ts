export enum DeviceType {
  POT = "pot",
  UNKNOWN = "unknown"
}

export const parseDeviceType = (type: string | undefined): DeviceType => {
  return Object.values(DeviceType).includes(type as DeviceType) 
    ? (type as DeviceType) 
    : DeviceType.UNKNOWN;
};

export type DeviceEntity = {
  id: string,
  macAdress: string,
  name: string,
  homeId?: string,
  placeId?: string,
  createdAt?: string,
  type: DeviceType,
}

export type DeviceRow = {
  id: string,
  mac_addr: string,
  name: string,
  home_id?: string,
  place_id?: string,
  created_at?: string,
  type: string,
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
      type: parseDeviceType(device.type),
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
      type: device.type,
    }
  }
}

