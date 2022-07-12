
export interface IUser {
  _id: string;
  USER_NAME: string;
  USER_EMAIL: string;
  USER_SEX: string;
  USER_AVATAR: string;
  JWT: string;
  invite_id:string;
};


export interface Invite {
  RECEIVER:string;
  SENDER:string;
  STATE: number;
  _id:string;
}

export interface ExpendInvite {
  RECEIVER:string;
  SENDER:IUser;
  STATE: number;
  _id:string;
}