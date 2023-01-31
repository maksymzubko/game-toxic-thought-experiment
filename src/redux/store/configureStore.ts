import {
    configureStore,
    getDefaultMiddleware,
} from "@reduxjs/toolkit";

import createReducer from "./reducers";

function configureAppStore() {
    // Create the store with saga middleware
    const store = configureStore({
        reducer: createReducer(),
        middleware: [...getDefaultMiddleware({serializableCheck: false})],
        devTools: false
    });

    return { store };
}

export const { store } = configureAppStore();
export type RootState = ReturnType<typeof store.getState>
