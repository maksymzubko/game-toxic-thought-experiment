import {combineReducers} from 'redux';
import socketSlice from './socket/slice';
import userSlice from './user/slice';
import gameSlice from './game/slice';

export default function createReducer(injectedReducers = {}) {
    const rootReducer = combineReducers({
        socket: socketSlice,
        user: userSlice,
        game: gameSlice,
        ...injectedReducers
    });

    return rootReducer;
}
