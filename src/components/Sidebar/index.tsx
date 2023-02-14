import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {Box} from "@mui/material";
import Button from "../Button";

import useSound from "use-sound";
import buttonSound from "../../assets/sounds/button.mp3";

import './style.css';
import sidebarArrow from './assets/sidebar-arrow.svg';
import sidebarQuestion from './assets/sidebar-question.svg';
import sidebarSettings from './assets/sidebar-settings.svg';
import backArrow from '../../assets/back-arrow.png';
import switchOn from '../../assets/radiobutton-on.png';
import switchOff from '../../assets/radiobutton-off.png';
import cocktailsImg from '../../assets/cocktails.png';
import {SelectIsSoundMuted, SelectTips} from "../../redux/store/game/selector";
import {setMuted, setTips} from "../../redux/store/game/slice";

const Sidebar = () => {

    const dispatch = useDispatch();

    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const isEnabledTips = useSelector(SelectTips);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });

    const [isSidebarOpened, setIsSidebarOpened] = useState(false);
    const [isModalHelpOpened, setIsModalHelpOpened] = useState(false);
    const [isModalSettingsOpened, setIsModalSettingsOpened] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(!isSoundMuted);
    const [isHintOn, setIsHintOn] = useState(true);


    useEffect(() => {
        setIsSoundOn(!isSoundMuted)
        setIsHintOn(isEnabledTips)
    }, [isSoundMuted, isEnabledTips]);

    const switchSound = (flag: boolean) => {
        setIsSoundOn(flag)
        if (flag) {
            dispatch(setMuted(false));
            localStorage.setItem('isSoundMuted', 'false');
        } else {
            dispatch(setMuted(true));
            localStorage.setItem('isSoundMuted', 'true');
        }
    }

    const switchTips = (flag: boolean) => {
        setIsHintOn(flag)
        if (flag) {
            dispatch(setTips(true));
            localStorage.setItem('isEnabledTips', 'true');
        } else {
            dispatch(setTips(false));
            localStorage.setItem('isEnabledTips', 'false');
        }
    }

    return (
        <div className="sidebar">
            <div className={`sidebar-button ${isSidebarOpened ? 'opened':''}`}  onTouchMove={() => setIsSidebarOpened(!isSidebarOpened)}>
                <img src={sidebarArrow} alt="" onClick={() => setIsSidebarOpened(!isSidebarOpened)}/>
                <img src={sidebarQuestion} alt="" onClick={() => {if (isSoundOn) playButton(); setIsModalHelpOpened(true)}} />
                <img src={sidebarSettings} alt="" onClick={() => {if (isSoundOn) playButton(); setIsModalSettingsOpened(true)}} />
            </div>
            {isModalHelpOpened &&
                <>
                    <div className="background" />
                    <Box className="modal">
                        <h1>how to play:</h1>
                        <ul className="rules">
                            <li>start from any player</li>
                            <li>a question will be read out</li>
                            <li>the player answers the question secretly</li>
                            <li>everyone else take turn to guess the answer</li>
                            <li>answer is displayed at the end</li>
                            <li>drink up losers, and pass to the next guy!</li>
                        </ul>
                        <Button onClick={() =>{if (isSoundOn) playButton();setIsModalHelpOpened(false)}} className="understood-button">understood</Button>
                    </Box>
                </>}
            {isModalSettingsOpened  &&
            <>
                <div className="background" />
                <Box className="modal settings">
                    <p className="title">
                        <img src={backArrow} alt="" onClick={() => {if (isSoundOn) playButton(); setIsModalSettingsOpened(false)}} />
                        settings
                    </p>
                    <div className="switchers-wrapper">
                        <div className="sound-block">
                            <p>sound</p>
                            <img src={isSoundOn ? switchOn : switchOff} alt="" onClick={() => {playButton(); switchSound(!isSoundOn)}} />
                        </div>
                        <div className="hints-block">
                            <p>hints</p>
                            <img src={isHintOn ? switchOn : switchOff} alt=""  onClick={() => {if (isSoundOn) playButton(); switchTips(!isHintOn)}} />
                        </div>
                    </div>
                    <img src={cocktailsImg} alt="" className="cocktails-img"/>
                </Box>
            </>}
        </div>
    );
};

export default Sidebar;
