import React, {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import style from "../style.module.css";
import Button from "../../../components/Button";
import beerIcon from '../assets/beer-icon.png';
import useSound from "use-sound";
import buttonSound from "../../../assets/sounds/button.mp3";
import questionSound from "../../../assets/sounds/question.mp3";
import {useSelector} from "react-redux";
import {SelectIsSoundMuted} from "../../../redux/store/socket/selector";
import complainImg from "../assets/complain.png";
import LoginRequired from "../../../components/LoginRequired";

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
}) => {

    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });

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

    return (
        <Box className={style.gameRunningScreen}>
            {!d.isAnswered && <Box className={style.answers}>
                <Box className={style.content}>
                    {d.question.answers.map((a, i) =>
                        <Button key={i} onClick={() => {setSelectedIndex(i); playButton()}} className={selectedIndex === i ? 'cloud' : 'unselected_answer' }>
                            {a}
                        </Button>)}

                </Box>
            </Box>}
            {d.isAnswered && <h1 className={style.waiting}>Waiting while other players answering..</h1>}

            {d.gameStage !== 1 &&
                <Box className={style.timer}>
                    {d.timer}
                </Box>
            }
            {!d.isAnswered &&
            <>
                <Typography className={style.timer_subtitle}>answer secretly!</Typography>
                <Box className={style.control_buttons}>
                    <Button onClick={() => {d.handleSkip(); playButton()}} className={style.skip_buttons}>
                        <img src={beerIcon} alt="" className={style.beer_icon}/>
                        skip
                    </Button>

                    <img onClick={() => {playButton(); d.onShowAlert()}} src={complainImg} alt="" />

                    <Button onClick={() => submitAnswer()} className={style.submit_buttons}>Ок</Button>
                </Box>
            </>
            }
        </Box>
    );
};

export default GameRunningItem;
