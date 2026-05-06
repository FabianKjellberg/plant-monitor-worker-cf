export type UserDeviceEntity = {
  id: string,
  deviceId: string,
  userId: string,
  deviceName: string,
  createdAt?: string
  }
  
export type UserDeviceRow = {
  id: string,
  device_id: string,
  user_id: string,
  device_name: string,
  created_at?: string
}
  
export const UserDeviceMapper = {
  fromRow: (device: UserDeviceRow): UserDeviceEntity => {
      return {
        id: device.id,
        deviceId: device.device_id,
        userId: device.user_id,
        deviceName: device.device_name,
        createdAt: device.created_at,
      }
    },
    toRow: (device: UserDeviceEntity): UserDeviceRow => {
      return {
        id: device.id,
        device_id: device.deviceId,
        user_id: device.userId,
        device_name: device.deviceName,
        created_at: device.createdAt,
      }
    }
  }
  
  