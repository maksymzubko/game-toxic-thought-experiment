import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {SelectIsSoundMuted} from "../../redux/store/socket/selector";
import Button from "../Button";

import useSound from "use-sound";
import buttonSound from "../../assets/sounds/button.mp3";

import './style.css';
import backArrow from '../../assets/back-arrow.png';
import cocktailsImg from '../../assets/cocktails.png';


const Authorization = (props: {onClose: any}) => {

    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });
    const [currentStage, setCurrentStage] = useState<"init" | "authorization" | "registration">("init");

    return (
        <div className="authorization">
            <div className="background">
                <div className="modal">
                    <img src={backArrow} alt="" className="back-arrow" onClick={() => {playButton();props.onClose()}}/>

                    {currentStage === "init" &&
                        <>
                            <img src={cocktailsImg} alt="" className="cocktails-img"/>
                            <Button className="login" onClick={() => {playButton(); setCurrentStage("authorization")}}>login</Button>
                            <Button className="register" onClick={() => {playButton(); setCurrentStage("registration")}}>register</Button>
                        </>
                    }
                    {currentStage === "authorization" &&
                        <>
                            <div className="input-wrapper">
                                <input placeholder="email" type="email"/>
                            </div>
                            <div className="input-wrapper">
                                <input placeholder="password" type="password"/>
                            </div>
                            <Button className="login" onClick={() => {playButton();}}>login</Button>
                        </>
                    }
                    {currentStage === "registration" &&
                        <>
                            <div className="input-wrapper">
                                <input placeholder="name" type="text"/>
                            </div>
                            <div className="input-wrapper">
                                <input placeholder="email" type="email"/>
                            </div>
                            <div className="input-wrapper">
                                <input placeholder="password" type="password"/>
                            </div>
                            <Button className="register" onClick={() => {playButton(); }}>register</Button>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default Authorization;
