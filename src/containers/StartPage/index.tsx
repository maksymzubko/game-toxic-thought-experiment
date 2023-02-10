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
import {SelectIsSoundMuted} from "../../redux/store/socket/selector";
import Authorization from "../../components/Authorization";

const StartPage = () => {
    const [isModalOpened, setIsModalOpened] = useState(false)
    const goto = useNavigate();

    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });
    const [showFirstButtonsList, setShowFirstButtonsList] = useState(true);
    const [freezeScreen, setFreezeScreen] = useState(false)
    const [showModalAuthorization, setShowModalAuthorization] = useState(false)

    const handleToggleModal = () => {
        playButton();
        setIsModalOpened(!isModalOpened);
    }

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

    const showSecondScreen = () => {
        playButton();
        setShowFirstButtonsList(false);
        setFreezeScreen(true)
    }

    useEffect(() => {
        if (freezeScreen) setTimeout(() =>setFreezeScreen(false), 300 );
    }, [freezeScreen]);

    const tryGoToProfile = () => {
        playButton();
        if (true) { // check if user authorized
            goto(links.profile)
        } else {
            setShowModalAuthorization(true)
        }
    }


    return (
        <Box className={style.container}>
            <img src={logo} alt={'logo'}/>
            <Box className={`${style.buttons}`}>
                {showFirstButtonsList ?
                    <>
                        <Button variant={'contained'} className={style.single} onClick={() => showSecondScreen()}>play</Button>
                        <Button variant={'contained'} className={style.multi} onClick={() => tryGoToProfile()}>profile</Button>
                    </>
                    :
                    <>
                        {freezeScreen && <div className={style.freezeScreen} />}
                        <Button variant={'contained'} className={style.single} onClick={() => goLobby(0)}>single
                            device</Button>
                        <Button variant={'contained'} className={style.multi} onClick={() => goLobby(1)}>multi
                            device</Button>
                    </>
                }
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
            {showModalAuthorization && <Authorization onClose={() => setShowModalAuthorization(false)}/>}
        </Box>
    );
};

export default StartPage;
