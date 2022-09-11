import { Socket } from "socket.io";

const USERS_COUNT_IN_A_ROOM = 2;

export default class Rooms {
    rooms: Map<any, any>

    constructor() {
        this.rooms = new Map();
    }

    addToRoom = (socket: Socket) => {
        let roomId:string = String(this.rooms.size ? this.rooms.size - 1 : this.rooms.size);
        const usersInRoom = this.rooms.get(roomId) || []
      
        if (usersInRoom.length >= USERS_COUNT_IN_A_ROOM) {
          roomId = String(this.rooms.size)
        }
      
        this.rooms.set(roomId, [{socket, isReady: false}, ...usersInRoom])

        return roomId
    }

    setUserReadyToPlay = (socket: Socket, user_id: string, roomId: string) => {
        const usersInRoom = this.getRoomById(roomId)
        console.log('[setUserReadyToPlay]', usersInRoom);
        this.rooms.set(roomId, [{socket, isReady: true}, ...usersInRoom])
    }

    checkIsRoomReadyToPlay = (roomId:string) => this.getRoomById(roomId).filter( ({isReady}: {isReady: boolean}) => isReady ).length

    getRoomById = (roomId: string) => this.rooms.get(roomId)
}