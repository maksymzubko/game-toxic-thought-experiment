import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';
import { SocketState } from './slice';

export const selectDomain = (state: RootState) => {
    return state.socket;
};

export const SelectSocket = createSelector(
    [selectDomain],
    (socketState: SocketState) => socketState.socket,
);

export const SelectUserId = createSelector(
    [selectDomain],
    (socketState: SocketState) => socketState.user_id,
);

export const SelectUserLetter = createSelector(
    [selectDomain],
    (socketState: SocketState) => socketState.user_letter,
);

export const SelectUserRoom  = createSelector(
    [selectDomain],
    (socketState: SocketState) => socketState.room,
);