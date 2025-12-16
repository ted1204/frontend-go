export interface GetGroupsByUserResponse {
  code: number;
  message: string;
  data: {
    [key: string]: {
      UID: number;
      UserName: string;
      Groups: UserGroupGroup[];
    };
  };
}

export interface GetUsersByGroupResponse {
  code: number;
  message: string;
  data: {
    [key: string]: {
      GID: number;
      GroupName: string;
      Users: UserGroupUser[];
    };
  };
}

export interface UserGroup {
  UID: number;
  GID: number;
  Role: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface UserGroupUser {
  UID: number;
  Username: string;
  Role: 'admin' | 'manager' | 'user';
}

export interface UserGroupGroup {
  GID: number;
  GroupName: string;
  Role: 'admin' | 'manager' | 'user';
}
