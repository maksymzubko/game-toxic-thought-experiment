import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {SelectIsSoundMuted} from "../../redux/store/socket/selector";
import Button from "../Button";

import useSound from "use-sound";
import buttonSound from "../../assets/sounds/button.mp3";

import './style.css';
import backArrow from '../../assets/back-arrow.png';
import cocktailsImg from '../../assets/cocktails.png';
import authApi from "../../api/auth/auth.api";
import {Backdrop, CircularProgress} from "@mui/material";
import {setAuthorized, setUser} from "../../redux/store/user/slice";
import {links} from "../../router";
import {useNavigate} from "react-router-dom";
import crossIcon from "../../containers/Profile/assets/cross-icon.png";
import sadDogImg from "../../containers/Profile/assets/dog-sad.png";


const Authorization = (props: {onClose: any}) => {

    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });
    const [currentStage, setCurrentStage] = useState<"init" | "authorization" | "registration">("init");

    const dispatch = useDispatch();
    const goto = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState('')


    const login = () => {
        playButton();

        if (!name.length || !password.length)
            return;

        setIsLoading(true);
        authApi.login({username: name, password: password})
            .then((res) => {
                console.log('res', res)
                const {id, isBanned, username} = res;
                dispatch(setUser({user: {id, isBanned, username}}))
                dispatch(setAuthorized({isAuthorized: true}))
                goto(links.profile)
            }).catch((err) => {
                console.log('err', err.response.data)
                setErrorMessage(err.response.data.message.join(', '))
            }).finally(()=>setIsLoading(false));
    }

    const register = () => {
        playButton();

        setIsLoading(true);
        authApi.register({username: name, email, password})
            .then((res) => {
                console.log('res', res)
            }).catch((err) => {
            console.log('err', err.response.data)
            setErrorMessage(err.response.data.message.join(', '))
        }).finally(()=>setIsLoading(false));
    }

    const handleChangeName = (event: any) => {
        const value = event.target.value;

        setName(value);
    }

    const handleChangeEmail = (event: any) => {
        const value = event.target.value;

        setEmail(value);
    }

    const handleChangePassword = (event: any) => {
        const value = event.target.value;

        setPassword(value);
    }

    const changeStage = (stage: "init" | "authorization" | "registration") => {
        playButton();
        setName("");
        setEmail("");
        setPassword("");

        setCurrentStage(stage);
    }

    const onBackArrowClick = () => {
        if (currentStage === 'init') {
            playButton()
            props.onClose()
        } else {
            changeStage('init')
        }
    }

    return (
        <div className="authorization">
            <Backdrop open={isLoading} style={{zIndex: 30}}>
                <CircularProgress/>
            </Backdrop>
            <div className="background">
                <div className="modal">
                    <img src={backArrow} alt="" className="back-arrow" onClick={() => onBackArrowClick()}/>

                    {currentStage === "init" &&
                        <>
                            <img src={cocktailsImg} alt="" className="cocktails-img"/>
                            <Button className="login" onClick={() => {changeStage("authorization")}}>login</Button>
                            <Button className="register" onClick={() => {changeStage("registration")}}>register</Button>
                        </>
                    }
                    {currentStage === "authorization" &&
                        <>
                            <div className="input-wrapper">
                                <input placeholder="login" type="text" onChange={handleChangeName}/>
                            </div>
                            <div className="input-wrapper">
                                <input placeholder="password" type="password" onChange={handleChangePassword}/>
                            </div>
                            <Button
                                className="login"
                                onClick={() => {(name.trim() && password.trim()) && login()}}
                                style={{opacity: (name.trim() && password.trim()) ? 1 : 0.7}}
                            >
                                login
                            </Button>
                        </>
                    }
                    {currentStage === "registration" &&
                        <>
                            <div className="input-wrapper">
                                <input placeholder="name" type="text" onChange={handleChangeName}/>
                            </div>
                            <div className="input-wrapper">
                                <input placeholder="email" type="email" onChange={handleChangeEmail}/>
                            </div>
                            <div className="input-wrapper">
                                <input placeholder="password" type="password" onChange={handleChangePassword}/>
                            </div>
                            <Button
                                className="register"
                                onClick={() => {(name.trim() && password.trim()) && register()}}
                                style={{opacity: (name.trim() && password.trim()) ? 1 : 0.7}}
                            >
                                register
                            </Button>
                        </>
                    }
                    {errorMessage &&
                        <div className="error-alert">
                            <div className="modal">
                                <img src={crossIcon} alt="" onClick={() => {playButton(); setErrorMessage('')}} className="close" />
                                <img src={sadDogImg} alt="" className="sad-dog"/>
                                <p>{errorMessage}</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Authorization;
