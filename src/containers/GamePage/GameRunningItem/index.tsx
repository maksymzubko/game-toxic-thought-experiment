import React, {useState} from 'react';
import {Avatar, Box, Typography} from "@mui/material";
import style from "../style.module.css";
import {getAnimalByLetter} from "../../../helpers/animalHelp";
import Button from "../../../components/Button";
import beerIcon from '../assets/beer-icon.png';

const GameRunningItem = (d: { players: { id: string, letter: string }[], timer: number, multiplayer: boolean, question: { question: string; answers: string[] }, currentStep: string, handleAnswer: any, handleSkip: any, isAnswered: boolean }) => {
    const getClassName = (letter: string) => {
        if (d.multiplayer || letter === d.currentStep)
            return style.current;
        else return "";
    }
    console.log('players', d.players);
    const [selectedIndex, setSelectedIndex] = useState<number>();

    const submitAnswer = () => {
        if (selectedIndex !== undefined) {
            d.handleAnswer(selectedIndex)
            setSelectedIndex(undefined);
        }
    }

    return (
        <Box style={{width: "100%"}}>
            {/*<Box className={style.players_list}>*/}
            {/*    <h1>players: </h1>*/}
            {/*    <Box className={style.players_list_avatars}>*/}
            {/*        {d.players.map(p => <Avatar className={getClassName(p.letter)}*/}
            {/*                                    src={getAnimalByLetter(p.letter)} alt={'animal' + p.letter}/>)}*/}
            {/*    </Box>*/}
            {/*</Box>*/}

            {/*<Box className={style.question}>*/}
            {/*    <h1>*/}
            {/*        question:*/}
            {/*    </h1>*/}
            {/*    <Box className={style.content}>*/}
            {/*        {d.question.question}*/}
            {/*    </Box>*/}
            {/*</Box>*/}

            {!d.isAnswered && <Box className={style.answers}>
                {/*<h1>*/}
                {/*    answers:*/}
                {/*</h1>*/}
                <Box className={style.content}>
                    {d.question.answers.map((a, i) =>
                        <Button onClick={() => setSelectedIndex(i)} className={selectedIndex === i ? 'cloud' : 'unselected_answer' }>
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
                    <Button onClick={d.handleSkip} className={style.skip_buttons}>
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
