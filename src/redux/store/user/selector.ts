import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';
import { UserState} from './slice';

export const selectDomain = (state: RootState) => {
    return state.user;
};

export const SelectUser = createSelector(
    [selectDomain],
    (userState: UserState) => userState.user,
);

export const SelectIsAuthorized = createSelector(
    [selectDomain],
    (socketState: UserState) => socketState.isAuthorized,
);