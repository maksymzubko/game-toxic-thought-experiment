import React, {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import style from "../style.module.css";
import Button from "../../../components/Button";
import beerIcon from '../assets/beer-icon.png';
import useSound from "use-sound";
import buttonSound from "../../../assets/sounds/button.mp3";
import questionSound from "../../../assets/sounds/question.mp3";
import {useSelector} from "react-redux";
import {SelectUserLetter, SelectUserRoom} from "../../../redux/store/socket/selector";
import complainImg from "../assets/complain.png";
import LoginRequired from "../../../components/LoginRequired";
import {SelectIsAuthorized} from "../../../redux/store/user/selector";
import {SelectIsSoundMuted, SelectTips} from "../../../redux/store/game/selector";
import ModalHints from "../../../components/ModalHints";
import {getAnimalByLetter} from "../../../helpers/animalHelp";

const GameRunningItem = (d: {
    players: { id: string, letter: string }[],
    timer: number,
    multiplayer: boolean,
    question: { question: string; answers: string[] },
    currentStep: string, handleAnswer: any,
    handleSkip: any,
    isAnswered: boolean,
    gameStage: number,
    onShowAlert: any,
    setReported: any,
    showTimer: boolean,
    handleReport: any,
    voted: any,
    leader: string
}) => {

    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });

    const userLetter = useSelector(SelectUserLetter);
    const [showModal, setShowModal] = useState(false);
    const tipsEnabled = useSelector(SelectTips);
    const userRoom = useSelector(SelectUserRoom);
    const isAuthorized = useSelector(SelectIsAuthorized)
    const [questionSoundLoad, setQuestionSoundLoad] = useState(false);
    const [playQuestion] = useSound(questionSound, {
        onload: () => setQuestionSoundLoad(true),
        volume: isSoundMuted ? 0 : 1
    });
    useEffect(() => {
        if (questionSoundLoad) {
            playQuestion();
        }
    }, [questionSoundLoad])

    const [selectedIndex, setSelectedIndex] = useState<number>();

    const submitAnswer = () => {
        if (selectedIndex !== undefined) {
            playButton();
            d.handleAnswer(selectedIndex)
            setSelectedIndex(undefined);
        }
    }

    useEffect(() => {
        console.log(d.currentStep)
        setShowModal(true);
    }, [d.currentStep])

    return (
        <Box className={style.gameRunningScreen}>
            {showModal && tipsEnabled && <ModalHints img={getAnimalByLetter(userRoom.single ? d.currentStep : userLetter)} leader={userRoom.single ? d.currentStep === d.leader : userLetter === d.leader} onClose={() => setShowModal(false)}/>}
            {!d.isAnswered && <Box className={style.answers}>
                <Box className={style.content}>
                    {d.question.answers.map((a, i) =>
                        <Button key={i} onClick={() => {setSelectedIndex(i); playButton()}} className={selectedIndex === i ? 'cloud' : 'unselected_answer' }>
                            {a}
                        </Button>)}

                </Box>
            </Box>}
            {d.isAnswered && <h1 className={style.waiting}>Waiting while other players answering..</h1>}

            {d.showTimer && <Box className={style.timer}>
                {d.timer}
            </Box>}

            {!d.isAnswered &&
            <>
                <Typography className={style.timer_subtitle}>answer secretly!</Typography>
                <Box className={style.control_buttons}>
                    <Button onClick={() => {d.handleSkip(); playButton()}} className={style.skip_buttons}>
                        <img src={beerIcon} alt="" className={style.beer_icon}/>
                        skip
                    </Button>

                    {d.voted !== 'report' && <img onClick={() => {playButton(); !isAuthorized ? d.onShowAlert() : d.handleReport();}} src={complainImg} alt="" />}

                    <Button onClick={() => submitAnswer()} className={style.submit_buttons}>Ок</Button>
                </Box>
            </>
            }
        </Box>
    );
};

export default GameRunningItem;
