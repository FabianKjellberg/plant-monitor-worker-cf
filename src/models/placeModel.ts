export type PlaceEntity = {
    id: string,
    roomId: string,
    name: string,
    icon?: string
    createdAt?: string,
  }
  
  export type PlaceRow = {
    id: string,
    room_id: string,
    name: string,
    icon?: string,
    created_at?: string,
  }
  
  export const PlaceMapper = {
    fromRow: (place: PlaceRow):PlaceEntity  => {
      return {
        id: place.id,
        roomId: place.room_id,
        name: place.name,
        icon: place.icon,
        createdAt: place.created_at,
      }
    },
    toRow: (place: PlaceEntity): PlaceRow => {
      return {
        id: place.id,
        room_id: place.roomId,
        name: place.name,
        icon: place.icon,
        created_at: place.createdAt,
      }
    }
  }
  
  