import React, {useEffect, useState} from 'react';
import {Backdrop, Box, CircularProgress} from "@mui/material";
import style from './style.module.css'
import {useDispatch, useSelector} from "react-redux";
import {SelectSocket, SelectUserId, SelectUserLetter, SelectUserRoom} from "../../redux/store/socket/selector";
import {useSnackbar} from "notistack";
import {Link, useNavigate} from "react-router-dom";
import {links} from "../../router";
import PlayerList from "./PlayersList";
import Button from "../../components/Button";
import {setRoom, setUserLetter} from "../../redux/store/socket/slice";

interface JoinInterface {
    status: boolean,
    message: string,
    client?: string,
    letter?: string,
    canStart?: boolean,
    playersList?: { id: string, letter: string }[]
}

export interface LeaveInterface {
    status: boolean,
    message: string,
    client?: string,
    newOwner?: string
}

const PageRoom = () => {

    const goto = useNavigate();
    const dispatch = useDispatch();

    const userId = useSelector(SelectUserId);
    const userLetter = useSelector(SelectUserLetter);
    const userRoom = useSelector(SelectUserRoom);
    const socket = useSelector(SelectSocket);

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState<{ id: string, letter: string }[]>([]);
    const [canStart, setCanStart] = useState(false);

    useEffect(() => {
        if (!userId || (!userLetter && !userRoom.single)) {
            enqueueSnackbar(`Error when tried connect to ${!userId ? 'WebSocket' : 'Room'}`, {variant: "error"});
            goto(links.start);
        }

        if (userRoom.single)
            setCanStart(true);

        socket?.emit('getRoomInfo');

        socket?.once('getRoom', (data: { status: boolean, message?: string, playersList: { id: string, letter: string }[] }) => {
            if (data.status) {
                if (userRoom.single) {
                    socket?.emit('initStart');
                } else
                {
                    setLoading(false);
                    setPlayers(data.playersList.filter(p => p.id !== userId));
                }
            } else {
                enqueueSnackbar(`Error when tried connect to Room`, {variant: "error"});
                goto(links.start);
            }
        })

        socket?.on('joinedRoom', (data: JoinInterface) => {
            if (data.status) {
                setPlayers(data.playersList?.filter(p => p.id !== userId) ?? []);
                setCanStart(data.canStart ?? false);
            }
        })

        socket?.on('leavedRoom', (data: LeaveInterface) => {
            console.log(data)
            if (data.status) {
                if (data.client === userId) {
                    dispatch(setRoom({roomNumber: null, single: null, isOwner: null}));
                    dispatch(setUserLetter({user_letter: null}));
                    goto(links.start);
                } else {
                    setCanStart(false);
                    setPlayers(prev => prev.filter(p => p.id !== data.client));

                    if (data.newOwner === userId)
                        dispatch(setRoom({roomNumber: userRoom.roomNumber ?? "", single: false, isOwner: true}));
                }
            }
        })

        socket?.on('initiatedStart', (data: { status: boolean }) => {
            if (data.status)
                goto(links.game);
        })


        return () => {
            socket?.off('initiatedStart');
            socket?.off('joinedRoom');
            socket?.off('leavedRoom');
        }
    }, [])

    const handleLeave = () => {
        socket?.emit('leaveRoom');
    }

    const handleStart = () => {
        socket?.emit('initStart');
    }

    return (
        <Box className={style.container}>
            <Backdrop open={loading}>
                <CircularProgress/>
            </Backdrop>

            {!loading &&
                <>
                    <Box className={style.roomNumber}>
                        tell this code to your friends
                        <span>{userRoom.roomNumber}</span>
                    </Box>
                    <Box className={style.players_list}>
                        <PlayerList me={userLetter ?? ""} players={players}/>
                    </Box>
                    <Box className={style.buttons}>
                        {userRoom.isOwner && <Button onClick={handleStart}
                                                     className={[style.start, !canStart ? style.disabled : null].join(' ')}>
                            start
                        </Button>}
                        <Button onClick={handleLeave} className={style.leave}>
                            leave
                        </Button>
                    </Box>
                </>}
        </Box>
    );
};

export default PageRoom;