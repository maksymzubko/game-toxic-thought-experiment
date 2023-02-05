import React, {useEffect, useState} from 'react'
import {Box} from "@mui/material";
import {useRoutes} from "react-router-dom";
import {routes as r} from "./router";
import styles from './app-style.module.css'
import {io} from "socket.io-client";
import {setSocket, setUserId} from "./redux/store/socket/slice";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import Modal from "./containers/Modal";
import Button from "./components/Button";
import logo from '/144.png'
import crossIcon from "./containers/Modal/assets/cross-icon.png";
import useSound from "use-sound";
import buttonSound from "./assets/sounds/button.mp3";

// local
// const socket = io('ws://localhost:3000', {transports: ['websocket']});

// server
const socket = io('https://project15.aestar.com.ua:5016/', {transports: ['websocket']});

function App() {
    const {enqueueSnackbar} = useSnackbar();

    const routes = useRoutes(r);
    const dispatch = useDispatch();

    const [playButton] = useSound(buttonSound);
    const [isInstalled, setIsInstalled] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [defferedPrompt, setDefferedPrompt] = useState<Event | null>(null)

    useEffect(() => {
        if (!navigator.onLine) {
            enqueueSnackbar('You offline!', {variant: "info"});
            socket.close();
        }

        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
        }

        window.addEventListener('beforeinstallprompt', event => {
            event.preventDefault();
            setDefferedPrompt(event);
        });

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

        socket.on('connected', (data: { id: string }) => {
            dispatch(setUserId({user_id: data.id}));
        })
    }, [])

    const onShowModal = () => {
        playButton();
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            setShowModal(true);
        } else {
            // @ts-ignore
            defferedPrompt?.prompt();
        }
    }

    const closeModal = () => {
        playButton();
        setIsInstalled(true)
    }

    return (
        <>
            {showModal && <Modal onClose={() => setShowModal(false)}/>}
            <Box className={styles.content}>
                {routes}
                {!isInstalled && <Box className={styles.install_modal}>
                    <Box className={styles.install_container}>
                        <img src={logo} alt={''}/>
                        <Box>try our app PWA</Box>
                        <Button onClick={onShowModal} className={styles.button}>install</Button>
                        <img src={crossIcon} alt="" onClick={closeModal} className={styles.closeIcon}/>
                    </Box>
                </Box>}
            </Box>
        </>
    )
}

export default App
