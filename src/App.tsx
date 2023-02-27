import React, {useEffect, useState} from 'react'
import {Box} from "@mui/material";
import {useLocation, useRoutes} from "react-router-dom";
import {routes as r} from "./router";
import styles from './app-style.module.css'
import {io} from "socket.io-client";
import {setSocket, setUserId} from "./redux/store/socket/slice";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import Modal from "./containers/Modal";
import Button from "./components/Button";
import logo from './assets/144.png';
import crossIcon from "./containers/Modal/assets/cross-icon.png";
import useSound from "use-sound";
import buttonSound from "./assets/sounds/button.mp3";
import Sidebar from "./components/Sidebar";
import authApi from "./api/auth/auth.api";
import {setAuthorized, setUser, setUserVotes} from "./redux/store/user/slice";
import votesApi from "./api/votes/votes.api";
import MessageModal from "./components/MessageModal";
import {setError, setMuted, setTips} from "./redux/store/game/slice";
import {SelectError, SelectIsSoundMuted} from "./redux/store/game/selector";
import {getAnimalByLetter} from "./helpers/animalHelp";
import ModalHints from "./components/ModalHints";
import {SelectIsAuthorized} from "./redux/store/user/selector";

const socket = io(process.env.VITE_WS, {transports: ['websocket']});

function App() {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const location = useLocation();
    const routes = useRoutes(r);
    const dispatch = useDispatch();

    const error = useSelector(SelectError);
    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound, {volume: isSoundMuted ? 0 : 1});
    const [isInstalled, setIsInstalled] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [defferedPrompt, setDefferedPrompt] = useState<Event | null>(null)
    const [isOnline, setIsOnline] = useState(true);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [isMainScreen, setIsMainScreen] = useState(false);
    const isAuthorized = useSelector(SelectIsAuthorized);

    useEffect(() => {
        const token = localStorage.getItem('18plus_token');
        if (token) {
            dispatch(setAuthorized({isAuthorized: true}));
            try {
                const {id, username, isBanned} = JSON.parse(localStorage.getItem('18plus_token'));
                dispatch(setUser({user: {id, username, isBanned}}));
            } catch (e) {
                console.log(e)
            }

        }

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
        if (isAuthorized) {
            votesApi.getUserVotes()
                .then(res => {
                    console.log('voted', res)
                    dispatch(setUserVotes({userVotes: res}))
                }).catch(err => {
                console.log(err)
            }).finally(() => {
            })
        }
    }, [isAuthorized])

    useEffect(() => {
        const volumeFromStorage = localStorage.getItem('isSoundMuted');
        const tipsFromStorage = localStorage.getItem('isEnabledTips');
        if (volumeFromStorage === null) {
            localStorage.setItem('isSoundMuted', 'false');
        } else {
            dispatch(setMuted(volumeFromStorage === 'true'));
        }

        if (tipsFromStorage === null) {
            localStorage.setItem('isEnabledTips', 'true');
        } else {
            dispatch(setTips(tipsFromStorage === 'true'));
        }
    }, []);


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
        if (!isSoundMuted) {
            playButton();
        }

        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            setShowModal(true);
        } else {
            // @ts-ignore
            defferedPrompt?.prompt();
        }
    }

    const closeModal = () => {
        if (!isSoundMuted) {
            playButton();
        }

        setIsInstalled(true)
    }

    const tryToReconnect = () => {
        setIsReconnecting(true);
        socket.connect();
    }

    if (isOnline)
        return (
            <>
                {error.length > 0 && <MessageModal message={error} onClose={() => {
                    dispatch(setError(""))
                }}/>}
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
                <Sidebar/>
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
