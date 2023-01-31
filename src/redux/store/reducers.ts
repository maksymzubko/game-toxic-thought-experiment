import { combineReducers } from 'redux';
import socketSlice from './socket/slice';

export default function createReducer(injectedReducers = {}) {
    const rootReducer = combineReducers({
        socket: socketSlice,
        ...injectedReducers
    });

    return rootReducer;
}
