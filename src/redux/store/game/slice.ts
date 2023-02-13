import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface GameState {
    sound: boolean,
    tips: boolean,
    error: string,
}

const INITIAL_STATE: GameState = {
    sound: true,
    tips: true,
    error: ""
};

const socketSlice = createSlice({
    name: "game",
    initialState: INITIAL_STATE,
    reducers: {
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        setMuted: (state, action: PayloadAction<boolean>) => {
            state.sound = action.payload;
        },
        setTips: (state, action: PayloadAction<boolean>) => {
            state.tips = action.payload;
        },
    }
})

export default socketSlice.reducer;
export const {setError, setTips, setMuted} = socketSlice.actions;
