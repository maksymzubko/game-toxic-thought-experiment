import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';
import { GameState } from './slice';

export const selectDomain = (state: RootState) => {
    return state.game;
};

export const SelectIsSoundMuted  = createSelector(
    [selectDomain],
    (socketState: GameState) => socketState.sound,
);

export const SelectTips  = createSelector(
    [selectDomain],
    (socketState: GameState) => socketState.tips,
);

export const SelectError = createSelector(
    [selectDomain],
    (socketState: GameState) => socketState.error,
);

