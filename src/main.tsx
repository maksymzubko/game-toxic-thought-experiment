import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {Provider} from 'react-redux';
import {BrowserRouter} from "react-router-dom";
import {store} from "./redux/store/configureStore";
import {SnackbarProvider} from "notistack";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
        <SnackbarProvider maxSnack={1}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </SnackbarProvider>
    </Provider>
)
