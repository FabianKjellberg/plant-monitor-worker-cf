export type RoomEntity = {
    id: string,
    homeId: string,
    name: string,
    icon?: string
    createdAt?: string,
  }
  
  export type RoomRow = {
    id: string,
    home_id: string,
    name: string,
    icon?: string,
    created_at?: string,
  }
  
  export const RoomMapper = {
    fromRow: (room: RoomRow):RoomEntity  => {
      return {
        id: room.id,
        homeId: room.home_id,
        name: room.name,
        icon: room.icon,
        createdAt: room.created_at,
      }
    },
    toRow: (room: RoomEntity): RoomRow => {
      return {
        id: room.id,
        home_id: room.homeId,
        name: room.name,
        icon: room.icon,
        created_at: room.createdAt,
      }
    }
  }
  
  