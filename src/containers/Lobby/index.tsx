import React, {ChangeEvent, useEffect, useState} from 'react';
import {Backdrop, Box, CircularProgress} from "@mui/material";
import style from './style.module.css'
import {useLocation, useNavigate} from "react-router-dom";
import NumberItem from "../../components/Number";
import Button from "../../components/Button";
import {links} from "../../router";

import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {setRoom, setUserLetter} from "../../redux/store/socket/slice";
import {SelectSocket, SelectUserId} from "../../redux/store/socket/selector";
import lobbyImg from './assets/image1.png';
import createLobbyImg from './assets/image2.png';
import joinLobbyImg from './assets/image4.png';
import useSound from "use-sound";
import buttonSound from "../../assets/sounds/button.mp3";
import flagUS from './assets/flagUS.png';
import flagJP from './assets/flagJP.png';
import checkboxOn from './assets/checkbox-on.png';
import checkboxOff from './assets/checkbox-off.png';
import {Question} from "../../api/questions/types";
import questionsApi from "../../api/questions/questions.api";
import LoginRequired from "../../components/LoginRequired";
import {SelectIsAuthorized, SelectUser} from "../../redux/store/user/selector";
import {SelectIsSoundMuted} from "../../redux/store/game/selector";
import {setError} from "../../redux/store/game/slice";

