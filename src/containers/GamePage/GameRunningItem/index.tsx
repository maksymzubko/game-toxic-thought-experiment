import React, {useEffect, useState} from 'react';
import {Avatar, Box, Typography} from "@mui/material";
import style from "../style.module.css";
import {getAnimalByLetter} from "../../../helpers/animalHelp";
import Button from "../../../components/Button";
import beerIcon from '../assets/beer-icon.png';
import useSound from "use-sound";
import buttonSound from "../../../assets/sounds/button.mp3";
import questionSound from "../../../assets/sounds/question.mp3";

const GameRunningItem = (d: { players: { id: string, letter: string }[], timer: number, multiplayer: boolean, question: { question: string; answers: string[] }, currentStep: string, handleAnswer: any, handleSkip: any, isAnswered: boolean }) => {

    const [playButton] = useSound(buttonSound);

    const [questionSoundLoad, setQuestionSoundLoad] = useState(false)
    const [playQuestion] = useSound(questionSound, {
        onload: () => setQuestionSoundLoad(true)
    });
    useEffect(() => {
        if (questionSoundLoad) {
            playQuestion();
        }
    }, [questionSoundLoad])

    const getClassName = (letter: string) => {
        if (d.multiplayer || letter === d.currentStep)
            return style.current;
        else return "";
    }
    console.log('players', d.players);
    const [selectedIndex, setSelectedIndex] = useState<number>();

    const submitAnswer = () => {
        if (selectedIndex !== undefined) {
            playButton();
            d.handleAnswer(selectedIndex)
            setSelectedIndex(undefined);
        }
    }

    return (
        <Box style={{width: "100%"}}>
            {!d.isAnswered && <Box className={style.answers}>
                <Box className={style.content}>
                    {d.question.answers.map((a, i) =>
                        <Button onClick={() => {setSelectedIndex(i); playButton()}} className={selectedIndex === i ? 'cloud' : 'unselected_answer' }>
                            {a}
                        </Button>)}

                </Box>
            </Box>}
            {d.isAnswered && <h1 className={style.waiting}>Waiting while other players answering..</h1>}

            <Box className={style.timer}>
                {d.timer}
            </Box>
            {!d.isAnswered &&
            <>
                <Typography className={style.timer_subtitle}>answer secretly!</Typography>
                <Box className={style.control_buttons}>
                    <Button onClick={() => {d.handleSkip(); playButton()}} className={style.skip_buttons}>
                        <img src={beerIcon} alt="" className={style.beer_icon}/>
                        skip
                    </Button>

                    <Button onClick={() => submitAnswer()} className={style.submit_buttons}>Ок</Button>
                </Box>
            </>
            }
        </Box>
    );
};

export default GameRunningItem;
