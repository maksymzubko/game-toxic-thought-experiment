import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Vote} from "../../../api/votes/types";

export interface UserState {
    isAuthorized: boolean | null,
    user: {
        username: string | null,
        id: number | null,
        voteList?: Vote[],
        isBanned: boolean | null,
    } | null
}

const INITIAL_STATE: UserState = {
    user: null,
    isAuthorized: false
};

const userSlice = createSlice({
    name: "user",
    initialState: INITIAL_STATE,
    reducers: {
        setUser: (state, action: PayloadAction<{user: { username: string | null, id: number | null, isBanned: boolean | null, }}>) => {
            state.user = action.payload.user;
        },
        setAuthorized: (state, action: PayloadAction<{isAuthorized: boolean}>) => {
            state.isAuthorized = action.payload.isAuthorized;
        },
        setUserVotes: (state, action: PayloadAction<{userVotes: Vote[]}>) => {
            state.user.voteList = action.payload.userVotes;
        },
    }
})

export default userSlice.reducer;
export const { setUser, setUserVotes, setAuthorized } = userSlice.actions;
