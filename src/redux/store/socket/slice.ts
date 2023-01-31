import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Socket} from "socket.io-client";

export interface SocketState {
    user_letter: string | null,
    user_id: string | null,
    room: {
        isOwner: boolean | null,
        roomNumber: string | null,
        single: boolean | null
    }
    socket: Socket | null
}

const INITIAL_STATE: SocketState = {
    user_letter: null,
    room: {isOwner: null, single: null, roomNumber: null},
    user_id: null,
    socket: null
};

const socketSlice = createSlice({
    name: "socket",
    initialState: INITIAL_STATE,
    reducers: {
        setSocket: (state, action: PayloadAction<{socket: any}>) => {
            state.socket = action.payload.socket;
        },
        setUserId: (state, action: PayloadAction<{user_id: string | null}>) => {
            state.user_id = action.payload.user_id;
        },
        setUserLetter: (state, action: PayloadAction<{user_letter: string | null}>) => {
            state.user_letter = action.payload.user_letter;
        },
        setRoom: (state, action: PayloadAction<{isOwner: boolean | null; roomNumber: string | null; single: boolean | null;}>) => {
            const {isOwner, roomNumber, single} = action.payload;
            state.room = {isOwner, roomNumber, single};
        },
    }
})

export default socketSlice.reducer;
export const { setSocket, setUserId, setUserLetter, setRoom } = socketSlice.actions;
