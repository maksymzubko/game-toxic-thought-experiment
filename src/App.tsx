import React, {useEffect, useState} from 'react'
import {Box} from "@mui/material";
import {useLocation, useRoutes} from "react-router-dom";
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
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const location = useLocation();
    const routes = useRoutes(r);
    const dispatch = useDispatch();

    const [playButton] = useSound(buttonSound);
    const [isInstalled, setIsInstalled] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [defferedPrompt, setDefferedPrompt] = useState<Event | null>(null)
    const [isOnline, setIsOnline] = useState(true);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [isMainScreen, setIsMainScreen] = useState(false);

    useEffect(() => {
        const popstateHandler = () => {
            socket?.emit('leaveRoom')
            return;
        }

        const getSize = () => document.body.style.setProperty('--app-height', window.innerHeight + "px");
        const resizeHandler = () => {
            getSize();
        }

        const installpromptHandler = (event: Event) => {
            event.preventDefault();
            setDefferedPrompt(event);
        }

        if (!navigator.onLine) {
            const key = enqueueSnackbar('You offline!', {variant: "info", onClick: () => closeSnackbar(key)});
            setIsOnline(false);
            socket.close();
        }

        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
        }

        window.addEventListener('beforeinstallprompt', installpromptHandler);
        window.addEventListener('popstate', popstateHandler)
        window.addEventListener('resize', resizeHandler)

        socket.on('connected', (data: { id: string }) => {
            setIsOnline(true);
            setIsReconnecting(false);
            dispatch(setUserId({user_id: data.id}));
        })

        dispatch(setSocket({socket: socket}));
        getSize();

        return () => {
            socket.off('connected');
            socket.off('connect_error');
            window.removeEventListener('resize', resizeHandler);
            window.removeEventListener('beforeinstallprompt', installpromptHandler);
            window.removeEventListener('popstate', popstateHandler);
        }
    }, [])

    useEffect(() => {
        setIsMainScreen(location.pathname === '/')
    }, [location])

    useEffect(() => {
        socket.on('connect_error', (err) => {
            if (!navigator.onLine) {
                if (isReconnecting) {
                    const key = enqueueSnackbar('You still offline!', {
                        variant: "error",
                        onClick: () => closeSnackbar(key)
                    });
                    setIsReconnecting(false);
                }
                socket.close();
                setIsOnline(false);
            }
        })

        return () => {
            socket.off('connect_error');
        }
    }, [isReconnecting])

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

    const tryToReconnect = () => {
        setIsReconnecting(true);
        socket.connect();
    }

    if (isOnline)
        return (
            <>
                {showModal && <Modal onClose={() => setShowModal(false)}/>}
                <Box className={styles.content}>
                    {routes}
                    {!isInstalled && isMainScreen && <Box className={styles.install_modal}>
                        <Box className={styles.install_container}>
                            <img src={logo} alt={''}/>
                            <Box className={styles.title}>try our app PWA</Box>
                            <Button onClick={onShowModal} className={styles.button}>install</Button>
                            <img src={crossIcon} alt="" onClick={closeModal} className={styles.closeIcon}/>
                        </Box>
                    </Box>}
                </Box>
            </>
        )
    else
        return (
            <Box className={styles.offline_page}>
                <Box className={styles.offline_container}>
                    <Box>
                        Offline. Please check your internet connection and reload app.
                    </Box>
                    <Button className={styles.retry_button} onClick={tryToReconnect}>retry</Button>
                </Box>
            </Box>
        )
}

export default App
