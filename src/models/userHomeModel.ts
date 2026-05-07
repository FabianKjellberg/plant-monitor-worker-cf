export enum UserHomeRole {
    ADMIN = "admin",
    MEMBER = "member",
    VIEWER = "viewer",
    GUEST = "guest",
    NONE = "none",
}

export const parseRole = (role: string): UserHomeRole => {
  return Object.values(UserHomeRole).includes(role as UserHomeRole) 
    ? (role as UserHomeRole) 
    : UserHomeRole.NONE;
};

export type UserHomeEntity = {
    id: string,
    homeId: string,
    userId: string,
    role: UserHomeRole,
    createdAt?: string,
  }
  
  export type UserHomeRow = {
    id: string,
    home_id: string,
    user_id: string,
    role: string,
    createdAt?: string,
  }
  
  export const UserHomeMapper = {
    fromRow: (home: UserHomeRow):UserHomeEntity  => {
      return {
        id: home.id,
        homeId: home.home_id,
        userId: home.user_id,
        role: parseRole(home.role),
        createdAt: home.createdAt,
      }
    },
    toRow: (home: UserHomeEntity): UserHomeRow => {
      return {
        id: home.id,
        home_id: home.homeId,
        user_id: home.userId,
        role: home.role,
        createdAt: home.createdAt,
      }
    }
  }
  
  