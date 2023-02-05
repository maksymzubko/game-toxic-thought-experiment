import React, {useEffect, useState} from 'react'
import {Box} from "@mui/material";
import {useNavigate, useRoutes} from "react-router-dom";
import {routes as r} from "./router";
import styles from './app-style.module.css'
import {io} from "socket.io-client";
import {setSocket, setUserId} from "./redux/store/socket/slice";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import Modal from "./containers/Modal";


// local
// const socket = io('ws://localhost:3000', {transports: ['websocket']});

// server
const socket = io('https://project15.aestar.com.ua:5016/', {transports: ['websocket']});

function App() {
    const {enqueueSnackbar} = useSnackbar();
    const routes = useRoutes(r);
    const dispatch = useDispatch();
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        if(!navigator.onLine)
        {
            enqueueSnackbar('You offline!', {variant: "info"});
            socket.close();
        }

        let defferedPrompt: any;
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
        })

        window.addEventListener('beforeinstallprompt', event => {
            event.preventDefault();
            defferedPrompt = event
        });

        document.body.addEventListener('click', event => {
            if(!isInstalled)
            {
                defferedPrompt?.prompt();

                defferedPrompt?.userChoice.then((choice: any) => {
                    defferedPrompt = null;
                })
            }
        }, {once: true})

        const getSize = () => document.body.style.setProperty('--app-height', window.innerHeight + "px");

        window.addEventListener('popstate', (e) => {
            // @ts-ignore
            socket.emit('leaveRoom')
            return;
        })

        window.addEventListener('resize', () => {
            getSize();
        })

        getSize();

        dispatch(setSocket({socket: socket}));

        socket.on('connected', (data: {id: string}) => {
            dispatch(setUserId({user_id: data.id}));
        })
    }, [])

    const [firstInteractAllow, setFirstInteractAllow] = useState(true);
    const [showModal, setShowModal] = useState(false)

    const onShowModal = () => {
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !isInstalled) {
            if (firstInteractAllow) {
                setFirstInteractAllow(false)
                setShowModal(true);
            }
        }
    }


    return (
        <>
            {/*{showModal && <Modal onClose={() => setShowModal(false)}/>}*/}
            <Box className={styles.content} onClick={onShowModal}>
                {routes}
            </Box>
        </>
    )
}

export default App