const LobbyPage = () => {
    const data = useLocation()
    const goto = useNavigate()

    const single = data ? data?.state?.single : false;

    const dispatch = useDispatch();
    const userId = useSelector(SelectUserId);
    const socket = useSelector(SelectSocket);

    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound, {volume: isSoundMuted ? 0 : 1});
    const isAuthorized = useSelector(SelectIsAuthorized);
    const user = useSelector(SelectUser);

    const [roomNumber, setRoomNumber] = useState('');
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(true)
    const [playersCount, setPlayersCount] = useState(4);
    const [buttons, setButtons] = useState<{ number: number, active: number }[]>(
        [
            {number: 4, active: 1},
            {number: 5, active: 0},
            {number: 6, active: 0},
            {number: 7, active: 0},
            {number: 8, active: 0}
        ])
    const [selectedFlag, setSelectedFlag] = useState('')
    const [useCustomQuestions, setUseCustomQuestions] = useState(false)
    const [isModalPlayersOpened, setModalPlayersOpened] = useState(single);
    const [isModalRoomOpened, setModalRoomOpened] = useState(false);
    const [userQuestions, setUserQuestions] = useState<Question[]>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!userId) {
            const key = enqueueSnackbar('Error when try connect to WebSocket.', {
                variant: 'error',
                onClick: () => closeSnackbar(key)
            });
            goto(links.start);
        } else setLoading(false);

        socket?.on('initiatedStart', (data: { status: boolean }) => {
            if (data.status)
                goto(links.game);
        })

        getQuestionList(true)

        return () => {
            socket?.off('initiatedStart');
        }
    }, [])

    useEffect(() => {
        const newBtns = Array.from(buttons);
        newBtns.forEach(btn => {
            if (btn.number === playersCount) {
                btn.active = 1;
            } else btn.active = 0;
        })
        setButtons(newBtns);
    }, [playersCount])

    const handleToggleModalPlayers = () => {
        setModalPlayersOpened(!isModalPlayersOpened);
    }

    const handleToggleModalRoom = () => {
        setModalRoomOpened(!isModalRoomOpened);
    }

    const handleChangeRoomNumber = (event: ChangeEvent<HTMLInputElement>) => {
        playButton();
        const value = event.target.value;
        setRoomNumber(value)
    }

    const handleClick = (el: any) => {
        playButton();
        const {id} = el.currentTarget;
        setPlayersCount(parseInt(id));
    }

    const createLobbyModal = () => {
        playButton();
        handleToggleModalPlayers();
    }

    const joinLobbyModal = () => {
        playButton();
        handleToggleModalRoom();
    }

    const goBack = () => {
        playButton();
        goto(links.start)
    }

    const handleCancel = (variant: number) => {
        playButton();
        if (variant === 0) {
            handleToggleModalPlayers()
            if (data.state.single) {
                goto(links.start);
            } else {
                handleToggleModalPlayers()
                setPlayersCount(4);
            }
        } else {
            handleToggleModalRoom();
        }
    }


    const handleCreateLobby = async () => {
        playButton();

        const roomSettings = {
            solo: single,
            playersCount: playersCount
        } as { solo: boolean, playersCount: number, language?: string, onlyMy?: boolean, packIds?: number[], questionIds?: number[], userId?: number };

        if (selectedFlag.length)
            roomSettings.language = selectedFlag;

        roomSettings.onlyMy = useCustomQuestions;

        roomSettings.questionIds = userQuestions ? userQuestions.map(q => {
            return q.id
        }) : []

        if(isAuthorized) {
            roomSettings.userId = user.id;
        }

        socket?.emit('createRoom', roomSettings);
        setLoading(true);

        socket?.once('createdRoomName', (data: { status: boolean, message?: string, data?: string }) => {
            setLoading(false)
            if (data.status) {
                dispatch(setRoom({roomNumber: data.data ?? "", isOwner: true, single: single}))
                if (!single) {
                    const key = enqueueSnackbar(`Connecting to created room #${data.data}...`, {
                        variant: 'info',
                        onClick: () => closeSnackbar(key)
                    });
                }
            } else if (data.message) {
                const key = enqueueSnackbar(data.message, {variant: 'error', onClick: () => closeSnackbar(key)});
            }
        })

        socket?.once('joinedRoom', (data: { status: boolean, message?: string, client: string, letter?: string, canStart: boolean }) => {
            setLoading(false)
            if (data.status) {
                dispatch(setUserLetter({user_letter: data.letter ?? ""}));
                if (!single) {
                    const key = enqueueSnackbar(`Connected to created room!`, {
                        variant: 'success',
                        onClick: () => closeSnackbar(key)
                    });
                }
                if (!single)
                    goto(links.room);
                else socket?.emit('initStart');
            } else {
                const key = enqueueSnackbar(data.message, {variant: 'error', onClick: () => closeSnackbar(key)});
            }
        })
    }

    const joinRoom = () => {
        playButton();
        handleToggleModalRoom()

        setLoading(true);

        socket?.emit('joinRoom', {room: roomNumber})

        socket?.once('joinedRoom', (data: { status: boolean, message?: string, client: string, letter?: string, canStart: boolean }) => {
            setLoading(false)
            if (data.status) {
                dispatch(setUserLetter({user_letter: data.letter ?? ""}));
                dispatch(setRoom({roomNumber: roomNumber, single: false, isOwner: false}));
                const key = enqueueSnackbar(`Connected to room!`, {
                    variant: 'success',
                    onClick: () => closeSnackbar(key)
                });
                goto(links.room);
            } else {
                const key = enqueueSnackbar(data.message, {variant: 'error', onClick: () => closeSnackbar(key)});
            }
        })
    }

    const switchFlag = (flag: string) => {
        playButton();
        if (selectedFlag === flag) {
            setSelectedFlag('')
        } else {
            setSelectedFlag(flag)
        }
    }

    const getQuestionList = async  (init = false) => {
        setLoading(true);
        await questionsApi.getUserQuestions()
            .then(res => {
                setUserQuestions(res.length > 0 ? res : null);
                !init && setUseCustomQuestions(res.length > 0 ? !useCustomQuestions : false);
                res.length === 0 && dispatch(setError("Your questions list is empty!"))
            }).catch(err => {
                console.log(err)
                let _err = err.response.data
                    .message
                    .join(', ');
                dispatch(setError(_err));
            }).finally(() => setLoading(false))
    }

    const handleChangeCustomQuestions = async () => {
        playButton();
        if(!userQuestions)
            await getQuestionList()
        else
            setUseCustomQuestions(!useCustomQuestions);

    }

    return (
        <Box className={style.container}>
            <Backdrop open={loading}>
                <CircularProgress/>
            </Backdrop>
            {/*{showModal && <LoginRequired onClose={() => setShowModal(false)}/>}*/}
            <Box className={style.back} onClick={goBack}>
                <svg xmlns="http://www.w3.org/2000/svg" className="svg-icon"
                     viewBox="0 0 1024 1024" version="1.1">
                    <path
                        fill={'black'}
                        d="M 638.238 372.448 c -55.9022 0 -19.4469 -94.093 -19.4469 -94.093 l -0.12075 0.134053 c 16.7126 -38.9266 9.25171 -85.7602 -22.5312 -117.543 c -41.6619 -41.6322 -109.202 -41.6322 -150.889 0 L 167.746 438.452 c -19.9934 20.0067 -31.2282 47.1345 -31.2282 75.4269 c 0 28.3016 11.2349 55.4305 31.2282 75.4617 l 277.503 277.499 c 20.8447 20.812 48.1537 31.2241 75.4525 31.2241 c 27.2865 0 54.6149 -10.4121 75.4361 -31.2241 c 31.7624 -31.7573 39.2315 -78.504 22.5946 -117.418 l 0.057305 0.071631 c 0 0 -36.4543 -94.1554 19.4479 -94.1554 l 126.926 2.7179 c 67.4001 9.37758 125.73 -44.567 125.73 -144.163 l 0 0 c 0 -96.7178 -63.3969 -152.391 -125.729 -144.029 L 638.238 372.448 Z M 765.163 366.696"/>
                </svg>
            </Box>
            <img src={lobbyImg} alt="" style={{maxWidth: '80%', maxHeight: '30%'}}/>
            <Box className={style.buttons}>
                <Button className={[style.start, style.hidden].join(' ')}>start game</Button>
                <Button className={[style.create].join(' ')} onClick={createLobbyModal}>create lobby</Button>
                <Button className={[style.join].join(' ')} onClick={joinLobbyModal}>join lobby</Button>
            </Box>

            {isModalPlayersOpened && <Box className={style.modal__players}>
                <h1>number of players</h1>
                <Box className={style.nums}>
                    {buttons.map(btn => <NumberItem key={btn.number} id={btn.number} onClick={handleClick}
                                                    number={btn.number}
                                                    active={btn.active}/>)}
                </Box>
                <h1>preferable language</h1>
                <Box className={style.flagsBlock}>
                    <img src={flagUS} alt="" style={{opacity: selectedFlag === 'en' ? 1 : 0.5}}
                         onClick={() => switchFlag('en')}/>
                    <img src={flagJP} alt="" style={{opacity: selectedFlag === 'jp' ? 1 : 0.5}}
                         onClick={() => switchFlag('jp')}/>
                </Box>
                {isAuthorized && <Box onClick={handleChangeCustomQuestions} className={style.customQuestionBlock}>
                    <h1>use custom questions</h1>
                    {<img src={useCustomQuestions ? checkboxOn : checkboxOff} alt=""/>}
                </Box>}
                <Box className={style.modal_buttons}>
                    <Button onClick={handleCreateLobby} className={style.drink}>create lobby</Button>
                    <Button onClick={() => handleCancel(0)} className={style.cancel}>cancel</Button>
                </Box>
                {/*<img src={createLobbyImg} alt="" style={{maxWidth: '80%', maxHeight: '30%'}}*/}
                {/*     className={style.createLobbyImg}/>*/}
            </Box>}
            {isModalRoomOpened &&
                <Box className={style.modal__join}>
                    <Box className={style.content}>
                        <img src={joinLobbyImg} alt="" style={{maxWidth: '80%', maxHeight: '30%'}}/>
                        <input onChange={handleChangeRoomNumber} id='room-id-input' pattern="[0-9]*" inputMode="numeric"
                               name="room-number" maxLength={4}
                               placeholder="enter a room number"/>
                        <Box className={style.modal_buttons}>
                            <Button id='join-r' onClick={joinRoom} style={{color: '#0B997B'}}>join</Button>
                            <Button id='cancel-r' onClick={() => handleCancel(1)}
                                    style={{color: '#FF0000'}}>cancel</Button>
                        </Box>
                    </Box>
                </Box>}
        </Box>
    );
};

export default LobbyPage;
