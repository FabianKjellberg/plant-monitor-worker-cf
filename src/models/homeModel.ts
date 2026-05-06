export type HomeEntity = {
    id: string,
    name: string,
    createdAt?: string,
  }
  
  export type HomeRow = {
    id: string,
    name: string,
    created_at?: string,
  }
  
  export const HomeMapper = {
    fromRow: (home: HomeRow):HomeEntity  => {
      return {
        id: home.id,
        name: home.name,
        createdAt: home.created_at,
      }
    },
    toRow: (home: HomeEntity): HomeRow => {
      return {
        id: home.id,
        name: home.name,
        created_at: home.createdAt,
      }
    }
  }
  
  