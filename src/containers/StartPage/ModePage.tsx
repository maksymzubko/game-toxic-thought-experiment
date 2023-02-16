import React, {useEffect, useState} from 'react';
import {Box} from "@mui/material";
import logo from './assets/toxic-logo.png'
import style from './style.module.css'
import {links} from "../../router";
import Button from "../../components/Button";
import {useNavigate} from "react-router-dom";
import buttonSound from '../../assets/sounds/button.mp3'
import useSound from "use-sound";
import {useSelector} from "react-redux";
import {SelectIsSoundMuted} from "../../redux/store/game/selector";

const StartPage = () => {
    const goto = useNavigate();

    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });
    const [freezeScreen, setFreezeScreen] = useState(false)

    const goLobby = (variant: number) => {
        // goto(links.game);
        playButton();
        switch (variant){
            case 0:
                goto(links.lobby, {state: {single: true}})
                break;
            default:
                goto(links.lobby, {state: {single: false}})
                break;
        }
    }

    useEffect(() => {
        if (freezeScreen) setTimeout(() =>setFreezeScreen(false), 300 );
    }, [freezeScreen]);


    return (
        <Box className={style.container}>
            <img src={logo} alt={'logo'}/>
            <Box className={`${style.buttons}`}>
                {freezeScreen && <div className={style.freezeScreen} />}
                <Button variant={'contained'} className={style.single} onClick={() => goLobby(0)}>single
                    device</Button>
                <Button variant={'contained'} className={style.multi} onClick={() => goLobby(1)}>multi
                    device</Button>
            </Box>
        </Box>
    );
};

export default StartPage;
