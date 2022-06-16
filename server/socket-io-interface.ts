
interface ISendMsg {
  from: string;
  to: string;
  message: string;
}

export interface ServerToClientEvents {
  msgRecieve: (msg: ISendMsg) => void;
}

export interface ClientToServerEvents {
  addUser: (userId: string) => void;
  sendMsg: (data: ISendMsg) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}