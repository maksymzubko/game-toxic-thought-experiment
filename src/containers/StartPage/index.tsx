import React, {useEffect, useState} from 'react';
import {Box} from "@mui/material";
import logo from './assets/toxic-logo.png'
import style from './style.module.css'
import {links} from "../../router";
import Button from "../../components/Button";
import {useNavigate} from "react-router-dom";
import {io} from "socket.io-client";
import {useSelector} from "react-redux";
import {SelectSocket, SelectUserId} from "../../redux/store/socket/selector";

const StartPage = () => {
    const [isModalOpened, setIsModalOpened] = useState(false)
    const goto = useNavigate()
    const userId = useSelector(SelectUserId)

    useEffect(() => {
        console.log('user', userId)
    }, [])

    useEffect(() => {
        console.log('s', userId)
    }, [userId])

    const handleToggleModal = () => {
        setIsModalOpened(!isModalOpened);
    }

    const goLobby = (variant: number) => {
        // goto(links.game);

        switch (variant){
            case 0:
                goto(links.lobby, {state: {single: true}})
                break;
            default:
                goto(links.lobby, {state: {single: false}})
                break;
        }
    }

    return (
        <Box className={style.container}>
            <img src={logo} alt={'logo'}/>
            <Box className={`${style.buttons}`}>
                <Button variant={'contained'} className={style.single} onClick={()=>goLobby(0)}>single device</Button>
                <Button variant={'contained'} className={style.multi} onClick={()=>goLobby(1)}>multi device</Button>
                <Box className={style.help} onClick={handleToggleModal}>how to play</Box>
            </Box>
            {isModalOpened && <Box className={style.modal}>
                <h1>how to play:</h1>
                <ul className={style.rules}>
                    <li>start from any player</li>
                    <li>a question will be read out</li>
                    <li>the player answers the question secretly</li>
                    <li>everyone else take turn to guess the answer</li>
                    <li>answer is displayed at the end</li>
                    <li>drink up losers, and pass to the next guy!</li>
                </ul>
                <Button onClick={handleToggleModal} className={style.undrestood}>understood</Button>
            </Box>}
        </Box>
    );
};

export default StartPage;