import React, {useEffect, useState} from 'react'
import {Box} from "@mui/material";
import {useRoutes} from "react-router-dom";
import {routes as r} from "./router";
import styles from './app-style.module.css'
import {io} from "socket.io-client";
import {setSocket, setUserId} from "./redux/store/socket/slice";
import {useDispatch} from "react-redux";

// local
const socket = io('ws://localhost:3000', {transports: ['websocket']});

// server
// const socket = io('https://project15.aestar.com.ua:5016/', {transports: ['websocket']});

function App() {
    const routes = useRoutes(r);
    const dispatch = useDispatch();

    useEffect(() => {
        const getSize = () => document.body.style.setProperty('--app-height', window.innerHeight + "px");

        window.addEventListener('resize', () => {
            getSize();
        })

        getSize();

        dispatch(setSocket({socket: socket}));

        socket.on('connected', (data: {id: string}) => {
            console.log(data.id)
            dispatch(setUserId({user_id: data.id}));
        })
    }, [])

    return (
        <Box className={styles.content}>
            {routes}
        </Box>
    )
}

export default App
