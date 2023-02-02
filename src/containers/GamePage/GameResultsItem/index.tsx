import React, {useEffect, useState} from 'react';
import {Avatar, AvatarGroup, Badge, Box} from "@mui/material";
import {Result} from "../index";
import style from "../style.module.css";
import Button from "../../../components/Button";
import {useSelector} from "react-redux";
import {SelectSocket, SelectUserLetter, SelectUserRoom} from "../../../redux/store/socket/selector";
import {getAnimalByLetter, getAnimalNameByLetter} from "../../../helpers/animalHelp";

const GameResultItem = (d: { result: Result, question: { question: string; answers: string[] }, passDrinkAnimals: any, setUserDrinkStatus: any }) => {
    const socket = useSelector(SelectSocket);
    const userLetter = useSelector(SelectUserLetter);
    const userRoom = useSelector(SelectUserRoom);

    const [correct, setCorrect] = useState(-1);
    const [showResult, setShowResult] = useState(true);
    useEffect(() => {
        setCorrect(d.result.correct);
    }, [d.result])

    const isDrinking = () => {
        if(userRoom.single)
        {
            const whoDrinking = d.result.results.filter(r=>!r.answer.isCorrect);
            d.passDrinkAnimals(whoDrinking);
        }
        else {
            const status = d.result.results.filter(p=>p.player === userLetter)[0].answer.isCorrect;
            if (status) {
                d.setUserDrinkStatus('You not drinking!', false);
            } else {
                d.setUserDrinkStatus('You drinking!', true);
            }

        }

    }

    const handleGameStart = () => {
        socket?.emit('startGame');
    }

    const handleLeave = () => {
        socket?.emit('leaveRoom');
    }

    const badgeStyle = {
        "& .MuiBadge-badge": {
            transform: 'translate(-50%, -50%)',
            left: '50%',
        }
    }

    const getListVoted = (variant: number) => {
        return (
            <AvatarGroup max={2}>
                {d.result.results
                    .filter(r => r.answer.variant === variant)
                    .map(a => <Avatar src={getAnimalByLetter(a.player ?? "")} alt={'animal-img'}></Avatar>)}
            </AvatarGroup>
        )
    }

    if(d.result.results.length > 0)
    return (
        <Box className={style.results}>
            {showResult ?
                <>
                    <Box className={style.players_list}>
                        <Box className={style.answers}>
                            <Box className={style.content}>
                                {d.question.answers.map((a, i) =>
                                    <Badge style={{width: '100%'}} badgeContent={getListVoted(i)} sx={{badgeStyle}}
                                           anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                                        <Button className={correct === i ? 'cloud correct' : 'cloud incorrect'}>
                                            {a}
                                        </Button>
                                    </Badge>
                                )}
                                <Badge style={{width: '100%'}} badgeContent={getListVoted(-1)} sx={{badgeStyle}}  anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                                    <Button className={correct === -1 ? 'cloud correct' : 'cloud incorrect'}>
                                        skip (drink)
                                    </Button>
                                </Badge>
                            </Box>
                        </Box>
                    </Box>
                    <Box className={style.result_buttons}>
                        <Button onClick={() => isDrinking()} className={style.drink_button}>Continue</Button>
                    </Box>
                </>
                :
                <Box>
                    <h1>
                        {isDrinking()}
                    </h1>
                    <Box className={style.result_buttons}>
                        {userRoom.isOwner && <Button onClick={handleGameStart}>continue</Button>}
                        <Button onClick={handleLeave}>leave</Button>
                    </Box>
                </Box>
            }
        </Box>
    );
    else
        return <Box></Box>
};

export default GameResultItem;
