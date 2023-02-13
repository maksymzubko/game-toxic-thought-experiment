import { combineReducers } from 'redux';
import socketSlice from './socket/slice';
import userSlice from './user/slice';

export default function createReducer(injectedReducers = {}) {
    const rootReducer = combineReducers({
        socket: socketSlice,
        user: userSlice,
        ...injectedReducers
    });

    return rootReducer;
}
