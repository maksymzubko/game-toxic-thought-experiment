import React from 'react';
import {Avatar, Box} from "@mui/material";
import style from "../style.module.css";
import {getAnimalByLetter} from "../../../helpers/animalHelp";
import Button from "../../../components/Button";

const GameRunningItem = (d: { players: { id: string, letter: string }[], timer: number, multiplayer: boolean, question: { question: string; answers: string[] }, currentStep: string, handleAnswer: any, handleSkip: any, isAnswered: boolean }) => {
    const getClassName = (letter: string) => {
        if (d.multiplayer || letter === d.currentStep)
            return style.current;
        else return "";
    }

    return (
        <Box style={{width: "100%"}}>
            <Box className={style.players_list}>
                <h1>players: </h1>
                <Box className={style.players_list_avatars}>
                    {d.players.map(p => <Avatar className={getClassName(p.letter)}
                                                src={getAnimalByLetter(p.letter)} alt={'animal' + p.letter}/>)}
                </Box>
            </Box>

            <Box className={style.question}>
                <h1>
                    question:
                </h1>
                <Box className={style.content}>
                    {d.question.question}
                </Box>
            </Box>

            {!d.isAnswered && <Box className={style.answers}>
                <h1>
                    answers:
                </h1>
                <Box className={style.content}>
                    {d.question.answers.map((a, i) =>
                        <Button onClick={() => d.handleAnswer(i)}>
                            {a}
                        </Button>)}
                    <Button onClick={d.handleSkip}>
                        skip (drink)
                    </Button>
                </Box>
            </Box>}

            {d.isAnswered && <h1 className={style.waiting}>Waiting while other players answering..</h1>}

            <Box className={style.timer}>
                {d.timer}
            </Box>
        </Box>
    );
};

export default GameRunningItem;